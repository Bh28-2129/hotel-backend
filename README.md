# Hotel Management System

A full-stack hotel management application built with Node.js, Express.js, MongoDB, HTML, CSS, JavaScript, Bootstrap, and Tailwind CSS.

## 📋 Project Structure

```
hotel/
├── backend/                 # Node.js/Express backend
│   ├── app.js              # Main application file
│   ├── package.json        # Dependencies
│   ├── .env                # Environment variables
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── models/             # MongoDB schemas
│   │   ├── User.js
│   │   ├── Room.js
│   │   ├── Booking.js
│   │   └── Payment.js
│   ├── routes/             # API endpoints
│   │   ├── auth.js
│   │   ├── rooms.js
│   │   ├── bookings.js
│   │   └── payments.js
│   ├── middleware/
│   │   └── auth.js         # Authentication middleware
│   └── README.md
│
└── frontend/               # Frontend application
    ├── index.html          # Homepage
    ├── rooms.html          # Rooms page
    ├── bookings.html       # Bookings page
    ├── login.html          # Login page
    ├── register.html       # Registration page
    ├── css/
    │   └── style.css       # Styling with Bootstrap + Tailwind
    ├── js/
    │   ├── app.js          # Core JavaScript
    │   ├── auth.js         # Authentication logic
    │   ├── rooms.js        # Rooms functionality
    │   └── bookings.js     # Bookings functionality
    ├── assets/             # Images and assets
    └── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hotel_management
   JWT_SECRET=your_secret_key_here_change_in_production
   NODE_ENV=development
   ```

4. **Start MongoDB:**
   ```bash
   mongod
   ```

5. **Run the server:**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Open in browser:**
   - Simply open any HTML file in your web browser
   - Or use a local server (e.g., Live Server extension in VS Code)

   The frontend will communicate with the backend API at `http://localhost:5000/api`

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get single room
- `POST /api/rooms` - Create room (Admin/Manager)
- `PUT /api/rooms/:id` - Update room (Admin/Manager)
- `DELETE /api/rooms/:id` - Delete room (Admin)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking status (Admin/Manager)
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Payments
- `GET /api/payments` - Get payments
- `POST /api/payments` - Process payment

## 🏗️ Architecture

### Backend
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **CORS:** Enabled for frontend communication

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Bootstrap 5 + Tailwind CSS
- **JavaScript (ES6+)** - Vanilla JS for interactivity
- **Responsive Design** - Mobile-first approach

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Role-based access control (Admin, Manager, Staff, Guest)
- CORS protection
- Input validation

## 👥 User Roles

- **Admin** - Full access to all features
- **Manager** - Can manage rooms and bookings
- **Staff** - Limited access to room and booking information
- **Guest** - Can browse rooms and make bookings

## 📝 Sample Data

The system includes models for:
- **Users** - Guests and staff members
- **Rooms** - Hotel rooms with pricing and amenities
- **Bookings** - Room reservations with dates and pricing
- **Payments** - Payment transactions

## 🎨 UI Features

- Modern, responsive design
- Bootstrap 5 components
- Tailwind CSS utilities
- Custom animations and hover effects
- Mobile-friendly navigation
- Status badges for bookings
- Form validation
- Toast notifications

## 🔄 Workflow

1. **User Registration/Login** - Create account or sign in
2. **Browse Rooms** - View available rooms with filters
3. **Make Booking** - Select room and dates
4. **Process Payment** - Complete payment for booking
5. **View Bookings** - Track booking status
6. **Manage Booking** - Cancel or modify booking if allowed

## 🚀 Deployment

### Backend (Node.js)
- Deploy to Heroku, AWS, or other cloud platforms
- Update `MONGODB_URI` for production database
- Change `JWT_SECRET` to strong random string
- Set `NODE_ENV=production`

### Frontend
- Deploy to Netlify, Vercel, or any static hosting
- Update `API_URL` in `js/app.js` to production API URL

## 📦 Dependencies

### Backend
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `dotenv` - Environment variables
- `cors` - CORS middleware
- `body-parser` - Request body parsing

### Frontend
- Bootstrap 5 (CDN)
- Tailwind CSS (CDN)
- Vanilla JavaScript

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify connection string format

### API Not Responding
- Check if backend server is running on port 5000
- Verify `API_URL` in `js/app.js`
- Check CORS configuration

### CORS Errors
- Ensure CORS is enabled in `app.js`
- Verify frontend origin is allowed

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Development Notes

- Use nodemon for auto-restart during development
- Test API endpoints with Postman
- Use browser DevTools for frontend debugging
- Keep `JWT_SECRET` secure in production

---

**Happy Coding! 🎉**
