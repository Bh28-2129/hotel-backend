// API Configuration
// For local development, use: http://localhost:5000/api
// For production, replace with your deployed backend URL
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://hotel-backend-xhmj.onrender.com'; // Replace with your actual backend URL

// Get token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Get user from localStorage
function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Check if user is logged in
function isLoggedIn() {
  return !!getToken();
}

// Require authentication - redirect to login if not logged in
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Save user and token to localStorage
function saveUserData(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

// Clear user data from localStorage
function clearUserData() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Update UI based on login state
function updateUIBasedOnLoginState() {
  const loginNavItem = document.getElementById('loginNavItem');
  const userNavItem = document.getElementById('userNavItem');
  const userName = document.getElementById('userName');
  const logoutLink = document.getElementById('logoutLink');
  
  if (isLoggedIn()) {
    const user = getUser();
    
    // Hide login, show user dropdown
    if (loginNavItem) loginNavItem.style.display = 'none';
    if (userNavItem) userNavItem.style.display = 'block';
    
    // Update user name
    if (userName && user) {
      userName.textContent = user.name || 'User';
    }
    
    // Add logout event listener
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    }
  } else {
    // Show login, hide user dropdown
    if (loginNavItem) loginNavItem.style.display = 'block';
    if (userNavItem) userNavItem.style.display = 'none';
  }
}

// Logout function
function logout() {
  clearUserData();
  // Reload the current page so UI updates to show Sign In button
  window.location.reload();
}

// API request function
async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  // Add token to headers if available
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }

  return data;
}

// Show alert message
function showAlert(elementId, message, type = 'danger') {
  const alertElement = document.getElementById(elementId);
  if (alertElement) {
    alertElement.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
  }
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Calculate nights between dates
function calculateNights(checkIn, checkOut) {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  updateUIBasedOnLoginState();
});
