import { authAPI, bookingAPI, handleError } from './api.js';
import { checkAuth } from './auth.js';

// DOM Elements
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const userVehicle = document.getElementById('user-vehicle');
const bookingsList = document.getElementById('bookings-list');

// Load user data
async function loadUserData() {
    const token = localStorage.getItem('token');

    try {
        const user = await authAPI.getUser(token);

        userName.textContent = user.name;
        userEmail.textContent = user.email;
        userVehicle.textContent = user.vehicleNumber || 'Not provided';

        return user;
    } catch (error) {
        handleError(error);
        window.location.href = '/login.html';
    }
}

// Load user bookings
async function loadUserBookings() {
    const token = localStorage.getItem('token');

    try {
        const bookings = await bookingAPI.getUserBookings(token);

        if (bookings.length === 0) {
            bookingsList.innerHTML = '<p>You have no bookings yet.</p>';
            return;
        }

        bookingsList.innerHTML = bookings.map(booking => {
            const parking = booking.parking;

            if (!parking) {
                return `<div class="booking-card">
      <h3>Unknown Parking</h3>
      <p>No Parking Booked</p>
    </div>`;
            }

            return `
            <div class="booking-card">
                <h3>${booking.parking.name}</h3>
                <p><strong>Address:</strong> ${booking.parking.address}</p>
                <p><strong>Vehicle:</strong> ${booking.vehicleNumber}</p>
                <p><strong>Date:</strong> ${new Date(booking.startTime).toLocaleString()}</p>
                <p><strong>Duration:</strong> ${Math.ceil((new Date(booking.endTime) - new Date(booking.startTime)) / (1000 * 60 * 60))} hours</p>
                <p><strong>Total:</strong> $${booking.totalPrice}</p>
                <p><strong>Status:</strong> <span class="status ${booking.status}">${booking.status}</span></p>
                <button class="cancel-btn" data-id="${booking._id}" ${booking.status !== 'upcoming' ? 'disabled' : ''}>
                    Cancel Booking
                </button>
            </div>
        `}).join('');

        // Add event listeners to cancel buttons
        document.querySelectorAll('.cancel-btn').forEach(button => {
            button.addEventListener('click', handleCancelBooking);
        });
    } catch (error) {
        handleError(error);
    }
}

// Handle booking cancellation
async function handleCancelBooking(e) {
    const bookingId = e.target.dataset.id;
    const token = localStorage.getItem('token');

    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
        await bookingAPI.cancelBooking(bookingId, token);
        alert('Booking cancelled successfully');
        loadUserBookings();
    } catch (error) {
        handleError(error);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        window.location.href = '/login.html';
        return;
    }

    await loadUserData();
    await loadUserBookings();
});