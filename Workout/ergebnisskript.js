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

let allWorkouts = [];

/*

// Funktion, um ein Workout-Card mit Daten zu erstellen
function createWorkoutCard(workoutData) {
    const template = document.getElementById('workout-card-template').content.cloneNode(true);
    template.querySelector('.workout-image').src = workoutData.bannerImage;
    template.querySelector('.workoutName').textContent = workoutData.name;
    template.querySelector('.time p').textContent = workoutData.duration;
    template.querySelector('.rating p').textContent = workoutData.level;

    // Setzen des Links im Button
    const button = template.querySelector('.btn');
    button.onclick = function() {
        window.location.href = workoutData.link; // Setzen Sie hier den Link aus den Daten
    };
    
    return template;
}

*/

// Funktion zum Erstellen einer Workout-Karte
function createWorkoutCard(workout) {
    
    const cardWorkout = document.createElement('div');
    cardWorkout.className = 'cardWorkout';

    const imageDiv = document.createElement('div');
    imageDiv.className = 'image';

    const workoutImage = document.createElement('img');
    workoutImage.src = workout.bannerImage;
    workoutImage.alt = 'Workout Image';
    workoutImage.className = 'image';

    imageDiv.appendChild(workoutImage);

    const workoutNameDiv = document.createElement('div');
    workoutNameDiv.className = 'workoutName';
    workoutNameDiv.textContent = workout.name;

    const lastRowDiv = document.createElement('div');
    lastRowDiv.className = 'lastRow';

    const timeDiv = document.createElement('div');
    timeDiv.className = 'time';

    const timeImage = document.createElement('img');
    timeImage.src = './images/clock.svg';

    const timeParagraph = document.createElement('p');
    timeParagraph.id = 'workoutDuration';
    timeParagraph.textContent = `${workout.duration}`;

    timeDiv.appendChild(timeImage);
    timeDiv.appendChild(timeParagraph);

    const ratingDiv = document.createElement('div');
    ratingDiv.className = 'rating';

    const levelParagraph = document.createElement('p');
    levelParagraph.id = 'workoutLevel';
    levelParagraph.textContent = workout.level;

    ratingDiv.appendChild(levelParagraph);

    const startButton = document.createElement('button');
    startButton.className = 'btn';
    startButton.textContent = 'Start';
    startButton.onclick = function() {
        window.location.href = workout.link;
    };

    lastRowDiv.appendChild(timeDiv);
    lastRowDiv.appendChild(ratingDiv);
    lastRowDiv.appendChild(startButton);

    cardWorkout.appendChild(imageDiv);
    cardWorkout.appendChild(workoutNameDiv);
    cardWorkout.appendChild(lastRowDiv);

    // workoutsContainer.appendChild(cardWorkout);
    return cardWorkout;
  }

// Funktion zum Hinzufügen der Workout-Cards zum DOM
function addWorkoutCardsToDOM(workouts) {
    const workoutsContainer = document.getElementById('workoutsContainer');
    // Löschen Sie vorhandene Karten, um die neuen Suchergebnisse anzuzeigen
    workoutsContainer.innerHTML = '';
    workouts.forEach(workoutData => {
        const workoutCard = createWorkoutCard(workoutData);
        workoutsContainer.appendChild(workoutCard);
    });
    document.querySelector('.Trainingsart h2').textContent = `${workouts.length} results for your search`;
}


function loadAllWorkouts() {
    db.collection('Workouts').get().then(querySnapshot => {
        allWorkouts = []; // Zurücksetzen der Workouts-Liste
        querySnapshot.forEach(doc => {
            allWorkouts.push(doc.data());
        });
        filterAndDisplayWorkouts(); // Filtern und Anzeigen beim initialen Laden
    }).catch(error => {
        console.error("Error getting documents: ", error);
    });
}


// Funktion zum Filtern und Anzeigen der Workouts
function filterAndDisplayWorkouts() {
    let filteredWorkouts = [...allWorkouts];

    // Filtern nach Kategorien
    const selectedCategories = Array.from(document.querySelectorAll('.workoutcategory input[type="checkbox"]:checked'))
                                   .map(button => button.nextSibling.textContent.toLowerCase().trim());
    if (selectedCategories.length > 0) {
        filteredWorkouts = filteredWorkouts.filter(workout => selectedCategories.includes(workout.category.toLowerCase()));
    }

    // Filtern nach Workout-Typen
    const selectedWorkoutTypes = Array.from(document.querySelectorAll('.workouttype input[type="checkbox"]:checked'))
                                      .map(checkbox => checkbox.nextSibling.textContent.toLowerCase().trim());
    if (selectedWorkoutTypes.length > 0) {
        filteredWorkouts = filteredWorkouts.filter(workout => selectedWorkoutTypes.includes(workout.type.toLowerCase()));
    }

    // Filtern nach Fitnesslevel
    const selectedFitnessLevels = Array.from(document.querySelectorAll('.level input[type="checkbox"]:checked'))
                                       .map(checkbox => checkbox.nextSibling.textContent.toLowerCase().trim());
    if (selectedFitnessLevels.length > 0) {
        filteredWorkouts = filteredWorkouts.filter(workout => selectedFitnessLevels.includes(workout.level.toLowerCase()));
    }

    addWorkoutCardsToDOM(filteredWorkouts);
    
}

document.addEventListener('DOMContentLoaded', () => {

    loadAllWorkouts(); // Lädt alle Workouts beim ersten Laden der Seite

    // Event Listener für jede Checkbox
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            filterAndDisplayWorkouts(); // Filtern und Anzeigen der Workouts bei jeder Änderung
        });
    });

    // Wiederherstellen der Checkbox-Zustände
    const checkboxStates = JSON.parse(sessionStorage.getItem('checkboxStates'));
    if (checkboxStates) {
        Object.keys(checkboxStates).forEach(checkboxId => {
            const checkbox = document.getElementById(checkboxId);
            if (checkbox) {
                checkbox.checked = checkboxStates[checkboxId];
            }
        });
    }
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