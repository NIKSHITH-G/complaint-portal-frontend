// Toggle between Sign In and Sign Up with fade effect
function toggleForm() {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const leftPanel = document.querySelector(".left");

  if (loginForm.classList.contains("active")) {
    loginForm.classList.remove("active");
    signupForm.classList.add("active");
    leftPanel.classList.add("teal-theme");
  } else {
    signupForm.classList.remove("active");
    loginForm.classList.add("active");
    leftPanel.classList.remove("teal-theme");
  }
}

// Default state: show login form
window.onload = () => {
  document.getElementById("loginForm").classList.add("active");
};

// Handle Sign Up
document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("signupConfirmPassword").value;
  const msg = document.getElementById("signupMessage");

  if (password !== confirmPassword) {
    msg.textContent = "Passwords do not match!";
    msg.classList.add("error");
    return;
  }

  try {
    const response = await fetch(API.SIGNUP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      msg.textContent = "Signup successful! You can login now.";
      msg.classList.remove("error");
      msg.style.color = "green";
      setTimeout(() => toggleForm(), 1000);
    } else {
      const data = await response.json();
      msg.textContent = data.message || "Signup failed!";
      msg.classList.add("error");
    }
  } catch (err) {
    msg.textContent = "Error connecting to server!";
    msg.classList.add("error");
  }
});

// Handle Login
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const msg = document.getElementById("loginMessage");

  try {
    // ===== Dummy login fallback =====
    if (email === "test@demo.com" && password === "123456") {
      msg.textContent = "Login successful (dummy user)!";
      msg.classList.remove("error");
      msg.style.color = "green";
      localStorage.setItem("token", "dummy-jwt-token");
      window.location.href = "dashboard.html"; // ✅ relative path
      return;
    }
    // ===== End dummy login =====

    const response = await fetch(API.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      msg.textContent = "Login successful!";
      msg.classList.remove("error");
      msg.style.color = "green";
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html"; // ✅ relative path
    } else {
      const data = await response.json();
      msg.textContent = data.message || "Login failed!";
      msg.classList.add("error");
    }
  } catch (err) {
    msg.textContent = "Error connecting to server!";
    msg.classList.add("error");
  }
});