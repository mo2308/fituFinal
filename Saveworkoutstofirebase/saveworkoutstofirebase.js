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
const db = firebase.firestore();

// Formular und Button referenzieren
const form = document.getElementById('addworkoutsForm');
const submitButton = document.querySelector('.button');

form.addEventListener('submit', function (e) {
  e.preventDefault(); // Formular-Standardverhalten verhindern

  // Daten aus dem Formular extrahieren
  const documentName = document.getElementById('documentname').value;
  const category = document.getElementById('category').value;
  const duration = document.getElementById('duration').value;
  const level = document.getElementById('level').value;
  const name = document.getElementById('name').value;
  const type = document.getElementById('type').value;

  // Bild-URL aus dem Storage abrufen
  const storagePath = 'workoutbanner/' + documentName + '_banner.jpg';
  const storageRef = firebase.storage().ref(storagePath);

  // URL auf Seite referenzieren
  const linkhtml = '../workouts/' + documentName + '/' + documentName + '.html';

  storageRef.getDownloadURL()
    .then((url) => {
      return db.collection('Workouts').doc(documentName).set({
        bannerImage: url,
        category: category,
        duration: duration,
        level: level,
        link: linkhtml,
        name: name,
        type: type
      });
    })
    .then(() => {
      console.log("Dokument erfolgreich in Firestore erstellt!");
      alert("Dokument erfolgreich in Firestore erstellt!");
      form.reset();
    })
    .catch((error) => {
      console.error("Fehler beim Erstellen des Dokuments:", error);
      alert("Fehler beim Erstellen des Dokuments:", error);
    });
});