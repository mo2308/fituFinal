// Firebase-Konfiguration hier einfügen
const firebaseConfig = {
  apiKey: "AIzaSyCsOabMMqTB6EMLIeC5S7WR7zH1g-W58cA",
  authDomain: "fittastic-f8679.firebaseapp.com",
  projectId: "fittastic-f8679",
  storageBucket: "fittastic-f8679.appspot.com",
  messagingSenderId: "1082225053813",
  appId: "1:1082225053813:web:ce714f37ec4a651672a83c",
  measurementId: "G-TVEX1FCXP8"
};

firebase.initializeApp(firebaseConfig);


function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); 
  const day = String(today.getDate()).padStart(2, '0');

  const currentDate = `${year}-${month}-${day}`;
  return currentDate;
}

// Get uid from session storage
const uid = sessionStorage.getItem('userID');
// Reference to user path
const userRef = firebase.database().ref('users/' + uid);

const currentDate = getCurrentDate();

// Funktion zum Erstellen einer Workout-Karte
function createWorkoutCard(workout) {
  const workoutsContainer = document.getElementById('workoutsContainer');

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
  startButton.onclick = function () {
    window.location.href = workout.link;
  };

  lastRowDiv.appendChild(timeDiv);
  lastRowDiv.appendChild(ratingDiv);
  lastRowDiv.appendChild(startButton);

  cardWorkout.appendChild(imageDiv);
  cardWorkout.appendChild(workoutNameDiv);
  cardWorkout.appendChild(lastRowDiv);

  workoutsContainer.appendChild(cardWorkout);
}

function calcEaten() {
  // Variablen
  const refPath = `/users/${uid}`;
  let tdeeresult = 0;

  // Referenz auf den firebase Pfad
  const ref = firebase.database().ref(refPath);

  // Event-Listener für Änderungen hinzufügen
  ref.on("value", (snapshot) => {
    userData = snapshot.val();
    tdeeresult = userData.tdeeresult
    console.log("Aktualisierte Meal-Daten:", tdeeresult);

    let dailyCalories = null;

    let meals = null;
    if (userData.kalorientracker && userData.kalorientracker.dailyCalories[currentDate]) {
      dailyCalories = userData.kalorientracker.dailyCalories[currentDate];
      meals = dailyCalories.meals;
      console.log('Meals: ', meals);

    } else {
      const pathToUpdate = `users/${uid}/kalorientracker/dailyCalories/${currentDate}/meals/0`;

      const newMealData = {
        mealType: 'dummy',
        calories: 0,
        carbs: 0,
        protein: 0,
        fat: 0
      };

      const updates = {};
      updates[pathToUpdate] = newMealData;
      firebase.database().ref().update(updates)
        .then(() => {
          console.log("Neues Meal erfolgreich hinzugefügt!");
        })
        .catch((error) => {
          console.error("Fehler beim Hinzufügen des neuen Meals:", error.message);
        });
      dailyCalories = userData.kalorientracker.dailyCalories[currentDate];
      meals = dailyCalories.meals;
    }
    // Array zum Speichern der gefundenen Werte
    let calories = 0;
    let carbs = 0;
    let fat = 0;
    let protein = 0;

    let fatDaily = Math.round(userData.weight);
    let proteinDaily = Math.round(Number(userData.weight) * 2);
    let carbsDaily = Math.round((Math.round(tdeeresult) - (proteinDaily * 4 + fatDaily * 9)) / 4);

    function calcTracker(value) {
      let c = 0;
      // For-Schleife, um alle Werte aus dem "calories"-Attribut auszulesen
      for (const mealId in meals) {
        if (meals.hasOwnProperty(mealId)) {
          c = c + Number(meals[mealId][value]);
        }
      }
      return c;
    }

    calories = calcTracker('calories');
    console.log('CALORIES. ', calories);
    carbs = calcTracker('carbs');
    fat = calcTracker('fat');
    protein = calcTracker('protein');

    const carbsElement = document.getElementById('carbsValue');
    carbsElement.textContent = `${carbs} /${carbsDaily}`;

    const fatElement = document.getElementById('fatValue');
    fatElement.textContent = `${fat} /${fatDaily}`;

    const proteinElement = document.getElementById('proteinValue');
    proteinElement.textContent = `${protein} /${proteinDaily}`;

    let eaten = Math.round(tdeeresult) - calories;
    console.log('Benutzerdaten eaten:', eaten);
    const eatenElement = document.getElementById('eatenValue');
    eatenElement.textContent = calories;

    const restValue = document.getElementById('restValue');
    restValue.textContent = eaten;
  }, (error) => {
    console.error("Fehler beim Überwachen des Meals in Echtzeit:", error.message);
  });

}

document.addEventListener('DOMContentLoaded', function () {
  const db = firebase.firestore();
  let workoutsQuery = db.collection('Workouts');

  workoutsQuery.get().then(querySnapshot => {
    const allWorkouts = [];
    querySnapshot.forEach(doc => {
      allWorkouts.push(doc.data());
    });

    const shuffledWorkouts = allWorkouts.sort(() => 0.5 - Math.random());
    const selectedWorkouts = shuffledWorkouts.slice(0, 4);

    selectedWorkouts.forEach(workoutData => {
      console.log('Workout: ', workoutData);
      createWorkoutCard(workoutData);
    });
  });

  document.getElementById('logout').addEventListener('click', function () {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      window.location.href = "../LogIn/loginscreen.html";
      console.log('User signed out');
    }).catch((error) => {
      // An error happened.
      console.error('Error signing out: ', error);
    });
  });

});

document.addEventListener('DOMContentLoaded', calcEaten);


document.addEventListener('DOMContentLoaded', function () {

  // Einmalige Abfrage (once) der Daten
  userRef.once('value')
    .then((snapshot) => {
      const userData = snapshot.val();

      const name = userData.name;
      const welcomeMessageElement = document.getElementById('welcomeMessage');
      welcomeMessageElement.textContent = `Hi ${name}!`;
    })
    .catch((error) => {
      console.error('Fehler beim Auslesen der Daten:', error.message);
      return null;
    });


  // Einmalige Abfrage (once) der Daten
  userRef.once('value')
    .then((snapshot) => {
      const userData = snapshot.val();

      const profile = userData.profile;
      // Aktualisiere den Text des HTML-Elements mit der ID "profileImage"          
      const profileImageElement = document.getElementById('profileImage');
      profileImageElement.setAttribute('src', profile);
    })
    .catch((error) => {
      console.error('Fehler beim Auslesen der Daten:', error.message);
      return null;
    });

});