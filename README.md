# DarshanEase – Smart Temple Darshan Ticket Booking Platform

DarshanEase is a modern, full-stack MERN application that provides devotees with a hassle-free, secure platform to explore temples, schedule darshan time slots, buy entry tickets, scan passes for entry gates, and contribute charitable donations.

---

## 🚀 Key Features

*   **Role-Based Security**: Devotees, Trustees (Organizers), and Administrators access personalized control dashboards protected by secure JWT authentication, refresh token rotations, and bcrypt credentials hashing.
*   **Dynamic Temple Directory**: Pilgrims filter shrines by State, District, and specific Special Darshan poojas.
*   **Time-Slot Grid Manager**: Visual slot scheduler showing remaining seat counts and ticket pricing.
*   **Simulated Checkout Gateway**: Multiple payment options (UPI, Credit Card, Wallets) mapping checkout results.
*   **QR-Enabled E-Tickets**: Offline SVG QR Code rendering and printable ticket summaries, complete with PDF-ready formatting.
*   **Entrance Verification Gate**: Temple organizers type or mock-scan booking IDs to verify entries and mark attendees.
*   **Donations Ledger**: Simple charitable contribution portals producing digital transaction receipts.
*   **Resiliency Fallback**: Hybrid database configuration. Attempts MongoDB connection first, but automatically falls back to local JSON-based file storage (`mockDbService.js`) if offline, making the application fully interactive out-of-the-box.

---

## 🛠️ Technology Stack

*   **Frontend**: React.js, React Router DOM, Axios, Context API, CSS Variables, React Icons, React Toastify.
*   **Backend**: Node.js, Express.js, JWT, bcryptjs, Multer, Helmet, Express Rate Limit, Express Validator.
*   **Database**: MongoDB + Mongoose (with simulated JSON-file fallback).

---

## 📂 Project Structure

```text
darshanease/
├── client/                  # React Frontend (Vite)
│   ├── src/
│   │   ├── assets/          # Static logos/logos
│   │   ├── components/      # Reusable UI elements (Skeleton, Ratings)
│   │   ├── context/         # AuthContext, ThemeContext
│   │   ├── layouts/         # Navbar, Sidebar, Footer components
│   │   ├── pages/           # Landing, Listing, Booking, Payment, Dashboards
│   │   ├── services/        # Axios API client
│   │   ├── styles/          # Global styles, variables
│   │   ├── main.jsx
│   │   └── App.jsx
│   └── package.json
└── server/                  # Node.js Express Backend
    ├── config/              # Mongoose DB connector
    ├── controllers/         # MVC Controllers (auth, booking, temple)
    ├── middleware/          # JWT auth, role validation, file upload
    ├── models/              # Unified database interfaces (User, Temple)
    ├── routes/              # Express API routers
    ├── services/            # QR, PDF layout and Mock DB services
    ├── uploads/             # Profile pictures, temple banners, mockDb JSON files
    ├── utils/               # Database Seeding script
    ├── server.js            # Express application boot entrypoint
    └── package.json
```

---

## ⚙️ Local Installation & Setup

Ensure you have [Node.js (v16+)](https://nodejs.org/) installed.

### 1. Server Configuration
1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure your environmental keys inside `.env` (refer to `.env.example`):
    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/darshanease
    JWT_SECRET=your_jwt_access_secret_key
    JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
    NODE_ENV=development
    ```
4.  Run the seeding script to populate default accounts, temples, and week-long slots:
    ```bash
    npm run seed
    ```
5.  Start the Express server:
    ```bash
    npm run start
    ```
    The server will listen at: `http://localhost:5000`

### 2. Client Configuration
1.  Navigate to the client directory:
    ```bash
    cd ../client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Launch the Vite React server:
    ```bash
    npm run dev
    ```
    The web page will boot at: `http://localhost:3000` (or `http://localhost:5173` if configured defaults)

---

## 🔑 Seeding Credentials

The seeding script registers three default accounts with the password `password123` (except admin and organizer who use specific passes):

| Role | Email | Password |
| :--- | :--- | :--- |
| **System Admin (ADMIN)** | `admin@darshanease.com` | `admin123` |
| **Trustee (ORGANIZER)** | `organizer@darshanease.com` | `org123` |
| **Devotee (USER)** | `devotee@darshanease.com` | `password123` |

---

## 🏛️ Seeded Shrines Directory

The seeder populates **27 famous temple destinations** across India:
1.  **Kedarnath Temple** (Rudraprayag, Uttarakhand)
2.  **Tirumala Venkateswara Temple** (Tirupati, Andhra Pradesh)
3.  **Golden Temple (Harmandir Sahib)** (Amritsar, Punjab)
4.  **Somnath Temple** (Veraval, Gujarat)
5.  **Kashi Vishwanath Temple** (Varanasi, Uttar Pradesh)
6.  **Vaishno Devi Temple** (Katra, Jammu and Kashmir)
7.  **Meenakshi Amman Temple** (Madurai, Tamil Nadu)
8.  **Jagannath Temple** (Puri, Odisha)
9.  **Siddhivinayak Temple** (Mumbai, Maharashtra)
10. **Badrinath Temple** (Chamoli, Uttarakhand)
11. **Brihadeeswara Temple** (Thanjavur, Tamil Nadu)
12. **Akshardham Temple** (East Delhi, Delhi)
13. **Konark Sun Temple** (Puri, Odisha)
14. **Padmanabhaswamy Temple** (Trivandrum, Kerala)
15. **Sabarimala Sastha Temple** (Pathanamthitta, Kerala)
16. **Ramanathaswamy Temple** (Ramanathapuram, Tamil Nadu)
17. **Kamakhya Temple** (Kamrup, Assam)
18. **Dwarkadhish Temple** (Devbhumi Dwarka, Gujarat)
19. **Mahakaleshwar Jyotirlinga** (Ujjain, Madhya Pradesh)
20. **Shirdi Sai Baba Temple** (Ahmednagar, Maharashtra)
21. **Amarnath Cave Temple** (Anantnag, Jammu and Kashmir)
22. **Murudeshwar Temple** (Uttara Kannada, Karnataka)
23. **Ranakpur Jain Temple** (Pali, Rajasthan)
24. **Yamunotri Temple** (Uttarkashi, Uttarakhand)
25. **Gangotri Temple** (Uttarkashi, Uttarakhand)
26. **Bhimashankar Jyotirlinga** (Pune, Maharashtra)
27. **Khajuraho Lakshmana Temple** (Chhatarpur, Madhya Pradesh)
