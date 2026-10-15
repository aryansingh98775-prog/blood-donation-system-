// ==========================================
// LifeFlow Authentication & Session Management
// Works seamlessly on GitHub Pages (localStorage) and Local Python/Node Server (REST API)
// ==========================================

// Global Toast Notification Helper
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span> <div>${message}</div>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

const Auth = {
  isLocalServer() {
    return typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  },

  getCurrentUser() {
    const raw = localStorage.getItem("lifeflow_session");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  getUsers() {
    const raw = localStorage.getItem("lifeflow_users");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return (typeof DEFAULT_USERS !== 'undefined') ? DEFAULT_USERS : [];
  },

  async login(email, password) {
    const cleanEmail = email.trim().toLowerCase();

    // 1. If running on local server, try backend API
    if (this.isLocalServer()) {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            localStorage.setItem("lifeflow_session", JSON.stringify(data.user));
            return { success: true, user: data.user, source: 'api' };
          }
        }
      } catch (err) {
        // Fall through to localStorage
      }
    }

    // 2. Direct Client-side / GitHub Pages Fallback
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, message: "No account found with this email. Please click 'Register New Account'!" };
    }

    if (user.password !== password) {
      return { success: false, message: "Incorrect password. (Hint: Demo password is 'password123')" };
    }

    localStorage.setItem("lifeflow_session", JSON.stringify(user));
    return { success: true, user, source: 'local' };
  },

  async signup(data) {
    const cleanEmail = data.email.trim().toLowerCase();

    // 1. If local server, try backend API
    if (this.isLocalServer()) {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.user) {
            localStorage.setItem("lifeflow_session", JSON.stringify(result.user));
            return { success: true, user: result.user, source: 'api' };
          }
        }
      } catch (err) {
        // Fall through
      }
    }

    // 2. Direct Client-side / GitHub Pages Fallback
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return { success: false, message: "An account with this email already exists." };
    }

    const newUser = {
      id: "usr_" + Date.now(),
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password,
      role: data.role || "donor",
      bloodGroup: data.bloodGroup || "O+",
      phone: data.phone || "+91 98765 43210",
      city: data.city || "New Delhi",
      age: data.age ? parseInt(data.age) : 24,
      gender: data.gender || "Not specified",
      donationsCount: data.role === 'donor' ? 1 : 0,
      lastDonated: "Recent",
      available: true,
      verified: true
    };

    users.push(newUser);
    localStorage.setItem("lifeflow_users", JSON.stringify(users));

    if (newUser.role === "donor") {
      const donors = JSON.parse(localStorage.getItem("lifeflow_donors") || "[]");
      donors.unshift({
        id: "don_" + Date.now(),
        name: newUser.name,
        bloodGroup: newUser.bloodGroup,
        city: newUser.city,
        area: "Registered Member",
        phone: newUser.phone,
        email: newUser.email,
        age: newUser.age,
        gender: newUser.gender,
        donations: 1,
        lastDonation: "Recent",
        available: true,
        verified: true
      });
      localStorage.setItem("lifeflow_donors", JSON.stringify(donors));
    }

    localStorage.setItem("lifeflow_session", JSON.stringify(newUser));
    return { success: true, user: newUser, source: 'local' };
  },

  logout() {
    localStorage.removeItem("lifeflow_session");
    window.location.reload();
  },

  quickDemoLogin(role) {
    const users = this.getUsers();
    const match = users.find(u => u.role === role) || users[0];
    if (match) {
      localStorage.setItem("lifeflow_session", JSON.stringify(match));
      return { success: true, user: match };
    }
    return { success: false, message: "Demo user not found." };
  }
};

// UI helper to update header navigation across pages
function renderNavAuth() {
  const container = document.getElementById("nav-auth-container");
  if (!container) return;

  const user = Auth.getCurrentUser();
  if (user) {
    container.innerHTML = `
      <div class="user-pill-dropdown">
        <a href="dashboard.html" class="user-pill-btn">
          <span class="user-avatar">${user.name.charAt(0).toUpperCase()}</span>
          <span class="user-info-text">
            <strong class="user-name">${user.name.split(" ")[0]}</strong>
            <span class="user-badge-role ${user.role}">${user.role.toUpperCase()} ${user.bloodGroup ? '· ' + user.bloodGroup : ''}</span>
          </span>
        </a>
        <div class="user-menu">
          <a href="dashboard.html" class="user-menu-item">
            <span>📊</span> My Dashboard
          </a>
          <button onclick="handleLogout()" class="user-menu-item text-danger">
            <span>🚪</span> Sign Out
          </button>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <a href="auth.html?mode=login" class="btn btn-outline btn-sm">Sign In</a>
      <a href="auth.html?mode=signup" class="btn btn-primary btn-sm">Register</a>
    `;
  }
}

function handleLogout() {
  if (confirm("Are you sure you want to sign out?")) {
    Auth.logout();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderNavAuth();
});
