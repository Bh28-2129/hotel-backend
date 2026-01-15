# Hotel Management API

## Installation

```bash
cd backend
npm install
```

## Configuration

Create a `.env` file with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotel_management
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

## Running the Server

```bash
npm run dev
```

## API Endpoints

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
- `GET /api/bookings` - Get bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking (Admin/Manager)
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Payments
- `GET /api/payments` - Get payments
- `POST /api/payments` - Process payment
