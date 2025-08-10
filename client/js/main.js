import { parkingAPI, handleError } from './api.js';
import { checkAuth } from './auth.js';

// DOM Elements
const popularLocationsContainer = document.getElementById('popularLocations');
const searchBtn = document.getElementById('search-btn');
const locationInput = document.getElementById('location-search');
const dateInput = document.getElementById('booking-date');
const timeInput = document.getElementById('booking-time');
searchBtn?.addEventListener('click', async () => {
  console.log("Search button clicked");
  const query = locationInput.value.trim().toLowerCase();

  if (!query) {
    alert('Please enter a location.');
    return;
  }

  try {
    const locations = await parkingAPI.getAll();
    const match = locations.find(loc =>
      loc.name.toLowerCase().includes(query) ||
      loc.address.toLowerCase().includes(query)
    );

    if (match) {
      const date = dateInput.value;
      const time = timeInput.value;
      const dateTimeParams = new URLSearchParams();

      if (date) dateTimeParams.append('date', date);
      if (time) dateTimeParams.append('time', time);

      const queryString = dateTimeParams.toString();
      const url = `/booking.html?id=${match._id}${queryString ? '&' + queryString : ''}`;
      window.location.href = url;
    } else {
      alert('No matching parking location found.');
    }
  } catch (err) {
    console.error('Error fetching parking locations:', err);
    alert('Something went wrong while searching.');
  }
});
// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
});