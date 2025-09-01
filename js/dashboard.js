// Check login token
const token = localStorage.getItem("token");

if (!token) {
  // No token, redirect to login
  window.location.href = "/index.html";
} else {
  // Optional: verify token with backend
  fetch("/api/auth/verify", {
    method: "GET",
    headers: { "Authorization": "Bearer " + token }
  })
  .then(res => {
    if (res.status === 401) {
      // Token invalid or expired
      localStorage.removeItem("token");
      window.location.href = "/index.html";
    }
  })
  .catch(() => {
    // If server is unreachable, still force login for safety
    localStorage.removeItem("token");
    window.location.href = "/index.html";
  });
}
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/index.html";
}

// Detect location
document.getElementById("detectLocationBtn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        document.getElementById("complaintLocation").value = `${latitude}, ${longitude}`;
      },
      () => { alert("Unable to fetch location."); }
    );
  } else {
    alert("Geolocation not supported.");
  }
});

// Anonymous toggle
const anonymousCheckbox = document.getElementById("anonymousComplaint");
const nameField = document.getElementById("complaintName");
const contactField = document.getElementById("complaintContact");

anonymousCheckbox.addEventListener("change", () => {
  if (anonymousCheckbox.checked) {
    nameField.value = "";
    contactField.value = "";
    nameField.disabled = true;
    contactField.disabled = true;
    nameField.removeAttribute("required");
    contactField.removeAttribute("required");
  } else {
    nameField.disabled = false;
    contactField.disabled = false;
    nameField.setAttribute("required", "true");
    contactField.setAttribute("required", "true");
  }
});

// Submit complaint
document.getElementById("complaintForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("complaintMessage");

  const formData = new FormData();
  formData.append("name", document.getElementById("complaintName").value);
  formData.append("contact", document.getElementById("complaintContact").value);
  formData.append("category", document.getElementById("complaintCategory").value);
  formData.append("description", document.getElementById("complaintDescription").value);
  formData.append("location", document.getElementById("complaintLocation").value);

  const files = document.getElementById("complaintFiles").files;
  for (let file of files) { formData.append("files", file); }

  try {
    const response = await fetch(API.COMPLAINTS.CREATE, {
      method: "POST",
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      body: formData
    });

    if (response.ok) {
      msg.textContent = "Complaint submitted successfully!";
      msg.style.color = "green";
      document.getElementById("complaintForm").reset();
      loadComplaints();
    } else {
      msg.textContent = "Failed to submit complaint.";
      msg.style.color = "red";
    }
  } catch (err) {
    console.error("Error submitting complaint", err);
    msg.textContent = "Server error!";
    msg.style.color = "red";
  }
});

// Load complaints
async function loadComplaints() {
  const tableBody = document.getElementById("complaintsTable").querySelector("tbody");
  tableBody.innerHTML = "";

  try {
    const response = await fetch(API.COMPLAINTS.MY, {
      method: "GET",
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });

    if (response.ok) {
      const complaints = await response.json();
      if (!complaints || complaints.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No complaints found</td></tr>`;
        return;
      }
      complaints.forEach((c) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${c.id}</td>
          <td>${c.category}</td>
          <td>${c.description}</td>
          <td class="status ${c.status.toLowerCase()}">${c.status}</td>
          <td>${c.dateFiled}</td>
          <td>${c.response || "-"}</td>
        `;
        tableBody.appendChild(row);
      });
    } else {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Failed to load complaints</td></tr>`;
    }
  } catch (err) {
    console.error("Error fetching complaints", err);
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Error loading complaints</td></tr>`;
  }
}

// Init
window.onload = () => { loadComplaints(); };

// Sidebar navigation toggle
document.getElementById("navComplaints").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("complaints").style.display = "block";
  document.getElementById("file-complaint").style.display = "none";
  document.getElementById("navComplaints").classList.add("active");
  document.getElementById("navFile").classList.remove("active");
});

document.getElementById("navFile").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("complaints").style.display = "none";
  document.getElementById("file-complaint").style.display = "block";
  document.getElementById("navFile").classList.add("active");
  document.getElementById("navComplaints").classList.remove("active");
});

// Language toggle
document.getElementById("langSwitch").addEventListener("click", () => {
  const userName = document.getElementById("userName");
  const complaintsTitle = document.querySelector("#complaints h2");
  const fileComplaintTitle = document.querySelector("#file-complaint h2");

  if (document.body.classList.contains("lang-hindi")) {
    document.body.classList.remove("lang-hindi");
    userName.textContent = "User";
    complaintsTitle.innerHTML = '<i class="fas fa-list"></i> My Complaints';
    fileComplaintTitle.innerHTML = '<i class="fas fa-edit"></i> File a New Complaint';
  } else {
    document.body.classList.add("lang-hindi");
    userName.textContent = "उपयोगकर्ता";
    complaintsTitle.innerHTML = '<i class="fas fa-list"></i> मेरी शिकायतें';
    fileComplaintTitle.innerHTML = '<i class="fas fa-edit"></i> नई शिकायत दर्ज करें';
  }
});

// Dark mode toggle
document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Font size toggle
document.getElementById("fontSizeToggle").addEventListener("click", () => {
  document.body.classList.toggle("font-large");
});