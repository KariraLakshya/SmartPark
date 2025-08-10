const API_BASE_URL = 'http://localhost:5000/api';

async function fetchAPI(endpoint, method = 'GET', body = null, token = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    if (token) {
        options.headers['x-auth-token'] = token;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
       let errorMsg = 'Something went wrong';

  try {
    const errorData = await response.json();
     console.warn(" Backend returned error object:", errorData);
    if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
      errorMsg = errorData.errors[0].msg;
    } else if (typeof errorData.message === 'string') {
      errorMsg = errorData.message;
    } else if (typeof errorData.msg === 'string') {
      errorMsg = errorData.msg;
    } else {
        errorMsg = JSON.stringify(errorData);
    }
  } catch (e) {
    const fallback = await response.text();
    errorMsg = fallback  || errorMsg;
  }

  throw new Error(errorMsg); 
    }

    return response.json();
}

// Auth API
export const authAPI = {
    register: (userData) => fetchAPI('/auth/register', 'POST', userData),
    login: (credentials) => fetchAPI('/auth/login', 'POST', credentials),
    getUser: (token) => fetchAPI('/auth/user', 'GET', null, token)
};

// Parking API
export const parkingAPI = {
    getAll: (location = null) => {
        const query = location ? `?location=${location.lng},${location.lat}` : '';
        return fetchAPI(`/parking${query}`);
    },
    getById: (id) => fetchAPI(`/parking/${id}`)
};

// Booking API
export const bookingAPI = {
    getUserBookings: (token) => fetchAPI('/bookings', 'GET', null, token),
    createBooking: (bookingData, token) => fetchAPI('/bookings', 'POST', bookingData, token),
    cancelBooking: (id, token) => fetchAPI(`/bookings/${id}/cancel`, 'PUT', null, token)
};

// Utility function to handle errors
export function handleError(error) {
    console.error('API Error:', error);
    alert(error.message || 'An error occurred');
}