# Recommendation Tracker

**Pin the Mood & Never Forget a Recommendation Again!**

[Live Demo](https://recommendation-tracker.ui.hosting.codeyourfuture.io/) | [Backend API](https://recommendation-tracker.hosting.codeyourfuture.io/)


## About the Project

**Recommendation Tracker** is a full-stack web application designed to help users log, track, and filter recommendations (movies, books, TV shows, etc.) they receive from friends.

We often get recommendations but forget them by the time we are in the mood to watch or read something. This app solves that problem by allowing users to filter their collection based on **mood**, **category**, or **recommender**.

This project was built as part of the **CodeYourFuture** course by a team of 3 developers.

## Key Features

*   **User Authentication:** Secure Login, Signup, and Password Reset (via Email/AWS SES).
*   **Create & Manage:** Add new recommendations with title, category, recommender name, and moods.
*   **Image Upload:** Upload cover images for your recommendations.
*   **Smart Filtering:** Filter your list by:
    *   Mood (e.g., Upbeat, Thoughtful, Self-Improvement)
    *   Category (Movie, Book, TV Show, etc.)
    *   Recommender Name
*   **Responsive Design:** Works seamlessly on desktop and mobile devices.
*   **Persistent Storage:** Data is stored in a PostgreSQL database and images are saved securely.

## Tech Stack

**Frontend:**
* React (Vite)
* Tailwind CSS & DaisyUI (Styling)
* React Router (Navigation)
* Zod (Form Validation)

**Backend:**
* Node.js & Express
* Multer (Image Uploads)
* AWS SES (Email Service)
* JSON Web Token (JWT) & BCrypt (Security)
* Zod (API Request Validation) 

**Database:**

* PostgreSQL (Local Development)
* Neon DB (Production/Live)

**DevOps:**
* Docker & Coolify (Deployment)

## Project Structure
```
Recommendation-Tracker/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks (Auth, Recommendations)
│   │   ├── utils/          # Validation schemas
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
├── server/
│   ├── db/
│   │   ├── db.js           # Database connection
│   │   └── schema.sql      # Database schema
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── utils/              # Helper functions
│   ├── uploads/            # Uploaded images (persistent storage)
│   └── index.js
│
└── README.md
```

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites
*   Node.js (v18 or higher)
*   PostgreSQL installed and running locally

### 1. Clone the Repository
```bash
git clone https://github.com/PratiAmalden/Recommendation-Tracker.git
cd Recommendation-Tracker
```

### 2. Database Setup
Create a PostgreSQL database named `recommendations_db` and run the schema script.

```sql
CREATE DATABASE recommendations_db;
-- Run the contents of server/db/schema.sql to create tables
```

### 3. Backend Setup
Navigate to the server folder and install dependencies.

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=3000
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=recommendations_db
JWT_SECRET_KEY=your_secret_key
JWT_RESET_SECRET=your_reset_secret
FRONTEND_URL=http://localhost:5173
```

Start the server:
```bash
npm start
```

### 4. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies.

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## The Team

This project was built with by:

*   [**Fatma Arslantas**](https://github.com/AFatmaa) - Full Stack Developer
*   [**Prati Amalden**](https://github.com/PratiAmalden) - Full Stack Developer
*   [**Aung Ye Kyaw** ](https://github.com/sarawone)- Full Stack Developer
*   [**Yousof K.**](https://github.com/ykamal) - Tech Lead
*   [**Onder Altan**](https://github.com/onderaltan) - Product Manager

## License

This project is part of the CodeYourFuture Full Stack course.

