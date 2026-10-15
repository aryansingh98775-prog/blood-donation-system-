// ========================================================
// LifeFlow Blood Donation System - Main Application Logic
// Hybrid Backend REST API + LocalStorage Fallback
// ========================================================

// Toast Notification
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

// Copy to clipboard helper
function copyToClipboard(text, label = 'Link') {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} copied to clipboard!`, 'success');
    }).catch(() => {
      prompt("Copy this URL:", text);
    });
  } else {
    prompt("Copy this URL:", text);
  }
}

// Mobile Nav Toggle
function setupMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }
}

// ========================================================
// Donors Directory
// ========================================================
async function fetchDonorsData(blood = 'all', city = '', avail = false) {
  // 1. Try server API
  try {
    let url = `/api/donors?bloodGroup=${encodeURIComponent(blood)}`;
    if (city) url += `&city=${encodeURIComponent(city)}`;
    if (avail) url += `&available=true`;
    
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    // API server offline, proceed to localStorage
  }

  // 2. LocalStorage Fallback
  let donors = JSON.parse(localStorage.getItem('lifeflow_donors') || '[]');
  if (blood !== 'all') {
    donors = donors.filter(d => d.bloodGroup === blood);
  }
  if (city) {
    const query = city.toLowerCase();
    donors = donors.filter(d => 
      d.city.toLowerCase().includes(query) || 
      (d.area && d.area.toLowerCase().includes(query))
    );
  }
  if (avail) {
    donors = donors.filter(d => d.available === true);
  }
  return donors;
}

async function renderDonors(list = null) {
  const container = document.getElementById('donors-grid');
  if (!container) return;

  const bloodFilter = document.getElementById('filter-blood')?.value || 'all';
  const cityFilter = document.getElementById('filter-city')?.value.trim() || '';
  const availOnly = document.getElementById('filter-available')?.checked || false;

  const donors = list !== null ? list : await fetchDonorsData(bloodFilter, cityFilter, availOnly);

  if (donors.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: white; border-radius: 12px; border: 1px dashed #cbd5e1;">
        <h3>No matching donors found</h3>
        <p style="color: #64748b; margin-top: 0.5rem;">Try changing your blood group or city filter, or register as a new donor!</p>
        <button class="btn btn-primary btn-sm" style="margin-top: 1rem;" onclick="openDonorModal()">Register as Donor</button>
      </div>
    `;
    return;
  }

  container.innerHTML = donors.map(donor => `
    <div class="donor-card">
      <div class="donor-header">
        <div class="donor-badge-box">
          ${donor.bloodGroup}
        </div>
        <span class="donor-status-indicator ${donor.available ? 'available' : 'unavailable'}">
          ${donor.available ? '● Available' : '○ Unavailable'}
        </span>
      </div>

      <h3 class="donor-name">${donor.name}</h3>
      <div class="donor-location">
        📍 ${donor.area ? donor.area + ', ' : ''}${donor.city}
      </div>

      <div class="donor-meta-row">
        <div>
          <span class="donor-meta-label">Donations:</span>
          <span class="donor-meta-val">${donor.donations || 0} times</span>
        </div>
        <div>
          <span class="donor-meta-label">Last Given:</span>
          <span class="donor-meta-val">${donor.lastDonation || 'Never'}</span>
        </div>
      </div>

      <div class="donor-actions">
        <a href="tel:${donor.phone}" class="btn btn-primary btn-sm" style="flex: 1;">
          📞 Contact
        </a>
        <button class="btn btn-outline btn-sm" onclick="requestDonorDirect('${donor.id}', '${donor.name}', '${donor.bloodGroup}')">
          🩸 Request
        </button>
      </div>
    </div>
  `).join('');
}

async function filterDonors() {
  const bloodFilter = document.getElementById('filter-blood')?.value || 'all';
  const cityFilter = document.getElementById('filter-city')?.value.trim() || '';
  const availOnly = document.getElementById('filter-available')?.checked || false;

  const filtered = await fetchDonorsData(bloodFilter, cityFilter, availOnly);
  renderDonors(filtered);
}

function resetDonorFilter() {
  const blood = document.getElementById('filter-blood');
  const city = document.getElementById('filter-city');
  const avail = document.getElementById('filter-available');
  if (blood) blood.value = 'all';
  if (city) city.value = '';
  if (avail) avail.checked = false;
  renderDonors();
}

function requestDonorDirect(donorId, donorName, bloodGroup) {
  const modal = document.getElementById('request-blood-modal');
  if (modal) {
    document.getElementById('req-blood-group').value = bloodGroup;
    document.getElementById('req-reason').value = `Direct request for donor ${donorName}`;
    modal.classList.add('active');
  } else {
    alert(`Please reach out to ${donorName} (${bloodGroup}) using the call button or submit an emergency request form.`);
  }
}

