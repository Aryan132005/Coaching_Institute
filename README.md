# Coaching Institute Management Portal - Apex Academy

A complete, production-ready full-stack website and administration management portal for a coaching institute. The project supports course listings, online student registration/admissions, campus notices/announcements, visitor enquiries, and role-based administration guards.

---

## ARCHITECTURE & TECH STACK

- **Frontend**: React (Vite) + Tailwind CSS + React Router + Lucide Icons + React Context API
- **Backend**: Node.js + Express.js + REST API architecture
- **Database**: MongoDB with Mongoose ODM (runs locally or via Atlas)
- **Fallback DB**: If no active MongoDB server is detected on start, the server automatically boots up using a lightweight JSON-file-based mock database. This guarantees the application works out-of-the-box!
- **Security**: bcryptjs password hashing + JWT tokens issued on login
- **Validations**: Frontend validation schemas + backend validation via `express-validator` middleware

---

## FOLDER STRUCTURE
```
coaching-institute/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # Navbar, Footer, Loader, Modal, Toast
│   │   ├── pages/           # Home, About, Contact, Courses, Admission, Login, StudentDashboard
│   │   ├── admin/           # AdminLogin, AdminDashboard, ManageCourses, ManageAdmissions
│   │   ├── context/         # AuthContext (state management, alerts)
│   │   ├── services/        # API calls (axios)
│   │   ├── App.jsx          # Routing and protected guards
│   │   └── index.css        # Tailwind styling & theme fonts
├── server/                  # Node/Express backend
│   ├── models/              # Mongoose/Mock Schemas
│   ├── controllers/         # Query controllers
│   ├── routes/              # Express API routers
│   ├── middleware/          # Auth security, validators, global error handlers
│   ├── config/              # Database connection, dynamic proxy & seeder script
│   ├── data/                # Fallback mock JSON database files
│   └── server.js            # Server entry point
├── docs/                    # Documentation
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   └── api_testing.http     # REST Client request suite
└── README.md
```

---

## SETUP & INSTALLATION

### Prerequisite
Ensure [Node.js](https://nodejs.org/) is installed on your computer.

### Step 1: Clone or Open Workspace
Open the project root directory in your IDE.

### Step 2: Configure Environment Variables
Inside the `server/` directory, copy `.env.example` to `.env`.
```bash
# In server/ folder
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/coaching-institute
JWT_SECRET=supersecretjwtkey12345
NODE_ENV=development
```
*(If MongoDB is not running, the database layer automatically routes queries to a local JSON filesystem database in `server/data/`).*

### Step 3: Set Up and Seed Backend
Open your terminal and navigate to the `server/` folder to install packages and populate initial seed data.
```bash
cd server
npm install
npm run seed
```
This seeds:
- **Admin**: `admin@coaching.com` / `admin123`
- **Student**: `student@coaching.com` / `student123`
- Multiple course programs, faculty profiles, notices, and test enquiries.

### Step 4: Set Up Frontend
Navigate to the `client/` folder and install dependencies:
```bash
cd ../client
npm install
```

---

## RUNNING THE WEB APPLICATION

### Start Express Server (Backend)
```bash
cd server
npm run dev
# Starts on http://localhost:5000
```

### Start Vite Server (Frontend)
```bash
cd client
npm run dev
# Starts on http://localhost:5173 (or next free port)
```

---

## FEATURES & BONUS IMPLEMENTATIONS

1. **Dark Mode Toggle**: Integrated theme switcher directly inside the main navigation bar. Remembers preference via `localStorage`.
2. **Adaptive DB Dynamic Proxy**: Detects active MongoDB connections on boot; automatically proxies all Mongoose models to JSON file store if database is offline.
3. **Counselor Resolution Log**: Allows administrators to view contact enquiries and toggle resolved status with dynamic visual cues.
4. **Admission Notification Hook**: Server logs triggers when administrators approve or reject registrations, illustrating Nodemailer email integrations.
