# 🩸 LifeFlow - Blood Donation Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.8+](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Database: SQLite3](https://img.shields.io/badge/Database-SQLite3-003B57.svg)](https://www.sqlite.org/)
[![Status: Production Ready](https://img.shields.io/badge/Status-Complete-brightgreen.svg)]()

> A full-stack web application designed to connect voluntary blood donors, patients, and hospitals in real-time. Features role-based authentication, real-time emergency requests, interactive blood compatibility tracking, and printable digital donor cards.

---

## 🔗 Quick Links

* 🌐 **Website Live Local Server**: [`http://localhost:8080`](http://localhost:8080)
* 🐙 **GitHub Repository**: [`https://github.com/aryansingh98775-prog/blood-donation-system-`](https://github.com/aryansingh98775-prog/blood-donation-system-)
* 🚀 **GitHub Pages Deployment Target**: [`https://aryansingh98775-prog.github.io/blood-donation-system/`](https://aryansingh98775-prog.github.io/blood-donation-system/)

---

## ✨ Key Features

### 1. 🔐 User Authentication (Login & Sign Up)
* **Dedicated Auth Portal & Modals**: Smooth tab-switching between Sign In and Sign Up.
* **Role Selection**: Register as a **Voluntary Blood Donor**, **Patient / Recipient**, or **Blood Bank Coordinator**.
* **1-Click Demo Logins**: Pre-populated credentials for instant testing.
* **Persistent Session**: Managed through both local session and backend database.

### 2. 🔍 Real-Time Donor Search & Directory
* Filter donors by **Blood Group** (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`) and **City/Area**.
* Instant availability badge (● Available / ○ On Rest).
* Direct click-to-call (`tel:`) and direct request dispatch.

### 3. 🚨 Emergency Blood Requests Board
* Instant broadcast of urgent patient requirements.
* Urgency indicators: **CRITICAL** (2-4 hours), **URGENT** (12 hours), and **STANDARD**.
* Includes hospital name, required units, clinical reason, and emergency contact details.

### 4. 🧬 Interactive Blood Compatibility Matrix
* Dynamic visual selector: click any of the 8 blood types to immediately highlight which groups they can **donate to** and **receive from**.
* Displays clinical roles (e.g., O- as Universal Red Cell Donor, AB+ as Universal Recipient).

### 5. 🪪 Member Dashboard & Printable Digital Donor Card
* Generates an official **Digital Donor ID Card** with member ID, blood group badge, and verified status.
* 1-click **Print / Save PDF** functionality for the donor card.
* Donor availability toggle switch to control emergency discoverability.
* Donation badges & clinical health score.

### 6. 🏕️ Community Blood Donation Camps
* Directory of upcoming health drives with dates, timings, venue, and organizer details.
* Live attendee registration counter.

### 7. 🩺 30-Second Clinical Eligibility Quiz
* Interactive medical assessment verifying age, weight, and clinical criteria.

---

## 🖥️ Server & Backend Architecture

The project features a **zero-dependency Python backend** (`server.py`) with a built-in **SQLite database** and REST APIs:

* **No external packages required** (runs directly on native Python 3).
* **Automatic Port Fallback**: Binds to `8080` (or `8000`, `8888`, `3000` if occupied).
* **Hybrid Client**: The frontend automatically uses the REST API when the server is running, and gracefully falls back to local storage if opened as a standalone static file!

### REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Server health check and timestamp |
| `GET` | `/api/donors` | Query donors with `bloodGroup`, `city`, and `available` filters |
| `POST` | `/api/auth/login` | Authenticate user credentials |
| `POST` | `/api/auth/signup` | Register new user and auto-add donor profile |
| `GET` | `/api/requests` | List active emergency blood requests |
| `POST` | `/api/requests` | Broadcast a new emergency request |
| `GET` | `/api/camps` | List upcoming blood donation drives |
| `POST` | `/api/camps/:id/register` | Register attendee for donation camp |
| `GET` | `/api/stats` | Blood inventory numbers and summary metrics |

---

## ⚡ How to Run

### Option 1: 1-Click Server (Recommended)
```bash
./start.sh
```
or run Python directly:
```bash
python3 server.py
```
Open your browser and navigate to: **`http://localhost:8080`**

### Option 2: Node.js Server
If you prefer Node.js:
```bash
node server.js
```
Open your browser at: **`http://localhost:3000`**

### Option 3: Direct Browser Launch
Simply double-click `index.html` in your file explorer to run the entire app offline in any modern browser!

---

## 🔑 Demo Login Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| 🩸 **Donor** | `arjun@example.com` | `password123` |
| 🏥 **Recipient / Hospital** | `priya@citycare.org` | `password123` |
| 🛡️ **Admin Coordinator** | `admin@lifeflow.org` | `admin123` |

*(You can also click the quick demo buttons on the Login page for 1-click auto login).*

---

## 🐙 How to Push to GitHub

Follow these steps in your terminal to publish this project to your GitHub account:

```bash
# 1. Initialize git repository
git init

# 2. Add all project files
git add .

# 3. Create your initial commit
git commit -m "feat: complete blood donation system with auth, dashboard, and server"

# 4. Set branch to main
git branch -M main

# 5. Link your GitHub repository
git remote add origin https://github.com/aryansingh98775-prog/blood-donation-system-.git

# 6. Push code to GitHub
git push -u origin main
```

> **Note**: Create an empty repository named `blood-donation-system` on [GitHub](https://github.com/new) prior to running `git push`.

---

## 📁 Project Structure

```
aryan project/
├── index.html          # Main landing page, donor finder, requests board, matrix
├── auth.html           # Login and Sign Up portal with demo accounts
├── dashboard.html      # Member dashboard and printable digital donor card
├── server.py           # Python 3 SQLite REST API and static file server
├── server.js           # Node.js server fallback
├── start.sh            # 1-click launcher script
├── package.json        # Node.js project metadata
├── .gitignore          # Git ignore rules
├── README.md           # Documentation
├── css/
│   └── style.css       # Responsive design system, CSS variables, dark accents
└── js/
    ├── app.js          # Core app controller, search, requests, camps, quiz
    ├── auth.js         # Authentication, session manager, API hybrid bridge
    └── data.js         # Initial mock database & compatibility data
```

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
