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
  const auth = firebase.auth();
  
  document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validate passwords
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const passwordError = document.getElementById("passwordError");
      const termsCheckbox = document.getElementById("terms");

      const name = document.getElementById("name").value;
      const surname = document.getElementById("surname").value;
      

      if (!termsCheckbox.checked) {
        passwordError.textContent = 'You must accept the Terms of Service and Privacy Policy.';
        passwordError.style.display = 'block';
        return;
      }
      
      if (!validatePassword(password)) {
        passwordError.textContent = 'Password to weak (min 8 character, min 1 number, min 1 special character)';
        passwordError.style.display = 'block';
        // Additional logic to shake and highlight fields
        return;
      }
      
      if (password !== confirmPassword) {
        passwordError.textContent = 'Passwords do not match';
        passwordError.style.display = 'block';
        // Additional logic to shake and highlight fields
        return;
      }
      
      // Clear any error messages
      passwordError.style.display = 'none';
      
      // Proceed with Firebase authentication
      const email = document.getElementById("email").value;
      
      checkIfEmailExists(email).then((emailExists) => {
        if (emailExists) {
          passwordError.textContent = 'An account with this email already exists';
          passwordError.style.display = 'block';
        } else {
          createUser(email, password, name, surname);
        }
      }).catch((error) => {
        // Fehler von checkIfEmailExists
        passwordError.textContent = error.message;
        passwordError.style.display = 'block';
      });
    });
  });
  
  function createUser(email, password, name, surname) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        saveUserData(userCredential.user.uid, name, surname, email).then(() => {
          
          sendVerificationEmail();
          
        }).catch((error) => {
          // Fehler beim Speichern der Nutzerdaten
          passwordError.textContent = error.message;
          passwordError.style.display = 'block';
        });
      })
      .catch((error) => {
        // Fehler von createUserWithEmailAndPassword
        passwordError.textContent = error.message;
        passwordError.style.display = 'block';
      });
  }


  function sendVerificationEmail() {
    const user = firebase.auth().currentUser;
  
    user.sendEmailVerification().then(() => {
      
      window.location.href = "../emailVerification/approveemail.html";
    }).catch((error) => {
      // Fehler beim Senden der Bestätigungs-E-Mail
      console.error('Error sending email verification: ', error);
    });
  } 

  function validatePassword(password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  }

  function checkIfEmailExists(email) {
    return firebase.auth().fetchSignInMethodsForEmail(email)
      .then((signInMethods) => {
        // Wenn das Array signInMethods leer ist, existiert kein Konto mit dieser E-Mail
        return signInMethods.length > 0;
      })
      .catch((error) => {
             // Handle errors here
            const errorCode = error.code;
            const errorMessage = error.message;
            // Show the error to the user
            passwordError.textContent = errorMessage;
      });
  }


  // Function to toggle Password visibility
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


// Funktion, um Nutzerdaten in Firebase zu speichern
function saveUserData(userId, name, surname, email) {
  return firebase.database().ref('users/' + userId).set({
    name: name,
    surname: surname,
    email: email,
    profile: 'https://firebasestorage.googleapis.com/v0/b/fittastic-f8679.appspot.com/o/profile_images%2Fistockphoto-1500847894-1024x1024.jpg?alt=media&token=0eeb42a7-4182-4309-9a79-3101e50669a7'
  });
}