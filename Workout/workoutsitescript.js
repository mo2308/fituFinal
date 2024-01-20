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

// Event-Listener für das Suchformular
document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();


    // Beginnen Sie mit einer allgemeinen Abfrage
    let workoutsQuery = db.collection('Workouts');

    // Führen Sie die Abfrage aus und filtern Sie die Ergebnisse nach den Kriterien im Client
    workoutsQuery.get().then(querySnapshot => {
        let workouts = [];
        querySnapshot.forEach(doc => {
            workouts.push(doc.data());
        });


        // Filtern nach Kategorien
        const selectedCategories = Array.from(document.querySelectorAll('.trainingsKategorie input[type="checkbox"]:checked'))
                                       .map(button => button.nextSibling.textContent.toLowerCase().trim());
        if (selectedCategories.length > 0) {
            workouts = workouts.filter(workout => selectedCategories.includes(workout.category.toLowerCase()));
        }

        // Filtern nach Workout-Typen
        const selectedWorkoutTypes = Array.from(document.querySelectorAll('.Linkeseite input[type="checkbox"]:checked'))
                                          .map(checkbox => checkbox.nextSibling.textContent.toLowerCase().trim());
        if (selectedWorkoutTypes.length > 0) {
            workouts = workouts.filter(workout => selectedWorkoutTypes.includes(workout.type.toLowerCase()));
        }

        // Filtern nach Fitnesslevel
        const selectedFitnessLevels = Array.from(document.querySelectorAll('.Rechteseite input[type="checkbox"]:checked'))
                                           .map(checkbox => checkbox.nextSibling.textContent.toLowerCase().trim());
        if (selectedFitnessLevels.length > 0) {
            workouts = workouts.filter(workout => selectedFitnessLevels.includes(workout.level.toLowerCase()));
        }

        
        const checkboxStates = {
            confirm1: document.getElementById('confirm1').checked,
            confirm2: document.getElementById('confirm2').checked,
            confirm3: document.getElementById('confirm3').checked,
            confirm4: document.getElementById('confirm4').checked,
            confirm5: document.getElementById('confirm5').checked,
            confirm6: document.getElementById('confirm6').checked,
            confirm7: document.getElementById('confirm7').checked,
            confirm8: document.getElementById('confirm8').checked,
            confirm9: document.getElementById('confirm9').checked,
            confirm10: document.getElementById('confirm10').checked,
            confirm11: document.getElementById('confirm11').checked,
            confirm12: document.getElementById('confirm12').checked
        };

        
        // Speichern Sie die gefilterten Ergebnisse im SessionStorage und leiten Sie zur Ergebnisseite weiter
        sessionStorage.setItem('checkboxStates', JSON.stringify(checkboxStates));
        sessionStorage.setItem('searchResults', JSON.stringify(workouts));
        window.location.href = 'ergebnis.html';
    }).catch(error => {
        console.error("Error getting documents: ", error);
    });
});

document.getElementById('logout').addEventListener('click', function() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        window.location.href = "../LogIn/loginscreen.html";
        console.log('User signed out');
    }).catch((error) => {
        // An error happened.
        console.error('Error signing out: ', error);
    });
});


