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

function showOverlay(message) {
    const overlay = document.getElementById('overlay');
    const confirmationMessage = document.getElementById('confirmationMessage');

    confirmationMessage.textContent = message;
    overlay.style.display = 'block';
}


function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(today.getDate()).padStart(2, '0');

    const currentDate = `${year}-${month}-${day}`;
    return currentDate;
}

// Get uid from session storage
const uid = sessionStorage.getItem('userID');
// Reference to user path
const userRef = firebase.database().ref('users/' + uid);

const currentDate = getCurrentDate();

let mealId = 0;
let mealsPath = `users/${uid}/kalorientracker/dailyCalories/${currentDate}/meals`;
const refMeals = firebase.database().ref(mealsPath);

function addMeal(mealId) {
    const mealType = document.getElementById('MealType').value;
    const calories = document.getElementById('calories').value;
    const fat = document.getElementById('fat').value;
    const carbs = document.getElementById('carbs').value;
    const protein = document.getElementById('protein').value;

    const pathToUpdate = `users/${uid}/kalorientracker/dailyCalories/${currentDate}/meals/${mealId}`;

    const newMealData = {
        mealType: mealType,
        calories: calories,
        carbs: carbs,
        protein: protein,
        fat: fat
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

}

document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('calculaterForm').addEventListener('submit', function (event) {
        event.preventDefault();
        // Einmalige Abfrage (once) der Daten
        refMeals.once('value')
            .then((snapshot) => {
                const meals = snapshot.val();

                // Überprüfen, ob Schlüssel vorhanden sind
                if (Object.keys(meals).length > 0) {
                    // Schlüssel in ein Array umwandeln
                    let keysArray = Object.keys(meals);

                    // Den letzten Schlüssel auslesen
                    mealId = keysArray[keysArray.length - 1];

                } else {
                    mealId = 0;
                    console.log("Das JSON-Objekt enthält keine Schlüssel.", mealId);
                }
                mealId = Number(mealId) + 1;

                console.log('MealID: ', mealId);
                addMeal(mealId);

                // Overlay mit Bestätigung anzeigen
                showOverlay("Neues Meal erfolgreich hinzugefügt!");

                // Timeout für das Overlay, z.B. 2 Sekunden (2000 Millisekunden)
                setTimeout(function () {
                    window.location.href = '../Home/homescreen.html';
                }, 2000);

            })
            .catch((error) => {
                console.error('Fehler beim Auslesen der Daten:', error.message);
                return null;
            });
        });
});