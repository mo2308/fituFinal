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

function sendPasswordReset() {
    const auth = firebase.auth();
    const emailAddress = document.querySelector('.input').value;

    auth.sendPasswordResetEmail(emailAddress).then(function() {
        // Email sent.
        alert('Passwort-Reset-E-Mail wurde gesendet!');
    }).catch(function(error) {
        // An error happened.
        alert('Fehler: ' + error.message);
    });
}
