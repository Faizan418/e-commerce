// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase Configuration from .env
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sign Up
const signUpForm = document.querySelector("#signup-form");
if (signUpForm) {
    signUpForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        if (!email || !password || password.length < 6) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please enter a valid email and password (min 6 characters).",
            });
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                return updateProfile(user, { displayName: name });
            })
            .then(() => {
                Swal.fire({
                    title: "Sign up successful! Redirecting to login...",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = "login.html";
                });
            })
            .catch((error) => {
                let message = error.message;
                if (error.code === "auth/email-already-in-use") message = "This email is already in use. Try logging in.";
                else if (error.code === "auth/invalid-email") message = "Invalid email format.";
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: message,
                });
            });
    });
}

// Login
const loginForm = document.querySelector("#login-form");
if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;

        if (!email || !password) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please enter a valid email and password.",
            });
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                Swal.fire({
                    title: "Login successful! Redirecting to home...",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = "home.html";
                });
            })
            .catch((error) => {
                let message = error.message;
                if (error.code === "auth/user-not-found") message = "No account found with this email. Please sign up.";
                else if (error.code === "auth/wrong-password") message = "Incorrect password. Try again.";
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: message,
                });
            });
    });
}

// Logout
export function logout() {
    signOut(auth)
        .then(() => {
            Swal.fire({
                title: "Logged out successfully!",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "index.html";
            });
        })
        .catch((error) => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Error: ${error.message}`,
            });
        });
}

window.logout = logout;