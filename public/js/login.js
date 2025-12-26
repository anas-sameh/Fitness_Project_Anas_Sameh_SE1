document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // 🚫 منع refresh

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      showNotification("Please fill all fields", "error");
      return;
    }

    const btn = loginForm.querySelector("button");
    btn.disabled = true;
    btn.textContent = "Logging in...";

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pass: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showNotification(data, "error");
        btn.disabled = false;
        btn.textContent = "Login";
        return;
      }

      showNotification("Login successful 🎉", "success");
      localStorage.setItem("userEmail", email);

      setTimeout(() => {
        window.location.href = "home.html";
      }, 1500);
    } catch (err) {
      console.error(err);
      showNotification("Server error", "error");
      btn.disabled = false;
      btn.textContent = "Login";
    }
  });
});
