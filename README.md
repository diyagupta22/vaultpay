# VaultPay Financial Core
A secure fintech backend API for user authentication, invoice management, Stripe payments, PDF receipts, and automated email notifications.
Yeh poora README copy-paste kar sakte ho. File README.md mein bhi save ho chuki hai.

# VaultPay Financial Core
A secure fintech backend API for user authentication, invoice management, Stripe payments, PDF receipts, and automated email notifications.
Built with **Node.js**, **Express**, **MongoDB**, **Stripe**, **PDFKit**, and **Nodemailer**.
---
## Features
- User registration and JWT authentication
- Role-based access control (`admin`, `client`)
- Invoice creation and secure listing (IDOR prevention)
- Stripe Checkout Session payments
- Stripe webhook handling
- PDF receipt generation
- Automated payment receipt emails
---
## Tech Stack
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | Web framework |
| MongoDB + Mongoose | Database |
| JWT + bcryptjs | Authentication |
| Stripe | Payments |
| PDFKit | PDF receipts |
| Nodemailer | Email delivery |
---
## Project Structure
VaultPayFinancialCore/ ├── server.js # Entry point ├── app.js # Express app & routes ├── .env.example # Environment variable template ├── src/ │ ├── config/ # DB & Stripe config │ ├── models/ # User & Invoice schemas │ ├── controllers/ # Request handlers │ ├── middleware/ # Auth & RBAC │ ├── routes/ # API routes │ └── services/ # PDF, email, receipt logic └── uploads/receipts/ # Generated PDF receipts

---
## Getting Started
### 1. Clone the repository
```bash
git clone <your-repo-url>
cd VaultPayFinancialCore
2. Install dependencies
npm install
3. Configure environment variables
Copy the example file:

cp .env.example .env
Update .env with your values:

PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CLIENT_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
EMAIL_FROM="Nexus Corporate Services <your_email@gmail.com>"
Never commit .env to GitHub.

4. Run the server
Development:

npm run dev
Production:

npm start
Server runs at: http://localhost:5000

API Endpoints
Health
Method	Endpoint	Access
GET
/
Public
Authentication
Method	Endpoint	Access
POST
/api/auth/register
Public
POST
/api/auth/login
Public
GET
/api/auth/profile
JWT
Dashboards
Method	Endpoint	Access
GET
/api/admin/dashboard
Admin
GET
/api/client/dashboard
Client
Invoices
Method	Endpoint	Access
GET
/api/invoices/clients
Admin
GET
/api/invoices
JWT (role-filtered)
POST
/api/invoices
Admin
GET
/api/invoices/:id
JWT (IDOR-safe)
Payments
Method	Endpoint	Access
POST
/api/payments/create-checkout-session/:invoiceId
JWT
Webhooks
Method	Endpoint	Access
POST
/api/webhooks/stripe
Stripe signature
Authentication
Protected routes require:

Authorization: Bearer <your_jwt_token>
Payment Flow
Client or admin creates a Stripe Checkout Session
User completes payment on Stripe
Stripe sends checkout.session.completed webhook
Invoice status updates to Paid
PDF receipt is generated
Receipt email is sent to the client
Stripe Webhook (Local Testing)
stripe listen --forward-to localhost:5000/api/webhooks/stripe
Copy the whsec_... secret into .env as STRIPE_WEBHOOK_SECRET.

Deploy on Render
Build Command
npm install
Start Command
npm start
Environment Variables
Add all variables from .env.example in the Render dashboard.

Stripe Webhook URL (Production)
https://your-app-name.onrender.com/api/webhooks/stripe
Security
Passwords hashed with bcrypt
JWT-based authentication
Role-based access control
IDOR prevention on invoice routes
Stripe webhook signature verification
Secrets stored in environment variables only
Scripts
Command	Description
npm run dev
Start with nodemon
npm start
Start production server
License
ISC

GitHub pe push karne se pehle `<your-repo-url>` aur `your-app-name` apne actual values se replace kar lena.
