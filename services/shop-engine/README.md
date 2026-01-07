# QuickBuy – Node.js E-commerce

A simple, full-stack e-commerce demo built with Node.js, Express, MongoDB and EJS templates.

### 🔧 Tech Stack
- **Backend:** Node.js, Express, Mongoose (MongoDB)  
- **Auth:** Passport.js (local strategy)  
- **Templating:** EJS  
- **Sessions:** express-session + connect-mongo  
- **Styling & UI:** Bootstrap 4  
- **Forms & Validation:** express-validator + CSRF protection  

### 🚀 Features
1. **Product Listings**  
   - CRUD via a minimal admin (removed from prod)  
   - Browse by category  
2. **Shopping Cart**  
   - Add / remove items in session or per-user in DB  
3. **User Accounts**  
   - Registration & Login (with validation & flash messages)  
   - Persists cart across sessions  
4. **Order Processing**  
   - “Cash on delivery” checkout  
   - Stores orders in MongoDB  
   - Order history in user profile  

### 🔥 Quick Start

1. **Clone & Install**

   ```bash
   git clone https://github.com/YOUR_USERNAME/quickbuy.git
   cd quickbuy
   npm install
