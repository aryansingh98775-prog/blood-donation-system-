// ==========================================
// LifeFlow Authentication & Session Management
// Hybrid: Direct Backend REST API + LocalStorage Fallback
// ==========================================

const Auth = {
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
    return raw ? JSON.parse(raw) : (typeof DEFAULT_USERS !== 'undefined' ? DEFAULT_USERS : []);
  },

  async login(email, password) {
    // 1. Try Backend REST API
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          localStorage.setItem("lifeflow_session", JSON.stringify(data.user));
          return { success: true, user: data.user, source: 'api' };
        }
      } else if (res.status === 401 || res.status === 404) {
        const errData = await res.json();
        return { success: false, message: errData.message || "Invalid credentials." };
      }
    } catch (err) {
      // Backend not running or static file protocol, gracefully fallback
    }

    // 2. LocalStorage Fallback
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      return { success: false, message: "No account found with this email. Please register!" };
    }

    if (user.password !== password) {
      return { success: false, message: "Incorrect password. Please try again." };
    }

    localStorage.setItem("lifeflow_session", JSON.stringify(user));
    return { success: true, user, source: 'local' };
  },

  async signup(data) {
    // 1. Try Backend REST API
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
      } else if (res.status === 409) {
        return { success: false, message: "An account with this email already exists." };
      }
    } catch (err) {
      // Backend not running, gracefully fallback
    }

    // 2. LocalStorage Fallback
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === data.email.trim().toLowerCase());

    if (existing) {
      return { success: false, message: "An account with this email already exists." };
    }

    const newUser = {
      id: "usr_" + Date.now(),
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      role: data.role || "donor",
      bloodGroup: data.bloodGroup || "O+",
      phone: data.phone || "",
      city: data.city || "",
      age: data.age ? parseInt(data.age) : 25,
      gender: data.gender || "Not specified",
      donationsCount: 0,
      lastDonated: "Never",
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
        donations: 0,
        lastDonation: "Never",
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
    const match = users.find(u => u.role === role);
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
