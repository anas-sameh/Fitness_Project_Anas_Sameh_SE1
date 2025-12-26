// Profile Page Handler
document.addEventListener("DOMContentLoaded", function () {
  const userEmail = localStorage.getItem("userEmail");

  if (!userEmail) {
    showLoginMessage();
    return;
  }

  showProfileContent();
  loadUserProfile(userEmail);
});

// Function to show login message and hide content
function showLoginMessage() {
  const profileHeader = document.querySelector(".profile-header");
  const profileCourses = document.querySelector(".profile-courses");

  if (profileHeader) profileHeader.style.display = "none";
  if (profileCourses) profileCourses.style.display = "none";

  let loginMessage = document.querySelector(".login-message-container");
  if (!loginMessage) {
    loginMessage = document.createElement("div");
    loginMessage.className = "login-message-container";
    loginMessage.style.cssText = `min-height:200px;display:flex;align-items:center;justify-content:center;padding:60px 20px;text-align:center;`;
    loginMessage.innerHTML = `
      <div style="max-width:500px;">
        <h2 style="color:#333;margin-bottom:20px;font-size:28px;font-weight:600;">Please Login First</h2>
        <p style="color:#666;margin-bottom:30px;font-size:16px;line-height:1.6;">You need to login to view your profile</p>
        <a href="login.html" style="display:inline-block;padding:12px 30px;background:#f5a623;color:white;text-decoration:none;border-radius:5px;font-weight:500;">Go to Login</a>
      </div>
    `;

    const profileSection = document.querySelector(".profile");
    if (profileSection)
      profileSection.insertBefore(loginMessage, profileSection.firstChild);
  }
}

// Show profile content and remove login message
function showProfileContent() {
  const loginMessage = document.querySelector(".login-message-container");
  if (loginMessage) loginMessage.remove();

  const profileHeader = document.querySelector(".profile-header");
  const profileCourses = document.querySelector(".profile-courses");
  if (profileHeader) profileHeader.style.display = "block";
  if (profileCourses) profileCourses.style.display = "block";
}

window.addEventListener("storage", function (e) {
  if (e.key === "userEmail") checkLoginStatus();
});

function checkLoginStatus() {
  const userEmail = localStorage.getItem("userEmail");
  if (userEmail) {
    showProfileContent();
    loadUserProfile(userEmail);
  } else {
    showLoginMessage();
  }
}

setInterval(checkLoginStatus, 1000);

// Load user profile and enrolled courses
async function loadUserProfile(email) {
  try {
    const response = await fetch(
      `http://localhost:3000/user/profile?email=${encodeURIComponent(email)}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        localStorage.removeItem("userEmail");
        showNotification("User not found. Please login again.", "error", 3000);
        window.location.href = "login.html";
        return;
      }
      throw new Error("Failed to load profile");
    }

    const userData = await response.json();
    displayUserProfile(userData);

    // Render enrolled courses if present
    if (userData.enrolledCourses && Array.isArray(userData.enrolledCourses)) {
      renderEnrolledCourses(userData.enrolledCourses);
    } else {
      renderEnrolledCourses([]);
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    showNotification(
      "Failed to load profile. Please try again.",
      "error",
      3000
    );
  }
}

function displayUserProfile(userData) {
  const profileName = document.querySelector(".profile-info h2");
  const profileTitle = document.querySelector(".profile-info p");
  if (profileName) profileName.textContent = userData.name || "User";
  if (profileTitle) profileTitle.textContent = userData.email || "Member";
}

// Render enrolled courses into the .courses-grid element
function renderEnrolledCourses(courses) {
  const grid = document.querySelector(".courses-grid");
  if (!grid) return;
  grid.innerHTML = "";

  if (!courses || courses.length === 0) {
    const empty = document.createElement("div");
    empty.style.cssText =
      "padding:40px;text-align:center;color:#666;grid-column:1/-1;";
    empty.innerHTML =
      '<h4 style="margin-bottom:8px;color:#333">No enrolled courses yet</h4><p>Enroll in courses from the <a href="courses.html">courses</a> page.</p>';
    grid.appendChild(empty);
    return;
  }

  courses.forEach((course) => {
    const card = document.createElement("div");
    card.className = "course-card";
    card.setAttribute("data-title", course.title || "");
    card.setAttribute("data-author", course.author || "");
    card.setAttribute("data-price", course.price || "0");
    card.setAttribute("data-duration", course.duration || "0");
    card.setAttribute("data-lessons", course.lessons || "0");
    card.setAttribute("data-category", course.category || "");
    card.setAttribute("data-image", course.image || "");

    card.innerHTML = `
      <a href="coursedetails.html" class="course-link" onclick="saveCourseData(event, this)">
        <div class="course-img">
          <img src="${course.image || "img/courses-1.webp"}" alt="${
      course.title
    }">
          <span class="price">$${course.price || "0"}</span>
        </div>
      </a>
      <div class="course-info">
        <span class="author">By ${course.author || ""}</span>
        <h4>${course.title || ""}</h4>
        <div class="meta">
          <span>${course.lessons || "0"} Lessons</span>
          <span>${course.duration || "0"}h</span>
        </div>
      </div>
    `;

    // Append to grid
    grid.appendChild(card);

    // Add Unenroll button
    const info = card.querySelector(".course-info");
    if (info) {
      const btn = document.createElement("button");
      btn.className = "unenroll-btn";
      btn.textContent = "Unenroll";
      btn.style.cssText =
        "margin-top:10px;padding:8px 12px;border-radius:6px;border:none;background:#ff4d4f;color:#fff;cursor:pointer;";
      btn.addEventListener("click", (e) =>
        unenrollCourse(e, course.title, card)
      );
      info.appendChild(btn);
    }
  });
}

// Unenroll handler - calls backend to remove course from enrolled list
async function unenrollCourse(event, title, cardElement) {
  event.preventDefault();
  event.stopPropagation();

  const userEmail = localStorage.getItem("userEmail");
  if (!userEmail) {
    showLoginModal("Please login first to manage your courses");
    return;
  }

  // optional confirmation — use styled confirm modal
  const confirmed = await showConfirmModal(
    "Are you sure you want to unenroll from this course?",
    { okText: "Unenroll", cancelText: "Cancel" }
  );
  if (!confirmed) return;

  try {
    const res = await fetch("http://localhost:3000/user/enrolled", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, title }),
    });

    let payload = null;
    try {
      payload = await res.json();
    } catch (err) {
      /* ignore parse */
    }

    if (res.ok) {
      // remove card from UI
      if (cardElement && cardElement.parentNode) cardElement.remove();
      showNotification("Unenrolled successfully", "success", 3000);

      // if no courses left show empty state
      const grid = document.querySelector(".courses-grid");
      if (grid && grid.children.length === 0) renderEnrolledCourses([]);
    } else {
      showNotification(
        (payload && payload.message) || "Failed to unenroll",
        "error",
        3000
      );
    }
  } catch (error) {
    console.error("Error unenrolling:", error);
    showNotification("Network error. Please try again.", "error", 3000);
  }
}
