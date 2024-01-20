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

// Funktion, um die E-Mail-Verifizierung zu überprüfen
function checkEmailVerification() {
  const user = firebase.auth().currentUser;

  user.reload().then(() => {
    if (user.emailVerified) {
      // Wenn die E-Mail verifiziert wurde, leiten Sie den Nutzer um
      window.location.href = "../tdeecalculator/tdeecalculator.html";
    } else {
      alert("Email address is not approved yet.");
    }
  }).catch((error) => {
    console.error('Error: ', error);
    alert('An error occurred. Please try again.');
  });
}

// Funktion, um die Bestätigungs-E-Mail erneut zu senden
function resendVerificationEmail() {
  const user = firebase.auth().currentUser;

  user.sendEmailVerification().then(() => {
    alert("Verification email has been resent. Please check your inbox.");
  }).catch((error) => {
    console.error('Error sending verification email: ', error);
    alert('Error sending verification email. Please try again.');
  });
}

// Event-Listener für den "Done"-Button
document.querySelector('.button').addEventListener('click', checkEmailVerification);

// Event-Listener für den "Resent email"-Link
document.querySelector('#resendEmailLink').addEventListener('click', resendVerificationEmail);
