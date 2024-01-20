
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


document.addEventListener('DOMContentLoaded', function () {
  // Diese Variablen sind jetzt global verfügbar
  const calculateButton = document.querySelector('.calculate-button');
  const applyChangesButton = document.querySelector('.applychanges-button');

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      const userId = user.uid;
      loadUserData(userId);

      document.getElementById('calculaterForm').addEventListener('submit', function (event) {
        event.preventDefault();
        performCalculation(userId);
      });

      applyChangesButton.addEventListener('click', function (event) {
        event.preventDefault();
        updateUserAccount(userId);
      });

    } else {
      window.location.href = '../LogIn/loginscreen.html';
    }
  });

  // Event-Listener für das Öffnen der Edit-Pop-ups
  document.querySelectorAll('.edit-icon').forEach(icon => {
    icon.addEventListener('click', function () {
      const field = this.getAttribute('data-field');
      openEditPopup('edit' + field.charAt(0).toUpperCase() + field.slice(1) + 'Popup');
    });
  });

  // Event-Listener für das Öffnen des Delete-Account-Pop-ups
  document.querySelector('.delete-button').addEventListener('click', function () {
    openEditPopup('DeleteAccountPopup');
  });
});

document.addEventListener('DOMContentLoaded', function () {

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


function loadUserData(userId) {
  firebase.database().ref('users/' + userId).once('value').then(function (snapshot) {
    const userData = snapshot.val();
    if (userData) {
      document.getElementById('weight').value = userData.weight;
      document.getElementById('height').value = userData.height;
      document.getElementById('age').value = userData.age;
      document.getElementById('sex').value = userData.sex;
      document.getElementById('activitylevel').value = userData.activityLevel;
      document.getElementById('name').value = userData.name || '';
      document.getElementById('surname').value = userData.surname || '';
      document.getElementById('email').value = userData.email || '';
    }
  });
}


function performCalculation(userId) {
  // Holen Sie sich die Werte aus dem Formular
  const weight = document.getElementById('weight').value;
  const height = document.getElementById('height').value;
  const age = document.getElementById('age').value;
  const sex = document.getElementById('sex').value;
  const activityLevel = document.getElementById('activitylevel').value;

  let bmrresult;
  if (sex === "female") {
    bmrresult = 655.1 + (9.563 * parseFloat(weight)) + (1.850 * parseFloat(height)) - (4.676 * parseFloat(age));
  } else {
    bmrresult = 66.5 + (13.75 * parseFloat(weight)) + (5.003 * parseFloat(height)) - (6.75 * parseFloat(age));
  }

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

};


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
  }).then(() => {
    alert("Aktualisierung erfolgreich");
  }).catch((error) => {
    console.error("Fehler bei der Aktualisierung der Daten: ", error);
  });
}

// Funktion zum Öffnen der Edit-Pop-ups
function openEditPopup(popupId) {
  document.getElementById(popupId).style.display = 'block';
}

// Funktion zum Schließen der Edit-Pop-ups
function closePopup(popupId) {
  document.getElementById(popupId).style.display = 'none';
}

function applyChanges(field) {
  const userId = firebase.auth().currentUser.uid;
  let newValue;

  if (field === 'name' || field === 'surname') {
    newValue = document.getElementById('new' + field.charAt(0).toUpperCase() + field.slice(1)).value;
    firebase.database().ref('users/' + userId).update({ [field]: newValue }).then(() => {
      alert(field.charAt(0).toUpperCase() + field.slice(1) + ' successfully updated');
      document.getElementById(field).value = newValue; // Aktualisieren des Feldes in der Benutzeroberfläche
      closePopup('edit' + field.charAt(0).toUpperCase() + field.slice(1) + 'Popup');
    });
  } else if (field === 'email') {
    newValue = document.getElementById('newEmail').value;
    // Logik für E-Mail-Änderung
    updateUserEmail(userId, newValue);
  } else if (field === 'password') {
    // Logik für Passwortänderung
    updatePassword(userId);
  } else if (field === 'deleteaccount') {
    deleteAccount();
  } else if (field === 'dontdeleteaccount') {
    closePopup('DeleteAccountPopup');
  }
}

