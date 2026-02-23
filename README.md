# 👗 Trendora – Fashion Store Web Backend API

Trendora is a RESTful backend API developed to manage an online fashion store system.
The project provides secure authentication, admin-based user management, customer profile handling, and image upload functionality. Built using Node.js, Express, TypeScript, and MongoDB, the system follows REST architecture to ensure scalability and seamless integration with web or mobile applications.

---

## 🛠 Tech Stack

* Runtime: Node.js
* Framework: Express.js
* Language: TypeScript
* Database: MongoDB (Mongoose)
* Authentication: JWT (JSON Web Tokens)
* Testing: Jest + Supertest
* File Upload: Multer
* Email Service: Nodemailer (Gmail)

---

## 📦 Installation

### 1️⃣ Clone the Repository

git clone https://github.com/srijal0/fashion-store-web-backend.git
cd fashion-store-web-backend

### 2️⃣ Install Dependencies

npm install

### 3️⃣ Create a `.env` File in the Root Directory

PORT=5000
MONGODB_URI=mongodb://localhost:27017/fashion_store
JWT_SECRET=my_secret_key
EMAIL_USER=[your_email@gmail.com](mailto:your_email@gmail.com)
EMAIL_PASSWORD=your_email_app_password
CLIENT_URL=http://localhost:3000

### 4️⃣ Run the Development Server

npm run dev

The server will start at:
http://localhost:5000

---

## 🔐 Features

* User Registration & Login with JWT Authentication
* Role-Based Access Control (Admin & Customers)
* Admin User Management (Create, Update, Delete Users)
* Customer Profile Management
* Image Upload System using Multer
* Email Notifications via Nodemailer
* RESTful API Design for Frontend Integration
* Unit & Integration Testing with Jest & Supertest

---

## 🧪 Running Tests

npm test

To run tests with coverage:
npm test -- --coverage

---

## 📁 Project Structure

src/
├── config/
├── controllers/
├── database/
├── dtos/
├── middleware/
├── models/
├── repository/
├── routes/
├── service/
└── **tests**/

---

## 📚 Project Purpose

This project was developed as part of academic coursework to demonstrate backend API development for a real-world fashion store system, focusing on secure authentication, database integration, and scalable RESTful architecture.
