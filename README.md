# Personal Finance Tracker (MERN Stack)

A comprehensive **Personal Finance Tracker** built with the **MERN Stack** (MongoDB, Express, React, Node.js) to help users manage their income and expenses with detailed analytics and insights. This project includes secure authentication, data visualization, and is designed to be fully functional in a production environment.

---

## Features

### **User Features:**

#### **Authentication:**

* User registration with email verification.
* Secure login/logout using **JWT** (JSON Web Tokens).
* Protected routes for authenticated users only.
* Password validation and secure storage.

#### **Income & Expense Management:**

* Add, edit, and delete income/expense transactions.
* Manage categories for transactions.
* View transaction history with sorting and filtering options.

#### **Analytics & Reporting:**

* Monthly income/expense summaries.
* Category-based spending breakdowns.
* Filter data by custom date ranges.

#### **Security & Privacy:**

* Users can only access their own financial data.
* Input validation and data protection against unauthorized access.

---

## Tech Stack

* **Frontend**: React.js, Context API/Redux (State management), React Router, Chart.js for data visualization
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (using MongoDB Atlas for cloud database)
* **Authentication**: JWT (JSON Web Tokens)
* **Security**: bcrypt for password hashing

---

## Deployment:

* **Backend**: Heroku
* **Frontend**: Netlify

---

## Prerequisites

Ensure you have the following installed before starting:

* **Node.js** (LTS version)
* **MongoDB Atlas** account (for database)
* **Git**
* **Heroku CLI** (if deploying on Heroku)

---

## Setup Instructions

### 1. Clone the Repository:

```bash
git clone https://github.com/yourusername/personal-finance-tracker-mern.git
cd personal-finance-tracker-mern
```

### 2. Install Dependencies:

**Backend**: Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

**Frontend**: Navigate to the frontend folder and install dependencies:

```bash
cd frontend
npm install
```

### 3. Set Environment Variables:

Create a `.env` file in the **backend** folder and add the following variables:

```ini
MONGO_URI=your-mongo-db-uri
JWT_SECRET=your-jwt-secret
PORT=5000
```

You can get your **MongoDB URI** from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### 4. Start the Project Locally:

**Backend:**

```bash
cd backend
npm start
```

The backend will run at `http://localhost:5000`.

**Frontend:**

```bash
cd frontend
npm start
```

The frontend will run at `http://localhost:5173`.

### 5. Optional: Run Seed Script for Demo Data:

To populate the database with demo data (for testing), run the following script in the backend:

```bash
node seed.js
```

---

## API Endpoints

### **Authentication Routes:**

* **POST** `/api/auth/register`: Register a new user.
* **POST** `/api/auth/login`: Log in and get a JWT token.

### **Transaction Routes:**

* **GET** `/api/transactions`: Get all transactions for the authenticated user.
* **POST** `/api/transactions`: Create a new transaction.
* **PUT** `/api/transactions/:id`: Edit an existing transaction.
* **DELETE** `/api/transactions/:id`: Delete a transaction.

### **Category Routes:**

* **GET** `/api/categories`: Get all categories for the authenticated user.
* **POST** `/api/categories`: Create a new category.
* **PUT** `/api/categories/:id`: Update a category.
* **DELETE** `/api/categories/:id`: Delete a category.

---

## Deployment

### 1. **Backend Deployment (Heroku):**

To deploy the backend on Heroku:

* Create a Heroku app:

```bash
heroku create your-app-name
```

* Push your code to Heroku:

```bash
git push heroku master
```

* Set your environment variables in the Heroku dashboard.

The backend will be available at: `https://your-app-name.herokuapp.com`.

### 2. **Frontend Deployment (Netlify):**

To deploy the frontend on Netlify:

* Create a Netlify account and log in.
* Link your GitHub repository to Netlify and choose the frontend folder for deployment.

Netlify will handle the deployment process and provide a live URL.

The frontend will be available at: `https://your-react-app-name.netlify.app`.

---

## Sample Data (Seed Script)

The **seed.js** script allows you to populate your database with some initial data for testing. Run it after setting up the backend:

```bash
node seed.js
```

This will populate the database with some sample categories and transactions, so you can test the functionality right away.

---

## Contributing

Feel free to open issues and submit pull requests. Contributions are welcome!

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### Notes:

* Replace placeholders like `yourusername` and `your-react-app-name` with your actual details.
* The **Seed Script** is optional but very useful for testing.

