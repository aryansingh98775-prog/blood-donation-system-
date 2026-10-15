// ==========================================
// LifeFlow Blood Donation System - Initial Data Store
// ==========================================

const DEFAULT_USERS = [
  {
    id: "usr_1",
    name: "Arjun Shukla",
    email: "arjun@example.com",
    password: "password123",
    role: "donor",
    bloodGroup: "O+",
    phone: "+91 98765 43210",
    city: "New Delhi",
    age: 24,
    gender: "Male",
    donationsCount: 3,
    lastDonated: "2026-08-10",
    available: true,
    verified: true
  },
  {
    id: "usr_2",
    name: "Dr. Priya Sharma",
    email: "priya@citycare.org",
    password: "password123",
    role: "recipient",
    bloodGroup: "B+",
    phone: "+91 98111 22334",
    city: "Mumbai",
    hospital: "City Care Hospital",
    verified: true
  },
  {
    id: "usr_3",
    name: "Admin Officer",
    email: "admin@lifeflow.org",
    password: "admin123",
    role: "admin",
    bloodGroup: "A+",
    phone: "+91 99999 88888",
    city: "National HQ",
    verified: true
  }
];

const DEFAULT_DONORS = [
  {
    id: "don_1",
    name: "Arjun Shukla",
    bloodGroup: "O+",
    city: "New Delhi",
    area: "Connaught Place",
    phone: "+91 98765 43210",
    email: "arjun@example.com",
    age: 24,
    gender: "Male",
    donations: 3,
    lastDonation: "2026-08-10",
    available: true,
    verified: true
  },
  {
    id: "don_2",
    name: "Rohan Varma",
    bloodGroup: "A+",
    city: "New Delhi",
    area: "South Extension",
    phone: "+91 97654 32109",
    email: "rohan.v@example.com",
    age: 29,
    gender: "Male",
    donations: 5,
    lastDonation: "2026-07-15",
    available: true,
    verified: true
  },
  {
    id: "don_3",
    name: "Ananya Iyer",
    bloodGroup: "O-",
    city: "Bangalore",
    area: "Indiranagar",
    phone: "+91 96543 21098",
    email: "ananya.iyer@example.com",
    age: 27,
    gender: "Female",
    donations: 2,
    lastDonation: "2026-09-01",
    available: true,
    verified: true
  },
  {
    id: "don_4",
    name: "Karan Malhotra",
    bloodGroup: "B+",
    city: "Mumbai",
    area: "Andheri West",
    phone: "+91 95432 10987",
    email: "karan.m@example.com",
    age: 31,
    gender: "Male",
    donations: 4,
    lastDonation: "2026-06-20",
    available: true,
    verified: true
  },
  {
    id: "don_5",
    name: "Sneha Patel",
    bloodGroup: "AB+",
    city: "Ahmedabad",
    area: "Satellite",
    phone: "+91 94321 09876",
    email: "sneha.p@example.com",
    age: 25,
    gender: "Female",
    donations: 1,
    lastDonation: "2026-09-12",
    available: true,
    verified: true
  },
  {
    id: "don_6",
    name: "Vikram Das",
    bloodGroup: "B-",
    city: "Kolkata",
    area: "Salt Lake",
    phone: "+91 93210 98765",
    email: "vikram.das@example.com",
    age: 35,
    gender: "Male",
    donations: 6,
    lastDonation: "2026-05-30",
    available: true,
    verified: true
  },
  {
    id: "don_7",
    name: "Meera Nair",
    bloodGroup: "A-",
    city: "Chennai",
    area: "Adyar",
    phone: "+91 92109 87654",
    email: "meera.nair@example.com",
    age: 28,
    gender: "Female",
    donations: 3,
    lastDonation: "2026-08-25",
    available: false,
    verified: true
  },
  {
    id: "don_8",
    name: "Tariq Khan",
    bloodGroup: "AB-",
    city: "Hyderabad",
    area: "Banjara Hills",
    phone: "+91 91098 76543",
    email: "tariq.khan@example.com",
    age: 33,
    gender: "Male",
    donations: 4,
    lastDonation: "2026-07-04",
    available: true,
    verified: true
  }
];

