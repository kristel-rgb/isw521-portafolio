"use strict";

/* ==============================
   Botón de modo oscuro
============================== */

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            themeToggle.textContent = "Modo claro";
        } else {
            themeToggle.textContent = "Modo oscuro";
        }
    });
}

/* ==============================
   Ejercicio 1: FizzBuzz clásico
============================== */

console.log("Ejercicio 1: FizzBuzz clásico");

let resultadoFizzBuzz = "";

for (let i = 1; i <= 30; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
        resultadoFizzBuzz += "FizzBuzz\n";
        console.log("FizzBuzz");
    } else if (i % 3 === 0) {
        resultadoFizzBuzz += "Fizz\n";
        console.log("Fizz");
    } else if (i % 5 === 0) {
        resultadoFizzBuzz += "Buzz\n";
        console.log("Buzz");
    } else {
        resultadoFizzBuzz += i + "\n";
        console.log(i);
    }
}

const resultadoFizzBuzzHTML = document.getElementById("resultadoFizzBuzz");

if (resultadoFizzBuzzHTML) {
    resultadoFizzBuzzHTML.textContent = resultadoFizzBuzz;
}

console.log("-----------------------------");

/* ==============================
   Ejercicio 3: Suma de un arreglo
============================== */

console.log("Ejercicio 3: Suma de un arreglo");

const numeros = [4, 8, 15, 16, 23, 42];
let suma = 0;

for (let numero of numeros) {
    suma += numero;
}

const resultadoSuma = 
    "Arreglo: " + numeros.join(", ") + "\n" +
    "La suma total es: " + suma;

const resultadoSumaHTML = document.getElementById("resultadoSuma");

if (resultadoSumaHTML) {
    resultadoSumaHTML.textContent = resultadoSuma;
}

console.log("Arreglo: " + numeros.join(", "));
console.log("La suma total es: " + suma);

/* ==============================
   Formulario de contacto
============================== */

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const message = document.getElementById("message").value.trim();

        if (name === "" || message === "") {
            alert("Por favor complete el nombre y el mensaje.");
            return;
        }

        alert("Gracias, " + name + ". Su mensaje fue registrado correctamente.");

        contactForm.reset();
    });
}