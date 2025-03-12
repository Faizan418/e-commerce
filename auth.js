// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
// import { firebaseConfig } from "./config.js"; // ✅ Import the config
// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDauai1XnTfuEUvKzcTn1Pe0uN2e0fsJ1I",
    authDomain: "prepration-hackathon.firebaseapp.com",
    projectId: "prepration-hackathon",
    storageBucket: "prepration-hackathon.firebasestorage.app",
    messagingSenderId: "465148634017",
    appId: "1:465148634017:web:8ab0f99183479b948161e0",
    measurementId: "G-M7ZNEPQPZ1"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Sign Up Function (Fixed)
document.addEventListener("DOMContentLoaded", function () {
    const signUpForm = document.querySelector("#signup-form");
    if (signUpForm) {
        signUpForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            if (!email || !password) {
                // alert("⚠️ Please enter a valid email and password.");
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Please enter a valid email and password.",
                  });
                return;
            }

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // alert("✅ Sign up successful! Redirecting to login...");
                    Swal.fire({
                        title: "Sign up successful! Redirecting to login...",
                        icon: "success",
                        draggable: true
                      });
                    window.location.href = "login.html";
                })
                .catch((error) => {
                    if (error.code === "auth/email-already-in-use") {
                        // alert("⚠️ This email is already in use. Try logging in.");
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "This email is already in use. Try logging in.",
                          });
                    } else {
                        // alert(`⚠️ Error: ${error.message}`);
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: `⚠️ Error: ${error.message}`,
                          });
                    }
                });
        });
    }

    // ✅ Login Function (Fixed)
    const loginForm = document.querySelector("#login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value;

            if (!email || !password) {
                // alert("⚠️ Please enter a valid email and password.");
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Please enter a valid email and password.",
                  });
                return;
            }

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // alert("✅ Login successful! Redirecting to home...");
                    Swal.fire({
                        title: "Login successful! Redirecting to home...",
                        icon: "success",
                        draggable: true
                      });
                    window.location.href = "home.html";
                })
                .catch((error) => {
                    if (error.code === "auth/user-not-found") {
                        // alert("⚠️ No account found with this email. Please sign up.");
                        Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "No account found with this email. Please sign up.",
                  });
                    } else if (error.code === "auth/wrong-password") {
                        // alert("⚠️ Incorrect password. Try again.");
                        Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Incorrect password. Try again.",
                  });
                    } else {
                        // alert(`⚠️ Error: ${error.message}`);
                        Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `⚠️ Error: ${error.message}`,
                  });
                    }
                });
        });
    }
});

// ✅ Logout Function
function logout() {
    signOut(auth)
        .then(() => {
            // alert("✅ Logged out successfully!");
            Swal.fire({
                title: "Logged out successfully!",
                icon: "success",
                draggable: true
              });
            window.location.href = "index.html";
        })
        .catch((error) => {
            // alert(`⚠️ Error: ${error.message}`);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `⚠️ Error: ${error.message}`,
              });
        });
}

// Export Logout Function
window.logout = logout;
