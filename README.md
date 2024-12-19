# Medicine Management System

A comprehensive web application for managing medicines, patients, and medical records with separate interfaces for administrators and patients.

## Features

### Admin Dashboard
- Patient management with comprehensive profiles
- Real-time medicine tracking and inventory management
- Detailed log monitoring and reporting
- Statistical dashboard with analytics and insights

### Patient Features
- Interactive medicine schedule management
- Customizable medicine reminders
- Medicine acknowledgment system
- Personal medicine log with history tracking

## Project Structure

### Frontend (`/frontend`)
```
src/
├── components/
│   ├── Auth/      # Authentication components
│   ├── admin/     # Admin dashboard components
│   ├── common/    # Shared components
│   ├── medicine/  # Medicine management components
│   └── patient/   # Patient-related components
```

### Backend (`/backend`)
```
├── config/      # Database configuration
├── controllers/ # Request handlers
├── middleware/  # Authentication middleware
├── models/      # Database models
└── routes/      # API routes
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure MySQL Database:
   - Create MySQL database
   - Create `.env` file with the following configuration:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASS=your_password
     DB_NAME=medication_reminder
     JWT_SECRET=your_jwt_secret
     PORT=3000
     ADMIN_SECRET=your_admin_secret
     ```

4. Start the server:
   ```bash
   node server.js
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /create-admin` - Create admin account

### Medicine Routes (`/api/medicines`)
- `GET /` - Get user's medicines
- `GET /:id` - Get specific medicine
- `POST /` - Create new medicine
- `PUT /:id` - Update medicine
- `DELETE /:id` - Delete medicine
- `GET /schedule` - Get medicine schedule
- `POST /acknowledge/:id` - Acknowledge medicine taken

### Admin Routes (`/api/admin`)
- `GET /patients` - Get all patients
- `GET /medicines` - Get all medicines
- `GET /logs` - Get all logs
- `GET /logs/filtered` - Get filtered logs
- `GET /dashboard/stats` - Get dashboard statistics

## Tech Stack

### Frontend
- React with Vite
- React Router for navigation
- Axios for API calls
- Styled Components
- React Icons
- Date-fns for date handling

### Backend
- Node.js
- Express.js
- MySQL with Sequelize ORM
- JWT for authentication
- Bcrypt for password hashing

## Security Features
- JWT-based authentication
- Role-based access control (RBAC)
- Secure password hashing with bcrypt
- Protected API routes
- Admin-specific authentication middleware

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