const DEFAULT_REQUESTS = [
  {
    id: "req_1",
    patientName: "Rajesh Kumar",
    bloodGroup: "O-",
    units: 2,
    hospital: "AIIMS Trauma Centre",
    city: "New Delhi",
    urgency: "critical", // critical, urgent, standard
    contactPerson: "Dr. Sunil Gupta",
    phone: "+91 98123 45678",
    reason: "Emergency surgical operation after road accident",
    status: "open",
    postedAt: "15 mins ago"
  },
  {
    id: "req_2",
    patientName: "Baby Aarav (Pediatric)",
    bloodGroup: "B+",
    units: 1,
    hospital: "Lilavati Hospital",
    city: "Mumbai",
    urgency: "urgent",
    contactPerson: "Kavita (Mother)",
    phone: "+91 98234 56789",
    reason: "Thalassemia transfusion required by evening",
    status: "open",
    postedAt: "45 mins ago"
  },
  {
    id: "req_3",
    patientName: "Farida Begum",
    bloodGroup: "AB-",
    units: 3,
    hospital: "Apollo Hospital",
    city: "Hyderabad",
    urgency: "critical",
    contactPerson: "Salman Beg",
    phone: "+91 98345 67890",
    reason: "Platelet & plasma needed for cardiac surgery",
    status: "open",
    postedAt: "2 hours ago"
  },
  {
    id: "req_4",
    patientName: "Deepak Choudhury",
    bloodGroup: "A+",
    units: 2,
    hospital: "Fortis Hospital",
    city: "Bangalore",
    urgency: "standard",
    contactPerson: "Ritu Choudhury",
    phone: "+91 98456 78901",
    reason: "Scheduled orthopaedic reconstruction",
    status: "fulfilled",
    postedAt: "5 hours ago"
  }
];

const DEFAULT_CAMPS = [
  {
    id: "cmp_1",
    title: "City Youth Mega Blood Donation Drive",
    organizer: "Rotary Club & Red Cross Society",
    date: "2026-10-25",
    time: "09:00 AM - 05:00 PM",
    venue: "Civic Centre Hall, Connaught Place",
    city: "New Delhi",
    contact: "+91 98990 11223",
    registeredCount: 84
  },
  {
    id: "cmp_2",
    title: "Save Lives Marine Drive Health Camp",
    organizer: "Lions Club Blood Bank",
    date: "2026-10-28",
    time: "10:00 AM - 04:00 PM",
    venue: "Bhartiya Vidya Bhavan, Chowpatty",
    city: "Mumbai",
    contact: "+91 98770 22334",
    registeredCount: 112
  },
  {
    id: "cmp_3",
    title: "Techies for Life Corporate Blood Drive",
    organizer: "IT Park Health Forum",
    date: "2026-11-02",
    time: "09:30 AM - 04:30 PM",
    venue: "Electronic City Gate 3 Convention Centre",
    city: "Bangalore",
    contact: "+91 98660 33445",
    registeredCount: 65
  }
];

const COMPATIBILITY_DATA = {
  "O-": {
    canGiveTo: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    canReceiveFrom: ["O-"],
    badge: "Universal Red Cell Donor",
    summary: "O- can be safely given to ANY blood group in emergencies!"
  },
  "O+": {
    canGiveTo: ["O+", "A+", "B+", "AB+"],
    canReceiveFrom: ["O+", "O-"],
    badge: "Most Common Blood Type",
    summary: "High demand. Needed by roughly 38% of population."
  },
  "A-": {
    canGiveTo: ["A-", "A+", "AB-", "AB+"],
    canReceiveFrom: ["A-", "O-"],
    badge: "Rare Negative Group",
    summary: "Can donate red cells to both A and AB types."
  },
  "A+": {
    canGiveTo: ["A+", "AB+"],
    canReceiveFrom: ["A+", "A-", "O+", "O-"],
    badge: "High Demand",
    summary: "Can receive red blood cells from 4 different groups."
  },
  "B-": {
    canGiveTo: ["B-", "B+", "AB-", "AB+"],
    canReceiveFrom: ["B-", "O-"],
    badge: "Rare Group",
    summary: "Critical for B- and AB- patients."
  },
  "B+": {
    canGiveTo: ["B+", "AB+"],
    canReceiveFrom: ["B+", "B-", "O+", "O-"],
    badge: "Common Group",
    summary: "Widely needed across Asian and global populations."
  },
  "AB-": {
    canGiveTo: ["AB-", "AB+"],
    canReceiveFrom: ["AB-", "A-", "B-", "O-"],
    badge: "Rarest Blood Type (<1%)",
    summary: "Universal plasma donor for negative blood types."
  },
  "AB+": {
    canGiveTo: ["AB+"],
    canReceiveFrom: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    badge: "Universal Red Cell Recipient",
    summary: "Can safely receive blood from ALL blood groups!"
  }
};

// Storage helper functions
function initializeData() {
  if (!localStorage.getItem("lifeflow_users")) {
    localStorage.setItem("lifeflow_users", JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem("lifeflow_donors")) {
    localStorage.setItem("lifeflow_donors", JSON.stringify(DEFAULT_DONORS));
  }
  if (!localStorage.getItem("lifeflow_requests")) {
    localStorage.setItem("lifeflow_requests", JSON.stringify(DEFAULT_REQUESTS));
  }
  if (!localStorage.getItem("lifeflow_camps")) {
    localStorage.setItem("lifeflow_camps", JSON.stringify(DEFAULT_CAMPS));
  }
}

initializeData();
