# 🗄️ CRM Backend

Backend repository for the **Customer Relationship Management (CRM)** system powering customer tracking, lead management, authentication, and dashboard analytics.

🔗 **GitHub Repo:** https://github.com/blackcat-007/crm-backend

---

## 🚀 Overview

This backend system handles all server-side operations for the CRM platform, including:

- 👥 Customer data management  
- 🎯 Lead tracking system  
- 🔐 Authentication & authorization  
- 📊 Dashboard analytics APIs  
- 🛠️ Admin & user role control  

It provides secure and scalable REST APIs consumed by the frontend.

---

## 🧰 Tech Stack

| Technology | Usage |
|------------|--------|
| 🟢 Node.js | Runtime Environment |
| 🚀 Express.js | Backend Framework |
| 🍃 MongoDB / Mongoose | Database |
| 🔐 JWT | Authentication |
| 🌐 REST API | Client–Server Communication |

---

## ✨ Features

### 📌 Dashboard APIs
- Business analytics data  
- Customer & lead statistics  
- Performance metrics  
- Role-based data filtering  

---

### 👥 Customer Management APIs
- ➕ Create customers  
- 📄 Get customer details  
- ✏️ Update customer data  
- ❌ Delete customers  
- 📜 Customer activity tracking  

---

### 🎯 Lead Management APIs
- 🆕 Create leads  
- 📊 Track lead progress  
- 🔄 Convert leads → customers  
- 📌 Sales pipeline tracking  

---

## 🔐 Authentication & Authorization

Secure access using **JWT (JSON Web Tokens)**.

Features include:

- 🔑 User login/signup  
- 🛡️ Token-based authentication  
- ⏳ Session validation  
- 🚫 Protected routes  

---

## 🧑‍💼 Role-Based Access Control

System supports **Admin** and **User** roles.

---

### 🛠️ Admin Control

Admins can:

- Manage all customers  
- Manage all leads  
- Access full analytics  
- Control user permissions  
- Perform delete/update operations  

---

### 👤 User Control

Users can:

- View assigned customers  
- Manage their leads  
- Update permitted records  
- Access limited analytics  

---

## 🧭 Project Structure

```
crm-backend/
│
├── src/
│ ├── controllers/ # Business logic
│ ├── models/ # Database schemas
│ ├── routes/ # API routes
│ ├── middleware/ # Auth & validations
│ └── utils/ # Helper functions
│
├── config/ # DB & server config
├── .env # Environment variables
└── server.js # Entry point
```

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/blackcat-007/crm-backend.git
cd crm-backend
npm install
```

### 3️⃣ Setup Environment Variables

Create .env file:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
### 4️⃣ Run Server
```
npm run dev
```

## 🔌 API Integration

 ### This backend provides APIs for:

- Authentication

- Customers

- Leads

- Dashboard analytics

<b>Frontend connects via:

NEXT_PUBLIC_API_URL=http://localhost:5000 </b>

📈 Future Enhancements

🔔 Real-time notifications (WebSockets)

 ## 📊 Advanced analytics engine

- 🧠 AI-based lead scoring

- 📝 Activity logging system

- 🔐 Multi-role hierarchy expansion

## 🤝 Contribution

Contributions are welcome!

 ### Steps to Contribute:

- 🍴 Fork the repository

- 🌿 Create a feature branch

- 💾 Commit your changes

- 🔁 Open a Pull Request

 ## 📄 License
```
This project is licensed under the MIT License.
```

## 👨‍💻 Author

Developed by blackcat-007