// ========================================================
// Emergency Blood Requests Board
// ========================================================
async function fetchRequestsData() {
  // Try server API
  try {
    const res = await fetch('/api/requests');
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) return json.data;
    }
  } catch (err) {
    // API server offline
  }

  // Fallback
  return JSON.parse(localStorage.getItem('lifeflow_requests') || '[]');
}

async function renderRequests() {
  const container = document.getElementById('requests-grid');
  if (!container) return;

  const requests = await fetchRequestsData();

  if (requests.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <p>No active blood requests at this moment. Blood banks are currently stable.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = requests.map(req => {
    const isCritical = req.urgency === 'critical';
    const badgeClass = isCritical ? 'badge-danger' : req.urgency === 'urgent' ? 'badge-urgent' : 'badge-info';
    const urgencyLabel = isCritical ? '🚨 CRITICAL' : req.urgency === 'urgent' ? '⚡ URGENT' : 'STANDARD';

    return `
      <div class="request-card ${req.urgency}">
        <div class="request-header">
          <span class="badge ${badgeClass}">${urgencyLabel}</span>
          <span class="badge badge-blood">${req.bloodGroup} · ${req.units} Unit(s)</span>
        </div>

        <h3 class="request-patient">${req.patientName}</h3>
        <div class="request-hospital">
          🏥 ${req.hospital}, ${req.city}
        </div>

        <div class="request-details-box">
          <div class="request-reason">"${req.reason}"</div>
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: #64748b;">
            <span>Contact: <strong>${req.contactPerson}</strong></span>
            <span>🕒 ${req.postedAt || 'Recently'}</span>
          </div>
        </div>

        <div class="request-contact">
          <a href="tel:${req.phone}" class="btn btn-primary btn-sm" style="width: 100%;">
            🩸 Help / Donate Blood (${req.phone})
          </a>
        </div>
      </div>
    `;
  }).join('');
}

async function handleAddRequest(e) {
  e.preventDefault();
  const form = e.target;
  const patientName = form.patientName.value.trim();
  const bloodGroup = form.bloodGroup.value;
  const units = parseInt(form.units.value) || 1;
  const hospital = form.hospital.value.trim();
  const city = form.city.value.trim();
  const urgency = form.urgency.value;
  const contactPerson = form.contactPerson.value.trim();
  const phone = form.phone.value.trim();
  const reason = form.reason.value.trim() || 'Urgent requirement';

  if (!patientName || !hospital || !city || !phone) {
    showToast('Please fill out all required fields.', 'error');
    return;
  }

  const payload = {
    patientName,
    bloodGroup,
    units,
    hospital,
    city,
    urgency,
    contactPerson,
    phone,
    reason
  };

  // Try API first
  let postedToApi = false;
  try {
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      postedToApi = true;
    }
  } catch (err) {
    // API offline
  }

  // Always keep localStorage updated as well
  const requests = JSON.parse(localStorage.getItem('lifeflow_requests') || '[]');
  const newReq = {
    ...payload,
    id: 'req_' + Date.now(),
    status: 'open',
    postedAt: 'Just now'
  };
  requests.unshift(newReq);
  localStorage.setItem('lifeflow_requests', JSON.stringify(requests));

  await renderRequests();
  closeModal('request-blood-modal');
  form.reset();
  showToast('Emergency request broadcasted successfully' + (postedToApi ? ' to Server Database!' : '!'), 'success');
}

// ========================================================
// Compatibility Matrix Interactive Logic
// ========================================================
function setupCompatibility() {
  const tabs = document.querySelectorAll('.blood-tab-btn');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderCompatibility(tab.dataset.blood);
    });
  });

  // Default display O-
  renderCompatibility('O-');
}

function renderCompatibility(bloodType) {
  if (typeof COMPATIBILITY_DATA === 'undefined') return;
  const data = COMPATIBILITY_DATA[bloodType];
  if (!data) return;

  const titleEl = document.getElementById('compat-selected-title');
  const badgeEl = document.getElementById('compat-selected-badge');
  const summaryEl = document.getElementById('compat-selected-summary');
  const giveGrid = document.getElementById('compat-give-grid');
  const receiveGrid = document.getElementById('compat-receive-grid');

  if (titleEl) titleEl.innerText = `Blood Type: ${bloodType}`;
  if (badgeEl) badgeEl.innerText = data.badge;
  if (summaryEl) summaryEl.innerText = data.summary;

  const allTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

  if (giveGrid) {
    giveGrid.innerHTML = allTypes.map(type => {
      const isCompat = data.canGiveTo.includes(type);
      return `
        <span class="compat-pill ${isCompat ? 'highlight' : ''}">
          ${isCompat ? '✓ ' : '✕ '} ${type}
        </span>
      `;
    }).join('');
  }

  if (receiveGrid) {
    receiveGrid.innerHTML = allTypes.map(type => {
      const isCompat = data.canReceiveFrom.includes(type);
      return `
        <span class="compat-pill ${isCompat ? 'highlight' : ''}">
          ${isCompat ? '✓ ' : '✕ '} ${type}
        </span>
      `;
    }).join('');
  }
}

