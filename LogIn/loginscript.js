// Konfiguration für Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCsOabMMqTB6EMLIeC5S7WR7zH1g-W58cA",
  authDomain: "fittastic-f8679.firebaseapp.com",
  projectId: "fittastic-f8679",
  storageBucket: "fittastic-f8679.appspot.com",
  messagingSenderId: "1082225053813",
  appId: "1:1082225053813:web:ce714f37ec4a651672a83c",
  measurementId: "G-TVEX1FCXP8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', function() {
// Referenz auf das Anmeldeformular und Eingabefelder
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");

// Funktion zum Schütteln des Passwortfeldes und Anzeigen einer Fehlermeldung
function shakePasswordInput(errorMessage) {
passwordInput.classList.add('invalid'); // Fügt die Klasse für die Schüttelanimation hinzu
message.innerText = errorMessage;
message.style.display = 'block';

// Entferne die Klasse nach der Animation
passwordInput.addEventListener('animationend', () => {
  passwordInput.classList.remove('invalid');
});
}

loginForm.addEventListener("submit", function(e) {
e.preventDefault();

const email = emailInput.value;
const password = passwordInput.value;

// Firebase-Anmeldeprozess
firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Anmeldung erfolgreich, Weiterleitung zum Homescreen
    window.location.href = "../Home/homescreen.html"; // Ersetzen Sie dies durch die tatsächliche URL oder den Pfad zu Ihrer Homescreen-Seite.
    sessionStorage.setItem('userID', userCredential.user.uid);
  })
  .catch((error) => {
    // Anmeldung fehlgeschlagen, Schütteln des Passwortfeldes und Anzeige einer Fehlermeldung
    shakePasswordInput(`Wrong password. Try again`);
  });
});
});

// Toggle Password visibility //
function togglePassword() {
  var password = document.getElementById("password");
  var togglePasswordIcon = document.querySelector(".toggle-password");
  
  if (password.type === "password") {
      password.type = "text";
      togglePasswordIcon.src = "icons8-sichtbar-60.png"; // Bild für sichtbares Passwort
  } else {
      password.type = "password";
      togglePasswordIcon.src = "icons8-unsichtbar-60.png"; // Bild für unsichtbares Passwort
  }
}