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
git clone <repo_url>
cd gigflow
