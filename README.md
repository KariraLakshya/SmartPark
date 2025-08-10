# 🚗 Parking Reservation System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![Status](https://img.shields.io/badge/status-Active-success)

> Full-stack web app to view and reserve parking slots in real time with an interactive map.

---

## 📌 Table of Contents

- [Features](#-features)  
- [Tech Stack](#-tech-stack)  
- [Project Structure](#-project-structure)  
- [Installation](#-installation)  
- [Environment Variables](#-environment-variables)  
- [Run Locally](#-run-locally)  
- [API Endpoints](#-api-endpoints)  
- [Example Requests](#-example-requests)  
- [Screenshots](#-screenshots)  
- [Future Improvements](#-future-improvements)  
- [Contributing](#-contributing)  
- [License](#-license)  
- [Author](#-author)

---

## ✨ Features

- Interactive map displaying parking locations and available slots  
- Real-time availability and booking to prevent double-booking  
- Reserve, view, and cancel reservations via UI or REST API  
- Responsive design (mobile + desktop)  
- MongoDB for persistent storage  
- Clear RESTful endpoints for integrations

---

## 🛠 Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js, Express  
- **Database:** MongoDB (Mongoose)  
- **Maps:** Leaflet
- **Env:** dotenv

---

## 📂 Project Structure

```
ParkingReservationSystem/
│
├── backend/
│   ├── server.js            # Express server entry
│   ├── app.js               # App middleware & routes
│   ├── routes/
│   ├── controllers/
│   ├── models/              # Mongoose schemas
│   └── utils/
│
├── frontend/
│   ├── index.html
│   ├── css/
│   └── js/
│
├── config/
│   └── db.js
├── docs/                    # images, demo gif, screenshots
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Installation

1. Clone the repository:
```bash
git clone https://github.com/KariraLakshya/SmartPark.git
cd ParkingReservationSystem
```

2. Install dependencies:
```bash
npm install
# or, if you use yarn:
# yarn
```

3. Create a `.env` file in the project root (see next section).

---

## 🔒 Environment Variables

Create `.env` with these variables (example values shown):

```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/parkingdb?retryWrites=true&w=majority
MAP_API_KEY=YOUR_MAP_API_KEY        # Google Maps or other provider
JWT_SECRET=your_jwt_secret         # if you add auth later
NODE_ENV=development
```

> Keep `.env` out of version control. Add `.env` to `.gitignore`.

---

## ▶️ Run Locally

Add scripts in `package.json` (example):
```json
"scripts": {
  "start": "node backend/server.js",
  "dev": "nodemon backend/server.js"
}
```

Start the app:
```bash
npm run dev
# or
npm start
```

Then open `http://localhost:5000` (or whatever PORT you set).

---

## 📡 API Endpoints

> Adjust paths to match your implementation.

**Locations & Slots**
- `GET /api/locations` — list all parking locations  
- `GET /api/locations/:id/slots` — get slots for a location

**Reservations**
- `POST /api/reservations` — create a reservation  
  - Body example: `{ "userId": "u123", "slotId": "s456", "from": "2025-08-12T08:00:00Z", "to": "2025-08-12T10:00:00Z" }`
- `GET /api/reservations/:id` — get reservation by id  
- `GET /api/users/:id/reservations` — reservations for a user  
- `DELETE /api/reservations/:id` — cancel reservation

---

## ⚙️ Example Requests (curl)

Create a reservation:
```bash
curl -X POST http://localhost:5000/api/reservations   -H "Content-Type: application/json"   -d '{
    "userId": "user123",
    "slotId": "slot456",
    "from": "2025-08-12T08:00:00Z",
    "to": "2025-08-12T10:00:00Z"
  }'
```

Get locations:
```bash
curl http://localhost:5000/api/locations
```

---

## 📸 Screenshots

Place images under `docs/` and reference them here:

| Booking page | Map view |
|--------------|----------|
| ![Booking](docs/booking.png) | ![Map](docs/maps.png) |

To add a screenshot/GIF:
1. Put file in `docs/` folder (create if not present).
2. Use relative path in the README (example above).

---

## 🚀 Future Improvements

- Add user authentication (JWT + profiles)  
- Integrate payment gateway (Stripe/PayPal) for paid parking  
- Real-time slot updates with WebSockets (socket.io)  
- Analytics/dashboard for usage and peak predictions  
- Mobile app or PWA for offline booking

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch: `git checkout -b feature/awesome`  
3. Commit changes: `git commit -m "feat: add awesome feature"`  
4. Push: `git push origin feature/awesome`  
5. Open a Pull Request

Please include clear descriptions and screenshots in PRs.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Lakshya Karira**  
- GitHub: https://github.com/KariraLakshya  
- Email: kariralakshya68@gmail.com
