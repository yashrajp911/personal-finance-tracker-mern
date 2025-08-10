# Personal Finance Tracker (MERN Stack)

A comprehensive **Personal Finance Tracker** built with the **MERN Stack** (MongoDB, Express, React, Node.js) to help users manage their income and expenses with detailed analytics and insights. This project includes secure authentication, data visualization, and is designed to be fully functional in a production environment.

---

## 🚀 Live Demo

- **Frontend**: [https://personal-finance-tracker-mern.vercel.app/](https://personal-finance-tracker-mern.vercel.app/)
- **Backend**: [https://personal-finance-tracker-backend-rss2.onrender.com](https://personal-finance-tracker-backend-rss2.onrender.com)

---

## ✅ Features

### **Authentication**
- User registration with email verification
- Secure login/logout using **JWT**
- Protected routes for authenticated users
- Password validation and hashing with **bcrypt**

### **Income & Expense Management**
- Add, edit, and delete income/expense transactions
- Create, edit, and manage custom categories
- View full transaction history with filtering & sorting

### **Analytics & Reporting**
- Monthly income/expense summaries
- Category-based spending visualizations (via **Chart.js**)
- Filter transactions by custom date ranges

### **Security**
- Input validation to prevent unauthorized access
- User-specific data isolation — users can only access their own data

---

## 🧰 Tech Stack

| Layer     | Tech Used |
|-----------|-----------|
| Frontend  | React (Vite), Context API, React Router, Chart.js |
| Backend   | Node.js, Express.js |
| Database  | MongoDB Atlas |
| Auth      | JWT, bcrypt |
| Deployment| Render (backend), Vercel (frontend) |

---

## 📁 Folder Structure

```

personal-finance-tracker-mern/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── seed.js
├── frontend/
│   ├── src/
│   └── .env
├── docker-compose.yml
├── README.md

````

---

## ⚙️ Environment Variables

### Backend (`/backend/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
CLIENT_URL=http://localhost:5173
````

### Frontend (`/frontend/.env`)

```env
REACT_APP_BACKEND_URL=https://personal-finance-tracker-backend-rss2.onrender.com
```

---

## 🧪 Sample Users (For Demo)

Use the following test accounts or register your own.

| Email                                             | Password   | Notes                |
| ------------------------------------------------- | ---------- | -------------------- |
| [testuser1@gmail.com](mailto:testuser1@gmail.com) | Test\@1234 | General test account |
| [testuser2@gmail.com](mailto:testuser2@gmail.com) | Test\@5678 | Alternate profile    |

You can register new accounts via the frontend as well.

---

## 🏁 Getting Started Locally

### 1. Clone the Repository

```bash
git clone https://github.com/yashrajp911/personal-finance-tracker-mern.git
cd personal-finance-tracker-mern
```

### 2. Install Dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure Environment Variables

Create `.env` files in both `backend/` and `frontend/` as shown above.

### 4. Start the Application Locally

#### Backend

```bash
cd backend
npm start
```

#### Frontend

```bash
cd frontend
npm run dev
```

* Frontend runs at: `http://localhost:5173`
* Backend runs at: `http://localhost:5000`

---

## 🌱 Seed Script (Demo Data)

To populate the database with test data:

```bash
cd backend
node seed.js
```

This adds:

* Common categories (e.g., Food, Transport, Salary)
* Sample income and expense transactions
* Associated with sample users (or the one currently logged in)

---

## 🔌 API Endpoints (Backend)

### **Authentication**

* `POST /api/auth/register` — Register user
* `POST /api/auth/login` — Login and receive JWT

### **Transactions**

* `GET /api/transactions` — List all user transactions
* `POST /api/transactions` — Create new transaction
* `PUT /api/transactions/:id` — Update transaction
* `DELETE /api/transactions/:id` — Delete transaction

### **Categories**

* `GET /api/categories` — List user’s categories
* `POST /api/categories` — Create category
* `PUT /api/categories/:id` — Update category
* `DELETE /api/categories/:id` — Delete category

All routes require a valid token (JWT) in headers unless otherwise noted.

---

## 🐳 Docker Support

Docker is supported for local backend development.

### Files Included:

* `backend/Dockerfile`
* `frontend/Dockerfile` *(optional, not used in compose)*
* `docker-compose.yml`

### Run Backend + MongoDB

```bash
docker-compose up --build
```

* MongoDB runs on port `27017`
* Backend runs on port `5000`

> Frontend not included in Compose — run it separately using `npm run dev` or deploy via Vercel.

---

## ☁️ Deployment

### Backend (Render)

* URL: [https://personal-finance-tracker-backend-rss2.onrender.com](https://personal-finance-tracker-backend-rss2.onrender.com)
* Auto-deploys from GitHub
* Environment variables managed via Render dashboard

### Frontend (Vercel)

* URL: [https://personal-finance-tracker-frontend-flax.vercel.app/](https://personal-finance-tracker-frontend-flax.vercel.app/)
* Vercel handles CI/CD from GitHub repo
* `.env` set via Vercel dashboard

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repo and submit a pull request with improvements.

---
