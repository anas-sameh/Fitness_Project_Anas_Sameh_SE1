// ========== UTILITY FUNCTIONS ==========

// Show notification as modal popup (replaced old side notification)
function showNotification(message, type = "info", duration = 3000) {
  // Remove existing modal if any
  const existingModal = document.querySelector(".message-modal-overlay");
  if (existingModal) {
    existingModal.remove();
  }

  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "message-modal-overlay";

  // Create modal
  const modal = document.createElement("div");
  modal.className = "message-modal";

  // Map type to icon and color
  const iconMap = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  const colorMap = {
    success: "#4CAF50",
    error: "#f44336",
    warning: "#ff9800",
    info: "#2196F3",
  };

  const icon = iconMap[type] || iconMap.info;
  const color = colorMap[type] || colorMap.info;

  modal.innerHTML = `
    <div class="message-modal-icon" style="background-color: ${color};">${icon}</div>
    <p class="message-modal-text">${message}</p>
    <button class="message-modal-ok-btn" style="background-color: ${color};">OK</button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Add styles if not present
  if (!document.getElementById("message-modal-styles")) {
    const style = document.createElement("style");
    style.id = "message-modal-styles";
    style.textContent = `
      .message-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.2s ease;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .message-modal {
        background: white;
        border-radius: 12px;
        padding: 30px;
        max-width: 350px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        text-align: center;
        animation: slideUp 0.3s ease;
      }

      @keyframes slideUp {
        from {
          transform: translateY(30px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .message-modal-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        font-weight: bold;
        margin: 0 auto 15px;
      }

      .message-modal-text {
        font-size: 16px;
        color: #333;
        margin: 0 0 20px 0;
        line-height: 1.5;
      }

      .message-modal-ok-btn {
        padding: 10px 30px;
        border: none;
        border-radius: 6px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
        min-width: 100px;
      }

      .message-modal-ok-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .message-modal-ok-btn:active {
        transform: scale(0.95);
      }

      @media (max-width: 480px) {
        .message-modal {
          padding: 20px;
          max-width: 280px;
        }

        .message-modal-text {
          font-size: 14px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Close modal on OK button click only
  const okBtn = modal.querySelector(".message-modal-ok-btn");
  okBtn.addEventListener("click", () => {
    overlay.remove();
  });
}

// Save course data for details page
function saveCourseData(event, link) {
  event.preventDefault();
  const courseCard = link.closest(".course-card");

  const courseData = {
    title: courseCard.getAttribute("data-title"),
    author: courseCard.getAttribute("data-author"),
    price: courseCard.getAttribute("data-price"),
    duration: courseCard.getAttribute("data-duration"),
    lessons: courseCard.getAttribute("data-lessons"),
    category: courseCard.getAttribute("data-category"),
    image: courseCard.getAttribute("data-image"),
  };

  localStorage.setItem("selectedCourse", JSON.stringify(courseData));
  window.location.href = "coursedetails.html";
}

// Show login modal popup
function showLoginModal(message, action = "login") {
  // Remove existing modal if any
  const existingModal = document.querySelector(".login-modal-overlay");
  if (existingModal) {
    existingModal.remove();
  }

  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "login-modal-overlay";

  // Create modal
  const modal = document.createElement("div");
  modal.className = "login-modal";
  modal.innerHTML = `
    <div class="login-modal-icon">🔒</div>
    <h3 class="login-modal-title">Login Required</h3>
    <p class="login-modal-message">${message}</p>
    <div class="login-modal-buttons">
      <button class="login-modal-btn login-modal-btn-primary" onclick="window.location.href='login.html'">
        Go to Login
      </button>
      <button class="login-modal-btn login-modal-btn-secondary" onclick="closeLoginModal()">
        Cancel
      </button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Close on overlay click
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      closeLoginModal();
    }
  });

  // Close on Escape key
  const escapeHandler = function (e) {
    if (e.key === "Escape") {
      closeLoginModal();
      document.removeEventListener("keydown", escapeHandler);
    }
  };
  document.addEventListener("keydown", escapeHandler);

  // Animate in
  requestAnimationFrame(() => {
    overlay.classList.add("active");
  });
}

// Close login modal
function closeLoginModal() {
  const modal = document.querySelector(".login-modal-overlay");
  if (modal) {
    modal.classList.remove("active");
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

// Add CSS for login modal if not already present
if (!document.getElementById("login-modal-styles")) {
  const style = document.createElement("style");
  style.id = "login-modal-styles";
  style.textContent = `
    .login-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .login-modal-overlay.active {
      opacity: 1;
    }
    
    .login-modal {
      background: white;
      border-radius: 16px;
      padding: 40px;
      max-width: 450px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      transform: scale(0.9) translateY(-20px);
      transition: transform 0.3s ease, opacity 0.3s ease;
      text-align: center;
      opacity: 0;
    }
    
    .login-modal-overlay.active .login-modal {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
    
    .login-modal-icon {
      font-size: 64px;
      margin-bottom: 20px;
      animation: bounce 0.6s ease;
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    .login-modal-title {
      font-size: 24px;
      font-weight: 700;
      color: #333;
      margin: 0 0 12px 0;
    }
    
    .login-modal-message {
      font-size: 16px;
      color: #666;
      line-height: 1.6;
      margin: 0 0 30px 0;
    }
    
    .login-modal-buttons {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    
    .login-modal-btn {
      padding: 12px 30px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 140px;
    }
    
    .login-modal-btn-primary {
      background: linear-gradient(135deg, #f5a623 0%, #f39c12 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(245, 166, 35, 0.4);
    }
    
    .login-modal-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(245, 166, 35, 0.5);
    }
    
    .login-modal-btn-primary:active {
      transform: translateY(0);
    }
    
    .login-modal-btn-secondary {
      background: #f5f5f5;
      color: #666;
      border: 2px solid #e0e0e0;
    }
    
    .login-modal-btn-secondary:hover {
      background: #e8e8e8;
      border-color: #d0d0d0;
    }
    
    @media (max-width: 480px) {
      .login-modal {
        padding: 30px 20px;
      }
      
      .login-modal-buttons {
        flex-direction: column;
      }
      
      .login-modal-btn {
        width: 100%;
      }
    }
  `;
  document.head.appendChild(style);
}

// Show a reusable confirmation modal. Returns a Promise<boolean>.
function showConfirmModal(message, options = {}) {
  return new Promise((resolve) => {
    // Remove existing confirm modal if any
    const existing = document.querySelector(".confirm-modal-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.className = "confirm-modal-overlay";

    const modal = document.createElement("div");
    modal.className = "confirm-modal";
    modal.innerHTML = `
      <div class="confirm-icon">⚠️</div>
      <h3 class="confirm-title">${options.title || "Please confirm"}</h3>
      <p class="confirm-message">${message}</p>
      <div class="confirm-actions">
        <button class="confirm-btn confirm-cancel">${
          options.cancelText || "Cancel"
        }</button>
        <button class="confirm-btn confirm-ok">${
          options.okText || "Yes, Unenroll"
        }</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Add styles if not present
    if (!document.getElementById("confirm-modal-styles")) {
      const s = document.createElement("style");
      s.id = "confirm-modal-styles";
      s.textContent = `
        .confirm-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10002;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .confirm-modal-overlay.active { opacity: 1; }
        .confirm-modal {
          background: #fff;
          padding: 24px 20px;
          border-radius: 12px;
          width: 400px;
          max-width: 90%;
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
          text-align: center;
          transform: translateY(-8px);
          transition: transform 0.18s ease, opacity 0.18s ease;
        }
        .confirm-modal-overlay.active .confirm-modal { transform: translateY(0); }
        .confirm-icon { font-size: 36px; margin-bottom: 8px; }
        .confirm-title { margin: 0 0 8px 0; font-size: 20px; color: #222; }
        .confirm-message { color: #555; margin-bottom: 18px; }
        .confirm-actions { display:flex; gap:10px; justify-content:center; }
        .confirm-btn { padding:10px 14px; border-radius:8px; border:none; cursor:pointer; font-weight:600; }
        .confirm-cancel { background:#f3f3f3; color:#333; }
        .confirm-ok { background:#ff4d4f; color:#fff; }
        @media (max-width:420px){ .confirm-modal{ padding:18px 14px } }
      `;
      document.head.appendChild(s);
    }

    // show
    requestAnimationFrame(() => overlay.classList.add("active"));

    // handlers
    const onClose = (result) => {
      overlay.classList.remove("active");
      setTimeout(() => overlay.remove(), 200);
      resolve(result);
    };

    modal
      .querySelector(".confirm-cancel")
      .addEventListener("click", () => onClose(false));
    modal
      .querySelector(".confirm-ok")
      .addEventListener("click", () => onClose(true));

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) onClose(false);
    });

    const escHandler = (e) => {
      if (e.key === "Escape") {
        onClose(false);
        document.removeEventListener("keydown", escHandler);
      }
    };
    document.addEventListener("keydown", escHandler);
  });
}
