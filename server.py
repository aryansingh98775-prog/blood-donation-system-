#!/usr/bin/env python3
"""
LifeFlow Blood Donation System - Backend REST API & Static File Server
Zero external dependencies (uses standard library Python 3: http.server, sqlite3, json)
Runs seamlessly on any computer with Python 3 installed.
"""

import http.server
import socketserver
import json
import os
import sqlite3
import urllib.parse
from datetime import datetime

PORT = int(os.environ.get('PORT', 8080))
DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lifeflow.db')
WEB_DIR = os.path.dirname(os.path.abspath(__file__))

# ========================================================
# Database Initialization & Seeding
# ========================================================
def init_db():
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()

    # Users table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'donor',
            blood_group TEXT,
            city TEXT,
            phone TEXT,
            age INTEGER,
            gender TEXT,
            donations_count INTEGER DEFAULT 0,
            last_donated TEXT,
            available INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Donors table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS donors (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            blood_group TEXT NOT NULL,
            city TEXT NOT NULL,
            area TEXT,
            phone TEXT NOT NULL,
            email TEXT,
            age INTEGER,
            gender TEXT,
            donations INTEGER DEFAULT 0,
            last_donation TEXT,
            available INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Requests table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS blood_requests (
            id TEXT PRIMARY KEY,
            patient_name TEXT NOT NULL,
            blood_group TEXT NOT NULL,
            units INTEGER DEFAULT 1,
            hospital TEXT NOT NULL,
            city TEXT NOT NULL,
            urgency TEXT NOT NULL,
            contact_person TEXT NOT NULL,
            phone TEXT NOT NULL,
            reason TEXT,
            status TEXT DEFAULT 'open',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Camps table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS camps (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            organizer TEXT NOT NULL,
            camp_date TEXT NOT NULL,
            camp_time TEXT NOT NULL,
            venue TEXT NOT NULL,
            city TEXT NOT NULL,
            contact TEXT,
            registered_count INTEGER DEFAULT 0
        )
    ''')

    conn.commit()

    # Seed initial data if empty
    cur.execute('SELECT COUNT(*) FROM users')
    if cur.fetchone()[0] == 0:
        seed_data(cur, conn)

    conn.close()

def seed_data(cur, conn):
    users = [
        ("usr_1", "Arjun Shukla", "arjun@example.com", "password123", "donor", "O+", "New Delhi", "+91 98765 43210", 24, "Male", 3, "2026-08-10", 1),
        ("usr_2", "Dr. Priya Sharma", "priya@citycare.org", "password123", "recipient", "B+", "Mumbai", "+91 98111 22334", 32, "Female", 0, "Never", 1),
        ("usr_3", "Admin Officer", "admin@lifeflow.org", "admin123", "admin", "A+", "National HQ", "+91 99999 88888", 40, "Male", 5, "2026-05-12", 1)
    ]
    cur.executemany('''
        INSERT INTO users (id, name, email, password, role, blood_group, city, phone, age, gender, donations_count, last_donated, available)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', users)

    donors = [
        ("don_1", "Arjun Shukla", "O+", "New Delhi", "Connaught Place", "+91 98765 43210", "arjun@example.com", 24, "Male", 3, "2026-08-10", 1),
        ("don_2", "Rohan Varma", "A+", "New Delhi", "South Extension", "+91 97654 32109", "rohan.v@example.com", 29, "Male", 5, "2026-07-15", 1),
        ("don_3", "Ananya Iyer", "O-", "Bangalore", "Indiranagar", "+91 96543 21098", "ananya.iyer@example.com", 27, "Female", 2, "2026-09-01", 1),
        ("don_4", "Karan Malhotra", "B+", "Mumbai", "Andheri West", "+91 95432 10987", "karan.m@example.com", 31, "Male", 4, "2026-06-20", 1),
        ("don_5", "Sneha Patel", "AB+", "Ahmedabad", "Satellite", "+91 94321 09876", "sneha.p@example.com", 25, "Female", 1, "2026-09-12", 1),
        ("don_6", "Vikram Das", "B-", "Kolkata", "Salt Lake", "+91 93210 98765", "vikram.das@example.com", 35, "Male", 6, "2026-05-30", 1),
        ("don_7", "Meera Nair", "A-", "Chennai", "Adyar", "+91 92109 87654", "meera.nair@example.com", 28, "Female", 3, "2026-08-25", 0),
        ("don_8", "Tariq Khan", "AB-", "Hyderabad", "Banjara Hills", "+91 91098 76543", "tariq.khan@example.com", 33, "Male", 4, "2026-07-04", 1)
    ]
    cur.executemany('''
        INSERT INTO donors (id, name, blood_group, city, area, phone, email, age, gender, donations, last_donation, available)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', donors)

    requests = [
        ("req_1", "Rajesh Kumar", "O-", 2, "AIIMS Trauma Centre", "New Delhi", "critical", "Dr. Sunil Gupta", "+91 98123 45678", "Emergency surgical operation after road accident", "open"),
        ("req_2", "Baby Aarav (Pediatric)", "B+", 1, "Lilavati Hospital", "Mumbai", "urgent", "Kavita (Mother)", "+91 98234 56789", "Thalassemia transfusion required by evening", "open"),
        ("req_3", "Farida Begum", "AB-", 3, "Apollo Hospital", "Hyderabad", "critical", "Salman Beg", "+91 98345 67890", "Platelet & plasma needed for cardiac surgery", "open"),
        ("req_4", "Deepak Choudhury", "A+", 2, "Fortis Hospital", "Bangalore", "standard", "Ritu Choudhury", "+91 98456 78901", "Scheduled orthopaedic reconstruction", "fulfilled")
    ]
    cur.executemany('''
        INSERT INTO blood_requests (id, patient_name, blood_group, units, hospital, city, urgency, contact_person, phone, reason, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', requests)

    camps = [
        ("cmp_1", "City Youth Mega Blood Donation Drive", "Rotary Club & Red Cross Society", "2026-10-25", "09:00 AM - 05:00 PM", "Civic Centre Hall, Connaught Place", "New Delhi", "+91 98990 11223", 84),
        ("cmp_2", "Save Lives Marine Drive Health Camp", "Lions Club Blood Bank", "2026-10-28", "10:00 AM - 04:00 PM", "Bhartiya Vidya Bhavan, Chowpatty", "Mumbai", "+91 98770 22334", 112),
        ("cmp_3", "Techies for Life Corporate Blood Drive", "IT Park Health Forum", "2026-11-02", "09:30 AM - 04:30 PM", "Electronic City Gate 3 Convention Centre", "Bangalore", "+91 98660 33445", 65)
    ]
    cur.executemany('''
        INSERT INTO camps (id, title, organizer, camp_date, camp_time, venue, city, contact, registered_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', camps)

    conn.commit()


# ========================================================
# HTTP Request Handler
# ========================================================
class LifeFlowHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WEB_DIR, **kwargs)

    def _send_json(self, data, status_code=200):
        body = json.dumps(data).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # Health check
        if path == '/api/health':
            self._send_json({"status": "healthy", "service": "LifeFlow Blood Donation Server", "timestamp": datetime.now().isoformat()})
            return

        # Donors list
        if path == '/api/donors':
            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            sql = "SELECT id, name, blood_group, city, area, phone, email, age, gender, donations, last_donation, available FROM donors WHERE 1=1"
            params = []

            if 'bloodGroup' in query and query['bloodGroup'][0] != 'all':
                sql += " AND blood_group = ?"
                params.append(query['bloodGroup'][0])

            if 'city' in query and query['city'][0].strip():
                sql += " AND (LOWER(city) LIKE ? OR LOWER(area) LIKE ?)"
                city_val = f"%{query['city'][0].strip().lower()}%"
                params.extend([city_val, city_val])

            if 'available' in query and query['available'][0] == 'true':
                sql += " AND available = 1"

            sql += " ORDER BY created_at DESC"
            cur.execute(sql, params)
            rows = cur.fetchall()
            conn.close()

            donors = [
                {
                    "id": r[0], "name": r[1], "bloodGroup": r[2], "city": r[3], "area": r[4],
                    "phone": r[5], "email": r[6], "age": r[7], "gender": r[8],
                    "donations": r[9], "lastDonation": r[10], "available": bool(r[11])
                }
                for r in rows
            ]
            self._send_json({"success": True, "count": len(donors), "data": donors})
            return

        # Blood requests list
        if path == '/api/requests':
            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            cur.execute("SELECT id, patient_name, blood_group, units, hospital, city, urgency, contact_person, phone, reason, status, created_at FROM blood_requests ORDER BY created_at DESC")
            rows = cur.fetchall()
            conn.close()

            requests = [
                {
                    "id": r[0], "patientName": r[1], "bloodGroup": r[2], "units": r[3],
                    "hospital": r[4], "city": r[5], "urgency": r[6], "contactPerson": r[7],
                    "phone": r[8], "reason": r[9], "status": r[10], "postedAt": r[11]
                }
                for r in rows
            ]
            self._send_json({"success": True, "count": len(requests), "data": requests})
            return

        # Camps list
        if path == '/api/camps':
            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            cur.execute("SELECT id, title, organizer, camp_date, camp_time, venue, city, contact, registered_count FROM camps ORDER BY camp_date ASC")
            rows = cur.fetchall()
            conn.close()

            camps = [
                {
                    "id": r[0], "title": r[1], "organizer": r[2], "date": r[3],
                    "time": r[4], "venue": r[5], "city": r[6], "contact": r[7],
                    "registeredCount": r[8]
                }
                for r in rows
            ]
            self._send_json({"success": True, "count": len(camps), "data": camps})
            return

        # System stats
        if path == '/api/stats':
            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            cur.execute("SELECT COUNT(*) FROM donors")
            total_donors = cur.fetchone()[0]
            cur.execute("SELECT COUNT(*) FROM blood_requests WHERE status = 'open'")
            active_requests = cur.fetchone()[0]
            cur.execute("SELECT COUNT(*) FROM users")
            total_users = cur.fetchone()[0]
            conn.close()

            self._send_json({
                "success": True,
                "donors": total_donors,
                "activeRequests": active_requests,
                "users": total_users,
                "bloodInventory": {
                    "A+": 42, "O-": 4, "B+": 38, "AB-": 6,
                    "O+": 55, "A-": 14, "B-": 11, "AB+": 27
                }
            })
            return

        # Otherwise serve static files normally
        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(length) if length > 0 else b'{}'

        try:
            body = json.loads(post_data.decode('utf-8'))
        except Exception:
            body = {}

        # Login endpoint
        if path == '/api/auth/login':
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')

            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            cur.execute("SELECT id, name, email, role, blood_group, city, phone, age, gender, donations_count, last_donated, available, password FROM users WHERE LOWER(email) = ?", (email,))
            user = cur.fetchone()
            conn.close()

            if not user:
                self._send_json({"success": False, "message": "No account found with this email."}, 404)
                return

            if user[12] != password:
                self._send_json({"success": False, "message": "Incorrect password."}, 401)
                return

            user_obj = {
                "id": user[0], "name": user[1], "email": user[2], "role": user[3],
                "bloodGroup": user[4], "city": user[5], "phone": user[6],
                "age": user[7], "gender": user[8], "donationsCount": user[9],
                "lastDonated": user[10], "available": bool(user[11])
            }
            self._send_json({"success": True, "message": "Login successful", "user": user_obj})
            return

        # Signup endpoint
        if path == '/api/auth/signup':
            name = body.get('name', '').strip()
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')
            role = body.get('role', 'donor')
            blood_group = body.get('bloodGroup', 'O+')
            city = body.get('city', '')
            phone = body.get('phone', '')
            age = int(body.get('age', 24))

            if not email or not password or not name:
                self._send_json({"success": False, "message": "Missing required fields"}, 400)
                return

            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            cur.execute("SELECT COUNT(*) FROM users WHERE LOWER(email) = ?", (email,))
            if cur.fetchone()[0] > 0:
                conn.close()
                self._send_json({"success": False, "message": "Email already registered"}, 409)
                return

            new_id = f"usr_{int(datetime.now().timestamp() * 1000)}"
            cur.execute('''
                INSERT INTO users (id, name, email, password, role, blood_group, city, phone, age, gender, donations_count, last_donated, available)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'Never', 1)
            ''', (new_id, name, email, password, role, blood_group, city, phone, age, 'Not Specified'))

            # If donor, also add to donors table
            if role == 'donor':
                don_id = f"don_{int(datetime.now().timestamp() * 1000)}"
                cur.execute('''
                    INSERT INTO donors (id, name, blood_group, city, area, phone, email, age, gender, donations, last_donation, available)
                    VALUES (?, ?, ?, ?, 'Registered Member', ?, ?, ?, 'Not Specified', 0, 'Never', 1)
                ''', (don_id, name, blood_group, city, phone, email, age))

            conn.commit()
            conn.close()

            user_obj = {
                "id": new_id, "name": name, "email": email, "role": role,
                "bloodGroup": blood_group, "city": city, "phone": phone, "age": age,
                "donationsCount": 0, "lastDonated": "Never", "available": True
            }
            self._send_json({"success": True, "message": "Account created successfully", "user": user_obj}, 201)
            return

        # Add emergency request endpoint
        if path == '/api/requests':
            patient_name = body.get('patientName', '').strip()
            blood_group = body.get('bloodGroup', 'O+')
            units = int(body.get('units', 1))
            hospital = body.get('hospital', '').strip()
            city = body.get('city', '').strip()
            urgency = body.get('urgency', 'urgent')
            contact_person = body.get('contactPerson', '').strip()
            phone = body.get('phone', '').strip()
            reason = body.get('reason', 'Immediate clinical requirement')

            if not patient_name or not hospital or not phone:
                self._send_json({"success": False, "message": "Patient, hospital, and phone are required"}, 400)
                return

            req_id = f"req_{int(datetime.now().timestamp() * 1000)}"
            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            cur.execute('''
                INSERT INTO blood_requests (id, patient_name, blood_group, units, hospital, city, urgency, contact_person, phone, reason, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')
            ''', (req_id, patient_name, blood_group, units, hospital, city, urgency, contact_person, phone, reason))
            conn.commit()
            conn.close()

            self._send_json({"success": True, "message": "Emergency request registered", "id": req_id}, 201)
            return

        # Register for camp
        if path.startswith('/api/camps/') and path.endswith('/register'):
            camp_id = path.split('/')[3]
            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            cur.execute("UPDATE camps SET registered_count = registered_count + 1 WHERE id = ?", (camp_id,))
            conn.commit()
            conn.close()
            self._send_json({"success": True, "message": "Successfully registered for camp"})
            return

        self._send_json({"error": "Endpoint not found"}, 404)


# ========================================================
# Server Runner
# ========================================================
def run_server(initial_port=PORT):
    init_db()
    socketserver.TCPServer.allow_reuse_address = True
    
    ports_to_try = [initial_port, 8000, 8888, 3000, 5050]
    httpd = None
    active_port = initial_port

    for p in ports_to_try:
        try:
            httpd = socketserver.TCPServer(("", p), LifeFlowHandler)
            active_port = p
            break
        except OSError:
            continue

    if not httpd:
        print(f"  ❌ Error: Could not bind to any port in {ports_to_try}.")
        return

    with httpd:
        print("=" * 65)
        print("  🩸 LifeFlow Blood Donation System Server")
        print("=" * 65)
        print(f"  ➜ Local Web App:     http://localhost:{active_port}")
        print(f"  ➜ Network Access:    http://127.0.0.1:{active_port}")
        print(f"  ➜ Health Check API:  http://localhost:{active_port}/api/health")
        print(f"  ➜ Donors API:        http://localhost:{active_port}/api/donors")
        print(f"  ➜ Requests API:      http://localhost:{active_port}/api/requests")
        print(f"  ➜ Database File:     {DB_FILE}")
        print("=" * 65)
        print("  Server is active. Press Ctrl+C to terminate.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  Stopping LifeFlow Server gracefully...")
            httpd.server_close()

if __name__ == '__main__':
    run_server()
