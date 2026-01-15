# Hotel Management System - Frontend

## Project Structure

```
frontend/
├── index.html          # Homepage
├── rooms.html          # Rooms listing page
├── bookings.html       # My bookings page
├── login.html          # Login page
├── register.html       # Registration page
├── css/
│   └── style.css       # Main stylesheet (Bootstrap + Tailwind + Custom)
├── js/
│   ├── app.js          # Core functionality & API calls
│   ├── auth.js         # Authentication logic
│   ├── rooms.js        # Rooms page logic
│   └── bookings.js     # Bookings page logic
└── assets/             # Images and other assets
```

## Features

### Pages
1. **Home (index.html)** - Landing page with features and CTAs
2. **Rooms (rooms.html)** - Browse and filter available rooms
3. **Bookings (bookings.html)** - View and manage your bookings
4. **Login (login.html)** - User login
5. **Register (register.html)** - New user registration

### Technologies
- **HTML5** - Semantic markup
- **CSS3** - Custom styling with Bootstrap and Tailwind CSS
- **JavaScript (ES6+)** - Modern JavaScript functionality
- **Bootstrap 5** - Responsive UI components
- **Tailwind CSS** - Utility-first CSS framework

### Features Included
- User authentication (login/register)
- Room browsing and filtering
- Booking management
- Payment processing
- Responsive design
- Modern UI with animations

## Setup & Usage

1. No build process required - just open HTML files in browser
2. Ensure backend API is running on `http://localhost:5000`
3. Update `API_URL` in `js/app.js` if using different backend URL

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
