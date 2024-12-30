import { firebaseConfig } from './config.js';

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();

// Form and Button References
const signupForm = document.querySelector('.registration.form');
const loginForm = document.querySelector('.login.form');
const forgotForm = document.querySelector('.forgot.form');
const signupBtn = document.querySelector('.signupbtn');
const loginBtn = document.querySelector('.loginbtn');
const forgotBtn = document.querySelector('.forgotbtn');
const anchors = document.querySelectorAll('a');

// Navigation between forms
anchors.forEach(anchor => {
  anchor.addEventListener('click', () => {
    const id = anchor.id;
    switch (id) {
      case 'loginLabel':
        toggleForms(loginForm);
        break;
      case 'signupLabel':
        toggleForms(signupForm);
        break;
      case 'forgotLabel':
        toggleForms(forgotForm);
        break;
    }
  });
});

// Toggle between forms
function toggleForms(formToShow) {
  signupForm.style.display = 'none';
  loginForm.style.display = 'none';
  forgotForm.style.display = 'none';
  formToShow.style.display = 'block';
}

// Signup
signupBtn.addEventListener('click', () => {
  const name = document.querySelector('#name').value.trim();
  const username = document.querySelector('#username').value.trim();
  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value.trim();

  if (!name || !username || !email || !password) {
    alert('All fields are required!');
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      user.sendEmailVerification()
        .then(() => {
          alert('Verification email sent. Please verify your email before signing in.');
        })
        .catch(error => alert('Error sending verification email: ' + error.message));

      firestore.collection('users').doc(user.uid).set({
        name,
        username,
        email,
      }).then(() => console.log('User data saved to Firestore'));

      toggleForms(loginForm);
    })
    .catch(error => alert('Error signing up: ' + error.message));
});

// Login
loginBtn.addEventListener('click', () => {
  const email = document.querySelector('#inUsr').value.trim();
  const password = document.querySelector('#inPass').value.trim();

  if (!email || !password) {
    alert('Both email and password are required!');
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      if (user.emailVerified) {
        console.log('User is signed in with a verified email.');
        window.location.href = "https://skytmovies.vercel.app/";
      } else {
        alert('Please verify your email before signing in.');
      }
    })
    .catch(error => alert('Error signing in: ' + error.message));
});

// Forgot Password
forgotBtn.addEventListener('click', () => {
  const emailForReset = document.querySelector('#forgotinp').value.trim();

  if (!emailForReset) {
    alert('Please enter your email!');
    return;
  }

  auth.sendPasswordResetEmail(emailForReset)
    .then(() => {
      alert('Password reset email sent. Please check your inbox to reset your password.');
      toggleForms(loginForm);
    })
    .catch(error => alert('Error sending password reset email: ' + error.message));
});
