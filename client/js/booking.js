import { bookingAPI, parkingAPI, handleError } from './api.js';
import { checkAuth } from './auth.js';

const bookingForm = document.getElementById('bookingForm');
const locationSummary = document.getElementById('locationSummary');
const locationSelection = document.getElementById('locationSelection');
const urlParams = new URLSearchParams(window.location.search);
const locationId = urlParams.get('id');
const token = localStorage.getItem('token');

let selectedLocation = null;

// Load single parking location
async function loadLocationDetails() {
  try {
    selectedLocation = await parkingAPI.getById(locationId);
    console.log("Selected Location:", selectedLocation);
    document.getElementById('locationSection').style.display = 'block';
    locationSummary.innerHTML = `
      <h3>${selectedLocation.name}</h3>
      <p><strong>Address:</strong> ${selectedLocation.address}</p>
      <p><strong>Price:</strong> $${selectedLocation.pricePerHour} / hour</p>
      <img src="${selectedLocation.images[0]}" alt="${selectedLocation.name}" style="width:100%; margin-top: 1rem;" />
      <div id="map" style="height: 250px; margin-top: 1rem; border-radius: 10px;"></div>
    `;

    // Show map
    if (selectedLocation.lat && selectedLocation.lng) {
      const map = L.map('map').setView([selectedLocation.lat, selectedLocation.lng], 16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      L.marker([selectedLocation.lat, selectedLocation.lng])
        .addTo(map)
        .bindPopup(`<b>${selectedLocation.name}</b><br>${selectedLocation.address}`)
        .openPopup();
    }
  } catch (err) {
    handleError(err);
  }
}

// Load all parking locations
async function loadAllLocations() {
  try {
    const locations = await parkingAPI.getAll();

    locationSelection.innerHTML = locations.map(loc => `
      <div class="location-card">
        <img src=" /assets/images/${loc.images[0]}" alt="${loc.name}">
        <div class="info">
          <h3>${loc.name}</h3>
          <p>${loc.address}</p>
          <p><strong>${loc.availableSpots}</strong> / ${loc.totalSpots} available</p>
          <p>$${loc.pricePerHour} / hour</p>
          <button onclick="selectLocation('${loc._id}')">Select</button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    handleError(err);
  }
}

// Set selected location from card click
window.selectLocation = async function (id) {
  window.location.href = `booking.html?id=${id}`;
};

// Handle form submission
bookingForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!selectedLocation) return alert("No location selected");

  const vehicleNumber = document.getElementById('vehicleNumber').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const duration = parseInt(document.getElementById('duration').value);
  if (isNaN(duration)) {
    alert("Please enter a valid duration.");
    return;
  }

  const startTime = new Date(`${date}T${time}`);
  const now = new Date();
  if (startTime < now) {
    alert("Please select a future date and time.");
    return;
  }
  const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

  const bookingData = {
    parkingId: selectedLocation._id,
    vehicleNumber,
    startTime,
    endTime,
    duration,
    totalPrice: selectedLocation.pricePerHour * duration,
  };
  console.log("Booking Data Sent:", bookingData);
  try {
    await bookingAPI.createBooking(bookingData, token);
    alert('Booking successful!');
    window.location.href = '/dashboard.html';
  } catch (err) {
    handleError(err);
  }
});

// On page load
document.addEventListener('DOMContentLoaded', async () => {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    window.location.href = '/login.html';
    return;
  }
  const now = new Date();

  // Set today's date in YYYY-MM-DD
  const today = now.toISOString().split('T')[0];
  document.getElementById('date').setAttribute('min', today);

  // Set current time in HH:MM (only used for today)
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;
  document.getElementById('time').setAttribute('min', currentTime);

  // Continue with your existing code
  if (locationId) {
    await loadLocationDetails();
  } else {
    await loadAllLocations();
  }

  // Pre-fill date/time if passed via URL
  const urldate = urlParams.get('date');
  const urltime = urlParams.get('time');
  if (urldate) document.getElementById('date').value = date;
  if (urltime) document.getElementById('time').value = time;
  if (locationId) {
    await loadLocationDetails();
  } else {
    await loadAllLocations();
  }

  // Pre-fill date/time if passed via URL
  const date = urlParams.get('date');
  const time = urlParams.get('time');
  if (date) document.getElementById('date').value = date;
  if (time) document.getElementById('time').value = time;
});

