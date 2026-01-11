# GigFlow – Mini Freelance Marketplace

GigFlow is a full-stack MERN application that allows users to post freelance jobs (Gigs) and apply to them via bids.  
Any user can act as a Client or a Freelancer.

---

## 🚀 Tech Stack

- Frontend: React (Vite), Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB + Mongoose
- Auth: JWT with HttpOnly Cookies
- State Management: Context API
- Real-Time: Socket.io

---

## ✨ Core Features

### Authentication
- Secure Register & Login
- JWT stored in HttpOnly cookies

### Gig Management
- Browse all open gigs
- Search gigs by title
- Create new gig postings

### Bidding System
- Freelancers can bid with price & message
- Clients can view all bids for their gigs

### Hiring Logic (Atomic)
- Client can hire one freelancer only
- Gig status changes to `assigned`
- Selected bid becomes `hired`
- All other bids are auto-rejected
- Implemented using MongoDB Transactions (race-condition safe)

### Real-Time Notification
- Freelancer receives instant notification on hiring

---

## 🔐 API Endpoints

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`

### Gigs
- GET `/api/gigs`
- POST `/api/gigs`

### Bids
- POST `/api/bids`
- GET `/api/bids/:gigId`
- PATCH `/api/bids/:bidId/hire`

---

## 🛠️ Setup Instructions

### 1. Clone Repository
```bash
git clone <https://github.com/Xabhi0811/GIGFLOW.git >
cd gigflow




2. Backend Setup
cd backend
npm install
cp .env.example .env
npm run dev

3. Frontend Setup
cd frontend
npm install
npm run dev


📡 Socket.io Setup


Socket automatically registers user on dashboard load


Hiring triggers real-time notification



📦 Deployment


Backend: Render / Railway


Frontend: Vercel / Netlify


MongoDB: Atlas



📹 Demo
A short Loom video demonstrating:


Posting a gig


Submitting bids


Hiring a freelancer


Real-time notification



👨‍💻 Author
Built as part of a Full Stack Internship Assignment.

---

# ✅ MODULE 8 STATUS: COMPLETE

### Your project is now:
✔ Fully documented  
✔ Easy to run  
✔ Easy to evaluate  
✔ Internship-ready  

---

# 🏁 FINAL OPTIONAL MODULE
### 🔹 MODULE 9: **Interview Talking Points + Common Questions**
(Helps you explain this project confidently in interviews)

If you want that, say **“Continue with Module 9”**.

Otherwise —  
🎉 **You now have a complete, professional, full-stack MERN project.**