// ========================================================
// Blood Donation Camps
// ========================================================
async function fetchCampsData() {
  try {
    const res = await fetch('/api/camps');
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) return json.data;
    }
  } catch (err) {}
  return JSON.parse(localStorage.getItem('lifeflow_camps') || '[]');
}

async function renderCamps() {
  const container = document.getElementById('camps-grid');
  if (!container) return;

  const camps = await fetchCampsData();

  container.innerHTML = camps.map(c => `
    <div class="camp-card">
      <div class="camp-date-badge">
        📅 ${c.date} · ${c.time}
      </div>
      <h3 class="camp-title">${c.title}</h3>
      <div class="camp-organizer">Organized by <strong>${c.organizer}</strong></div>

      <ul class="camp-info-list">
        <li>📍 <span>${c.venue}, ${c.city}</span></li>
        <li>📞 <span>Helpline: ${c.contact}</span></li>
        <li>👥 <span><strong>${c.registeredCount}</strong> Donors Registered</span></li>
      </ul>

      <button class="btn btn-outline-primary btn-sm" onclick="registerForCamp('${c.id}')" style="margin-top: auto;">
        Register to Attend Camp
      </button>
    </div>
  `).join('');
}

async function registerForCamp(campId) {
  try {
    await fetch(`/api/camps/${campId}/register`, { method: 'POST' });
  } catch (err) {}

  const camps = JSON.parse(localStorage.getItem('lifeflow_camps') || '[]');
  const camp = camps.find(c => c.id === campId);
  if (camp) {
    camp.registeredCount = (camp.registeredCount || 0) + 1;
    localStorage.setItem('lifeflow_camps', JSON.stringify(camps));
  }

  await renderCamps();
  showToast(`You have registered for the blood drive! Check-in instructions saved.`, 'success');
}

// ========================================================
// Eligibility Quiz
// ========================================================
function checkEligibility() {
  const age = parseInt(document.getElementById('quiz-age')?.value || 0);
  const weight = parseInt(document.getElementById('quiz-weight')?.value || 0);
  const tattoo = document.getElementById('quiz-tattoo')?.value === 'yes';
  const surgery = document.getElementById('quiz-surgery')?.value === 'yes';
  const resultDiv = document.getElementById('eligibility-result');

  if (!resultDiv) return;

  let reasons = [];
  if (age < 18 || age > 65) reasons.push("Age must be between 18 and 65 years.");
  if (weight < 50) reasons.push("Weight must be at least 50 kg.");
  if (tattoo) reasons.push("Wait 6 months after receiving a tattoo or piercing.");
  if (surgery) reasons.push("Wait 6 to 12 months following major surgery.");

  if (reasons.length === 0) {
    resultDiv.innerHTML = `
      <div style="background: #ecfdf5; border: 1px solid #10b981; color: #065f46; padding: 1.25rem; border-radius: 10px; margin-top: 1rem;">
        <h4 style="font-weight: 800; font-size: 1.1rem; margin-bottom: 0.25rem;">🎉 You are Eligible to Donate Blood!</h4>
        <p style="font-size: 0.9rem;">Your physical condition satisfies the primary clinical requirements. You can register as a donor or visit any nearby camp.</p>
        <button class="btn btn-success btn-sm" style="margin-top: 0.75rem;" onclick="openDonorModal(); closeModal('eligibility-modal');">Register as Donor Now</button>
      </div>
    `;
  } else {
    resultDiv.innerHTML = `
      <div style="background: #fff1f2; border: 1px solid #f43f5e; color: #9f1239; padding: 1.25rem; border-radius: 10px; margin-top: 1rem;">
        <h4 style="font-weight: 800; font-size: 1.1rem; margin-bottom: 0.25rem;">⚠️ You are not eligible currently</h4>
        <ul style="font-size: 0.85rem; margin-left: 1.25rem; margin-top: 0.5rem;">
          ${reasons.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
    `;
  }
}

// Modal management
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

function openDonorModal() {
  const user = Auth.getCurrentUser();
  if (!user) {
    window.location.href = 'auth.html?mode=signup&role=donor';
    return;
  }
  openModal('add-donor-modal');
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  setupMobileNav();
  renderDonors();
  renderRequests();
  setupCompatibility();
  renderCamps();

  // Attach search listeners
  const bloodFilter = document.getElementById('filter-blood');
  const cityFilter = document.getElementById('filter-city');
  const availFilter = document.getElementById('filter-available');

  if (bloodFilter) bloodFilter.addEventListener('change', filterDonors);
  if (cityFilter) cityFilter.addEventListener('input', filterDonors);
  if (availFilter) availFilter.addEventListener('change', filterDonors);

  // Close modals when clicking outside
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
});