function updateUserEmail(userId, newEmail) {
  const user = firebase.auth().currentUser;

  if (user) {
    // Ändern der E-Mail-Adresse
    user.updateEmail(newEmail).then(() => {
      // E-Mail-Adresse erfolgreich aktualisiert
      // Senden einer Bestätigungs-E-Mail
      user.sendEmailVerification().then(() => {
        // Bestätigungs-E-Mail erfolgreich gesendet
        alert("Eine Bestätigungs-E-Mail wurde an " + newEmail + " gesendet. Bitte überprüfen Sie Ihren Posteingang.");
        firebase.database().ref('users/' + userId).update({ email: newEmail }); // Aktualisieren der E-Mail in der Realtime Database
        document.getElementById('email').value = newEmail; // Aktualisieren des E-Mail-Feldes in der Benutzeroberfläche
        closePopup('editEmailPopup');
      }).catch((error) => {
        // Fehler beim Senden der Bestätigungs-E-Mail
        console.error("Fehler beim Senden der Bestätigungs-E-Mail: ", error);
        alert("Fehler beim Senden der Bestätigungs-E-Mail: " + error.message);
        closePopup('editPasswordPopup');
      });
    }).catch((error) => {
      // Fehler beim Aktualisieren der E-Mail-Adresse
      console.error("Fehler beim Aktualisieren der E-Mail-Adresse: ", error);
      if (error.code === 'auth/requires-recent-login') {
        // Spezifischer Fehler für eine erforderliche erneute Anmeldung
        alert("Diese Operation ist sensibel und erfordert eine kürzlich erfolgte Authentifizierung. Bitte melden Sie sich erneut an, bevor Sie diese Anfrage erneut versuchen.");
      } else {
        // Allgemeiner Fehler
        alert("Fehler beim Aktualisieren der E-Mail-Adresse: " + error.message);
      }
      closePopup('editEmailPopup');
    });
  } else {
    // Kein Nutzer angemeldet
    alert("Kein Nutzer angemeldet. Bitte melden Sie sich an und versuchen Sie es erneut.");
  }
}


function updatePassword() {
  const user = firebase.auth().currentUser;
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmNewPassword').value;

  if (!validatePassword(newPassword)) {
    alert('Das neue Passwort erfüllt nicht die Mindestanforderungen.');
    return;
  }

  if (newPassword !== confirmPassword) {
    alert('Das neue Passwort stimmt nicht mit der Passwortbestätigung überein.');
    return;
  }

  const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
  user.reauthenticateWithCredential(credential).then(() => {
    user.updatePassword(newPassword).then(() => {
      alert('Passwort erfolgreich geändert!');
    }).catch((error) => {
      console.error('Fehler beim Ändern des Passworts:', error);
      alert('Fehler beim Ändern des Passworts: ' + error.message);
    });
  }).catch((error) => {
    console.error('Fehler bei der Reauthentifizierung:', error);
    alert('Falsches aktuelles Passwort: ' + error.message);
  })
  closePopup('editPasswordPopup');
}

function validatePassword(password) {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
}

// Funktion zur Reauthentifizierung des Benutzers
function reauthenticateUser(currentPassword) {
  const user = firebase.auth().currentUser;
  const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
  return user.reauthenticateWithCredential(credential);
}

function deleteAccount() {
  const user = firebase.auth().currentUser;

  if (!user) {
    alert("Kein Nutzer angemeldet. Bitte melden Sie sich an und versuchen Sie es erneut.");
    return;
  }

  const userId = user.uid;

  // Löschen aller Nutzerdaten aus der Realtime Database
  firebase.database().ref('users/' + userId).remove()
    .then(() => {
      console.log("Nutzerdaten erfolgreich aus der Datenbank entfernt.");

      // Löschen des Nutzerkontos
      user.delete().then(() => {
        alert("Account erfolgreich gelöscht.");
        // Hier könnten Sie den Nutzer ausloggen oder zur Anmeldeseite weiterleiten
      }).catch((error) => {
        console.error("Fehler beim Löschen des Accounts: ", error);
        alert("Fehler beim Löschen des Accounts: " + error.message);
      });

    }).catch((error) => {
      console.error("Fehler beim Entfernen der Nutzerdaten aus der Datenbank: ", error);
      alert("Fehler beim Entfernen der Nutzerdaten aus der Datenbank: " + error.message);
    });
}

