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
  const resultSection = document.querySelector('.result-section');
  const calculateButton = document.querySelector('.calculate-button');

  //Authentifizierungsstatus überprüfen
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      const userId = user.uid;

  document.getElementById('calculaterForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Verhindern, dass das Formular normal gesendet wird

    // BMR Berechnung
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    const age = document.getElementById('age').value;
    const sex = document.getElementById('sex').value;
    const activityLevel = document.getElementById('activitylevel').value;

    let bmrresult;
    if(sex === "female") {
      bmrresult = 655.1 + (9.563 * parseFloat(weight)) + (1.850 * parseFloat(height)) - (4.676 * parseFloat(age));
    } else {
      bmrresult = 66.5 + (13.75 * parseFloat(weight)) + (5.003 * parseFloat(height)) - (6.75 * parseFloat(age));
    }

    // Aktualisiere das BMR-Ergebnis auf der Seite
    document.getElementById('bmrresult').textContent = `${bmrresult.toFixed(0)} calories/day`;

    // TDEE Berechnung
    const tdeeMultiplier = {
      sedentary: 1.2,
      lightexercise: 1.375,
      moderateexercise: 1.55,
      hardexercise: 1.725,
      physicaljob: 1.9,
      professionalathelete: 2.3
    };

    const tdeeresult = bmrresult * (tdeeMultiplier[activityLevel] || 1); // Fallback, falls keine Auswahl getroffen wurde

    saveResultsToFirebase(userId, weight, height, age, sex, activityLevel, bmrresult.toFixed(2), tdeeresult.toFixed(2));

    // Aktualisiere das TDEE-Ergebnis auf der Seite
    document.getElementById('tdeeresult').textContent = `${tdeeresult.toFixed(0)} calories/day`;

    // Zeige die Ergebnisse an
    resultSection.classList.remove('hidden');

    // Ändere den Text des Buttons
    calculateButton.textContent = 'Recalculate';
  });

  // Hier können wir auch die Logik für den "Start Over" Button implementieren
  // Zum Beispiel könnte ein Klick auf den Button das Formular zurücksetzen
  const startOverButton = document.querySelector('.start-over-button');
  startOverButton.addEventListener('click', function() {
    // Setzt das Formular zurück
    document.getElementById('calculaterForm').reset();
    // Versteckt die Ergebnisse
    resultSection.classList.add('hidden');
    // Stellt den ursprünglichen Text des Buttons wieder her
    calculateButton.textContent = 'Calculate';
  });
  } else {
    // Benutzer ist nicht angemeldet, also leite zu einer Anmeldeseite oder einer Fehlermeldung um
    // Zum Beispiel: window.location.href = 'signin.html';
  }
});
});

// Dies ist die Funktion, um Daten in Firebase zu speichern
function saveResultsToFirebase(userId, weight, height, age, sex, activityLevel, bmrresult, tdeeresult) {
  firebase.database().ref('users/' + userId).update({
    weight: weight,
    height: height,
    age: age,
    sex: sex,
    activityLevel: activityLevel,
    bmrresult: bmrresult,
    tdeeresult: tdeeresult
  });
}
