// Register Form Handler
document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');
  const submitBtn = registerForm?.querySelector('button[type="button"]');
  
  if (!registerForm || !submitBtn) return;

  // Flag to prevent multiple submissions
  let isSubmitting = false;

  // Function to handle registration
  async function handleRegistration() {
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log('Already submitting, ignoring...');
      return;
    }
    isSubmitting = true;

    console.log('Starting registration...');

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      showNotification('Please fill in all fields', 'error', 3000);
      isSubmitting = false;
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('Please enter a valid email address', 'error', 3000);
      isSubmitting = false;
      return;
    }

    if (password.length < 6) {
      showNotification('Password must be at least 6 characters long', 'error', 3000);
      isSubmitting = false;
      return;
    }

    if (password !== confirmPassword) {
      showNotification('Passwords do not match', 'error', 3000);
      isSubmitting = false;
      return;
    }

    // Disable button during request
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';

    try {
      console.log('Sending request to backend...');
      // Send registration request to backend
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          pass: password
        })
      });

      console.log('Response received:', response.status, response.ok);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        // Registration successful
        const message = data || 'Account created successfully! ✅';
        
        console.log('Registration successful! Message:', message);
        
        // Store user email in localStorage
        localStorage.setItem('userEmail', email);
        console.log('Email stored in localStorage');
        
        // Update navbar
        if (typeof updateNavbar === 'function') {
          updateNavbar();
          console.log('Navbar updated');
        }

        // Show success message for 5 seconds (longer to ensure visibility)
        console.log('Showing notification...');
        showNotification(message, 'success', 5000);
        
        // Verify notification is shown
        setTimeout(() => {
          const notif = document.querySelector('.app-notification');
          console.log('Notification element exists:', !!notif);
          if (notif) {
            console.log('Notification text:', notif.textContent);
          }
        }, 100);

        // Redirect to login page after 5.5 seconds (5s message + 0.5s buffer)
        console.log('Setting redirect timeout for 5.5 seconds...');
        setTimeout(() => {
          console.log('Redirecting to login page NOW...');
          window.location.href = 'login.html';
        }, 5500);
      } else {
        // Registration failed
        console.log('Registration failed:', data);
        showNotification(data || 'Registration failed. Please try again.', 'error', 3000);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        isSubmitting = false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      showNotification('Network error. Please try again later.', 'error', 3000);
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      isSubmitting = false;
    }
  }

  // Handle form submission (if form is submitted)
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    console.log('Form submit event triggered');
    handleRegistration();
    return false;
  });

  // Handle button click (since button type is "button", not "submit")
  submitBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    console.log('Button click event triggered');
    handleRegistration();
    return false;
  });
});
