import { authAPI, handleError } from './api.js';

// DOM Elements
const authLink = document.getElementById('auth-link');
const logoutLink = document.getElementById('logout-link');

// Check authentication status
export async function checkAuth() {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const user = await authAPI.getUser(token);
            updateUIForLoggedInUser(user);
            return true;
        } catch (error) {
            localStorage.removeItem('token');
            updateUIForLoggedOutUser();
            return false;
        }
    }
    return false;
}

// Update UI based on auth status
function updateUIForLoggedInUser(user) {
    if (authLink) authLink.textContent = user.name;
    if (logoutLink) logoutLink.style.display = 'block';
}

function updateUIForLoggedOutUser() {
    if (authLink) {
        authLink.textContent = 'Login';
        authLink.href = '/login.html';
    }
    if (logoutLink) logoutLink.style.display = 'none';
}

// Handle logout
if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.href = '/';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth(); // this is the existing logic

    // Tab switching
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginTab && registerTab) {
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        });

        registerTab.addEventListener('click', () => {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        });
    }

    // Handle login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const res = await authAPI.login({ email, password });
                localStorage.setItem('token', res.token);
                alert('Login successful!');
                window.location.href = '/dashboard.html';
            } catch (err) {
                handleError(err);
            }
        });
    }

    // Handle register
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const vehicleNumber = document.getElementById('register-vehicle').value;
console.log(" Registering with:", { name, email, password, vehicleNumber });

            try {
                const res = await authAPI.register({ name, email, password, vehicleNumber });
                localStorage.setItem('token', res.token);
                alert('Registration successful!');
                window.location.href = '/dashboard.html';
            } catch (err) {
                handleError(err);
            }
        });
    }
});
