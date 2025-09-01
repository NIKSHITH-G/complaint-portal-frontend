const forgotForm = document.getElementById("forgotForm");
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const msg = document.getElementById("forgotMessage");
let userEmail = "";

forgotForm.addEventListener("submit", async function(e) {
  e.preventDefault();
  userEmail = document.getElementById("forgotEmail").value;

  try {
    const response = await fetch(API.FORGOT_PASSWORD, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail })
    });

    if (response.ok) {
      const data = await response.json();
      msg.textContent = data.message || "OTP sent to your email!";
      msg.classList.remove("error");
      msg.style.color = "green";

      // Move to step 2
      step1.style.display = "none";
      step2.style.display = "block";
    } else {
      const data = await response.json();
      msg.textContent = data.message || "Failed to send OTP.";
      msg.classList.add("error");
    }
  } catch (err) {
    msg.textContent = "Error connecting to server!";
    msg.classList.add("error");
  }
});

document.getElementById("resetBtn").addEventListener("click", async function() {
  const otp = document.getElementById("otpCode").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (newPassword !== confirmPassword) {
    msg.textContent = "Passwords do not match!";
    msg.classList.add("error");
    return;
  }

  try {
    const response = await fetch(API.RESET_PASSWORD, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, otp, newPassword })
    });

    if (response.ok) {
      const data = await response.json();
      msg.textContent = data.message || "Password reset successful!";
      msg.classList.remove("error");
      msg.style.color = "green";
      setTimeout(() => { window.location.href = "index.html"; }, 1500);
    } else {
      const data = await response.json();
      msg.textContent = data.message || "Failed to reset password.";
      msg.classList.add("error");
    }
  } catch (err) {
    msg.textContent = "Error connecting to server!";
    msg.classList.add("error");
  }
});