// ========== FAVOURITES PAGE HANDLER ==========

document.addEventListener('DOMContentLoaded', function() {
  const userEmail = localStorage.getItem('userEmail');
  
  if (!userEmail) {
    showLoginMessage();
    return;
  }

  showFavouritesContent();
  loadFavourites(userEmail);
});

function showLoginMessage() {
  // Hide only the courses section
  const profileCourses = document.querySelector('.profile-courses');
  if (profileCourses) profileCourses.style.display = 'none';
  
  // Make sure hero section is visible
  const heroSection = document.querySelector('.hero');
  if (heroSection) heroSection.style.display = 'block';
  
  let loginMessage = document.querySelector('.login-message-container');
  
  if (!loginMessage) {
    loginMessage = document.createElement('div');
    loginMessage.className = 'login-message-container';
    loginMessage.style.cssText = `
      min-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    `;
    loginMessage.innerHTML = `
      <div style="max-width: 500px;">
        <h2 style="color: #333; margin-bottom: 20px; font-size: 28px; font-weight: 600;">Please Login First</h2>
        <p style="color: #666; margin-bottom: 30px; font-size: 16px; line-height: 1.6;">You need to login to view your favourites</p>
        <a href="login.html" style="display: inline-block; padding: 12px 30px; background: #f5a623; color: white; text-decoration: none; border-radius: 5px; font-weight: 500;">Go to Login</a>
      </div>
    `;
    
    const profileSection = document.querySelector('.profile');
    if (profileSection) {
      // Insert after hero section
      const heroSection = document.querySelector('.hero');
      if (heroSection) {
        // Insert after hero
        if (heroSection.nextSibling) {
          profileSection.insertBefore(loginMessage, heroSection.nextSibling);
        } else {
          profileSection.appendChild(loginMessage);
        }
      } else {
        // If no hero, insert at beginning
        profileSection.insertBefore(loginMessage, profileSection.firstChild);
      }
    }
  }
}

function showFavouritesContent() {
  const loginMessage = document.querySelector('.login-message-container');
  if (loginMessage) loginMessage.remove();
  
  // Show hero section
  const heroSection = document.querySelector('.hero');
  if (heroSection) heroSection.style.display = 'block';
  
  const profileCourses = document.querySelector('.profile-courses');
  if (profileCourses) profileCourses.style.display = 'block';
}

window.addEventListener('storage', function(e) {
  if (e.key === 'userEmail') {
    checkLoginStatus();
  }
});

function checkLoginStatus() {
  const userEmail = localStorage.getItem('userEmail');
  
  if (userEmail) {
    showFavouritesContent();
    loadFavourites(userEmail);
  } else {
    showLoginMessage();
  }
}

setInterval(checkLoginStatus, 1000);

// Function to load user favourites from backend
async function loadFavourites(email) {
  try {
    const response = await fetch(`http://localhost:3000/user/favourites?email=${encodeURIComponent(email)}`);
    
    if (!response.ok) {
      throw new Error('Failed to load favourites');
    }
    
    const favourites = await response.json();
    
    if (favourites.length === 0) {
      showEmptyMessage();
    } else {
      displayFavourites(favourites);
    }
    
  } catch (error) {
    console.error('Error loading favourites:', error);
    alert('Failed to load favourites. Please try again.');
  }
}

// Function to display favourites
function displayFavourites(favourites) {
  const coursesGrid = document.querySelector('.courses-grid');
  
  if (!coursesGrid) return;
  
  // Clear existing content
  coursesGrid.innerHTML = '';
  
  // Create course cards for each favourite
  favourites.forEach(course => {
    const courseCard = document.createElement('div');
    courseCard.className = 'course-card';
    courseCard.innerHTML = `
      <a href="coursedetails.html" class="course-link" onclick="saveCourseData(event, this)">
        <div class="course-img">
          <img src="${course.image}" alt="${course.title}">
          <span class="price">$${course.price}</span>
          <button class="favourite-btn active" onclick="removeFromFavourites(event, this, '${course.title}')" title="Remove from favourites">
            <span class="heart-icon">♥</span>
          </button>
        </div>
      </a>
      <div class="course-info">
        <span class="author">By ${course.author}</span>
        <h4>${course.title}</h4>
        <div class="meta">
          <span>${course.duration}h</span>
          <span>${course.lessons} Lessons</span>
        </div>
      </div>
    `;
    
    // Add data attributes for course details
    courseCard.setAttribute('data-title', course.title);
    courseCard.setAttribute('data-author', course.author);
    courseCard.setAttribute('data-price', course.price);
    courseCard.setAttribute('data-duration', course.duration);
    courseCard.setAttribute('data-lessons', course.lessons);
    courseCard.setAttribute('data-category', course.category);
    courseCard.setAttribute('data-image', course.image);
    
    coursesGrid.appendChild(courseCard);
  });
}

// Function to show empty message
function showEmptyMessage() {
  const coursesGrid = document.querySelector('.courses-grid');
  if (coursesGrid) {
    coursesGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <h3 style="font-size: 24px; margin-bottom: 10px; color: #333;">No favourites yet</h3>
        <p style="color: #666; margin-bottom: 20px;">Start adding courses to your favourites!</p>
        <a href="courses.html" style="display: inline-block; padding: 12px 30px; background: #f5a623; color: white; text-decoration: none; border-radius: 5px;">Browse Courses</a>
      </div>
    `;
  }
}

// Function to remove course from favourites
async function removeFromFavourites(event, btn, courseTitle) {
  event.preventDefault();
  event.stopPropagation();
  
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) return;
  
  // Find course data from displayed courses
  const courseCard = btn.closest('.course-card');
  const courseData = {
    title: courseCard.getAttribute('data-title'),
    author: courseCard.getAttribute('data-author'),
    price: courseCard.getAttribute('data-price'),
    duration: courseCard.getAttribute('data-duration'),
    lessons: courseCard.getAttribute('data-lessons'),
    category: courseCard.getAttribute('data-category'),
    image: courseCard.getAttribute('data-image')
  };
  
  try {
    const response = await fetch('http://localhost:3000/user/favourites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userEmail,
        course: courseData
      })
    });

    const result = await response.json();

    if (response.ok) {
      // Reload favourites
      loadFavourites(userEmail);
      showNotification('Course removed from favourites', 'info');
    } else {
      showNotification(result || 'Failed to remove from favourites', 'error');
    }
  } catch (error) {
    console.error('Error removing favourite:', error);
    showNotification('Network error. Please try again.', 'error');
  }
}

// saveCourseData and showNotification are now in utils.js

