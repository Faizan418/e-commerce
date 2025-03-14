// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

console.log("auth.js loaded");

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB69jrV4pBX08uTaikTpieEg6m6NJd-M6c",
    authDomain: "smit-d73b2.firebaseapp.com",
    projectId: "smit-d73b2",
    storageBucket: "smit-d73b2.firebasestorage.app",
    messagingSenderId: "869237865578",
    appId: "1:869237865578:web:b05fd98167acafad39de13",
    measurementId: "G-QLTH7QC727"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sign Up
const signUpForm = document.querySelector("#signup-form");
if (signUpForm) {
    console.log("Signup form found");
    signUpForm.addEventListener("submit", (event) => {
        event.preventDefault();
        console.log("Signup form submitted");

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        console.log("Name:", name, "Email:", email, "Password:", password);

        if (!email || !password || password.length < 6) {
            console.log("Validation failed");
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please enter a valid email and password (min 6 characters).",
            });
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("User created:", userCredential.user.uid);
                const user = userCredential.user;
                return Promise.all([
                    updateProfile(user, { displayName: name }),
                    setDoc(doc(db, "users", user.uid), {
                        email: email,
                        role: "user"
                    })
                ]);
            })
            .then(() => {
                console.log("Profile and role set");
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
                console.log("Signup error:", error.code, error.message);
                let message = error.message;
                if (error.code === "auth/email-already-in-use") message = "This email is already in use.";
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: message,
                });
            });
    });
} else {
    console.log("Signup form not found");
}

// Login
const loginForm = document.querySelector("#login-form");
if (loginForm) {
    console.log("Login form found");
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        console.log("Login form submitted");

        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;

        if (!email || !password) {
            console.log("Validation failed");
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please enter a valid email and password.",
            });
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("User logged in:", userCredential.user.uid);
                const user = userCredential.user;
                const userDocRef = doc(db, "users", user.uid);
                getDoc(userDocRef).then((docSnap) => {
                    if (docSnap.exists() && docSnap.data().role === "admin") {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Admins should use the Admin Login page.",
                        });
                    } else {
                        Swal.fire({
                            title: "Login successful! Redirecting to home...",
                            icon: "success",
                            timer: 2000,
                            showConfirmButton: false
                        }).then(() => {
                            window.location.href = "home.html";
                        });
                    }
                });
            })
            .catch((error) => {
                console.log("Login error:", error.code, error.message);
                let message = error.message;
                if (error.code === "auth/user-not-found") message = "No account found with this email.";
                else if (error.code === "auth/wrong-password") message = "Incorrect password.";
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: message,
                });
            });
    });
}

// Admin Login
const adminLoginForm = document.querySelector("#admin-login-form");
if (adminLoginForm) {
    console.log("Admin login form found");
    adminLoginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        console.log("Admin login form submitted");

        const email = document.getElementById("admin-email").value.trim();
        const password = document.getElementById("admin-password").value;

        if (!email || !password) {
            console.log("Validation failed");
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please enter a valid email and password.",
            });
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("Admin logged in:", userCredential.user.uid);
                const user = userCredential.user;
                const userDocRef = doc(db, "users", user.uid);
                getDoc(userDocRef).then((docSnap) => {
                    if (docSnap.exists() && docSnap.data().role === "admin") {
                        Swal.fire({
                            title: "Admin login successful!",
                            icon: "success",
                            timer: 2000,
                            showConfirmButton: false
                        }).then(() => {
                            window.location.href = "admin.html";
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Access Denied",
                            text: "You are not an admin.",
                        });
                        signOut(auth);
                    }
                }).catch(() => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "User role not found.",
                    });
                });
            })
            .catch((error) => {
                console.log("Admin login error:", error.code, error.message);
                let message = error.message;
                if (error.code === "auth/user-not-found") message = "No admin account found.";
                else if (error.code === "auth/wrong-password") message = "Incorrect password.";
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
            console.log("User logged out");
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
            console.log("Logout error:", error.code, error.message);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Error: ${error.message}`,
            });
        });
}

window.logout = logout;