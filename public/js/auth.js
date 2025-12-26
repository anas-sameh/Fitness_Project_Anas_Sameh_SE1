// Authentication and Navbar Management
document.addEventListener('DOMContentLoaded', function() {
  updateNavbar();
});

// Function to check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('userEmail') !== null;
}

// Function to update navbar based on login status
function updateNavbar() {
  const navBtn = document.querySelector('.nav-btn a');
  
  if (navBtn) {
    if (isLoggedIn()) {
      // User is logged in - show Logout button
      navBtn.textContent = 'Logout';
      navBtn.href = '#';
      navBtn.onclick = function(e) {
        e.preventDefault();
        logout();

      };
    } else {
      // User is not logged in - show Login button
      navBtn.textContent = 'Login';
      navBtn.href = 'login.html';
      navBtn.onclick = null;

    }
  }
}

// Function to logout
function logout() {
  console.log('logout clicked');

  localStorage.removeItem('userEmail');

  showLogoutNotification('Logged out successfully');

  setTimeout(() => {
    console.log('redirecting...');
    window.location.href = 'login.html';
  }, 1000);
}
  



// showLogoutNotification uses showNotification from utils.js
function showLogoutNotification(message) {
  showNotification(message, 'success', 2000);
}

