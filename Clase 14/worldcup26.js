"use strict";

/* ─────────────────────────:contentReference[oaicite:0]{index=0}GURACIÓN
────────────────────────────────────────────────────── */
const BASE = "https://worldcup26.ir";

/* ──────────────────────────────────────────────────────
   ESTADO DE APLICACIÓN
   Separamos claramente los recursos para que el fallo
   de uno no contamine el estado de los otros.
────────────────────────────────────────────────────── */
const state = {
  teams: [],   // Array<{id, name_en, flag, ...}>

  // NUEVO:
  // Aquí se guardan los grupos obtenidos desde /get/groups.
  // Cada grupo trae su nombre: A, B, C, etc.
  // Y dentro trae los team_id que pertenecen a ese grupo.
  groups: []
};

/* ──────────────────────────────────────────────────────
   SELECTORES DOM
────────────────────────────────────────────────────── */
const teamSelect     = document.getElementById("teamSelect");
const teamInfo       = document.getElementById("teamInfo");
const cardsGrid      = document.getElementById("cardsGrid");
const statsBar       = document.getElementById("statsBar");
const sectionEyebrow = document.getElementById("sectionEyebrow");
const citiesSection  = document.getElementById("citiesSection");
const apiStatus      = document.getElementById("apiStatus");

// NUEVO:
// Selectores específicos para mostrar la información del equipo.
const teamFlagImg = document.getElementById("teamFlagImg");
const teamName    = document.getElementById("teamName");
const teamGroup   = document.getElementById("teamGroup");

/* ──────────────────────────────────────────────────────
   UTILIDAD: normalizar respuesta de la API
   Algunas APIs devuelven:
   { teams: [...] }
   y otras podrían devolver directamente:
   [...]
   Esta función permite aceptar ambos formatos.
────────────────────────────────────────────────────── */
function normalizeApiList(jsondata, key) {
  if (Array.isArray(jsondata)) {
    return jsondata;
  }

  if (Array.isArray(jsondata?.[key])) {
    return jsondata[key];
  }

  return [];
}

/* ──────────────────────────────────────────────────────
   UTILIDAD: obtener URL de bandera
   La API puede traer la bandera como:
   team.flag
   team.flag_url
   team.flagUrl
   Esta función revisa esas posibles opciones.
────────────────────────────────────────────────────── */
function getTeamFlag(team) {
  return team.flag ?? team.flag_url ?? team.flagUrl ?? "";
}

/* ──────────────────────────────────────────────────────
   NUEVO: BUSCAR GRUPO DEL EQUIPO
   Recorre state.groups y busca en cuál grupo aparece
   el team_id del equipo seleccionado.
────────────────────────────────────────────────────── */
function getTeamGroup(teamId) {
  const foundGroup = state.groups.find(group => {
    return group.teams?.some(member => {
      const memberTeamId = member.team_id ?? member.id ?? member.teamId;
      return String(memberTeamId) === String(teamId);
    });
  });

  if (!foundGroup) {
    return "Grupo no asignado";
  }

  const groupName = foundGroup.name ?? foundGroup.group ?? foundGroup.group_name;

  return `Grupo ${groupName}`;
}

/* ──────────────────────────────────────────────────────
   LIMPIAR INFORMACIÓN DEL EQUIPO
   Se usa cuando el usuario vuelve a seleccionar la opción
   vacía del select.
────────────────────────────────────────────────────── */
function clearTeamInfo() {
  teamInfo.style.display = "none";

  teamFlagImg.removeAttribute("src");
  teamFlagImg.alt = "Bandera del equipo";

  teamName.textContent = "—";
  teamGroup.textContent = "Grupo —";
}

/* ──────────────────────────────────────────────────────
   MOSTRAR INFORMACIÓN DEL EQUIPO
   Aquí se actualiza:
   - bandera
   - nombre
   - grupo
────────────────────────────────────────────────────── */
function renderTeamInfo(team) {
  const flagUrl = getTeamFlag(team);
  const name = team.name_en ?? `Equipo ${team.id}`;
  const group = getTeamGroup(team.id);

  teamInfo.style.display = "flex";

  if (flagUrl) {
    teamFlagImg.src = flagUrl;
    teamFlagImg.alt = `Bandera de ${name}`;
  } else {
    teamFlagImg.removeAttribute("src");
    teamFlagImg.alt = `Bandera no disponible para ${name}`;
  }

  teamName.textContent = name;
  teamGroup.textContent = group;
}

/* ──────────────────────────────────────────────────────
   POBLAR SELECTOR DE EQUIPOS
   Datos obtenidos de /get/teams, ordenados alfabéticamente.
────────────────────────────────────────────────────── */
function populateTeamSelector() {
  const sortedTeamList = [...state.teams].sort((a, b) => {
    const na = a.name_en ?? "";
    const nb = b.name_en ?? "";
    return na.localeCompare(nb);
  });

  teamSelect.innerHTML =
    `<option value="">— Selecciona un equipo (${sortedTeamList.length}) —</option>`;

  sortedTeamList.forEach(team => {
    const opt = document.createElement("option");
    opt.value = String(team.id);
    opt.textContent = team.name_en ?? `Equipo ${team.id}`;
    teamSelect.appendChild(opt);
  });

  teamSelect.disabled = false;
}

/* ──────────────────────────────────────────────────────
   EVENTO: cambio de equipo en el selector
────────────────────────────────────────────────────── */
function addEventToTeamSelect() {
  teamSelect.addEventListener("change", (event) => {
    const tid = event.target.value;

    if (!tid) {
      clearTeamInfo();
      return;
    }

    const selectedTeam = state.teams.find(team => {
      return String(team.id) === String(tid);
    });

    if (!selectedTeam) {
      clearTeamInfo();
      return;
    }

    renderTeamInfo(selectedTeam);
  });
}

/* ──────────────────────────────────────────────────────
   CARGAR DATOS DESDE LA API
   MODIFICADO:
   Ahora se cargan dos recursos:
   - /get/teams
   - /get/groups
────────────────────────────────────────────────────── */
async function init() {
  try {
    const [teamsResponse, groupsResponse] = await Promise.all([
      fetch(`${BASE}/get/teams`),
      fetch(`${BASE}/get/groups`)
    ]);

    const teamsData = await teamsResponse.json();
    const groupsData = await groupsResponse.json();

    state.teams = normalizeApiList(teamsData, "teams");
    state.groups = normalizeApiList(groupsData, "groups");

    populateTeamSelector();
    addEventToTeamSelect();

    apiStatus.textContent = "API worldcup26.ir · OK";
  } catch (err) {
    console.error("Error al cargar datos:", err);

    teamSelect.innerHTML = `<option value="">— Error al cargar equipos —</option>`;
    teamSelect.disabled = true;

    apiStatus.textContent = "API worldcup26.ir · Error";
  }
}

/* Punto de entrada */
init();