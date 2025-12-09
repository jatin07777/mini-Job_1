# Job Portal Website

A complete full-stack job portal application built with HTML, CSS, JavaScript (Frontend) and Node.js + Express (Backend) with MySQL database.

## 📋 Project Overview

This is a comprehensive job portal system that connects job seekers with recruiters. The platform allows job seekers to browse jobs, apply for positions, and save jobs for later. Recruiters can post job openings, manage applications, and track candidates.

## ✨ Features

### For Job Seekers
- User registration and authentication
- Browse and search jobs with filters (category, location, salary)
- View detailed job information
- Apply for jobs with cover letter
- Save jobs for later viewing
- Track application status
- Personal dashboard

### For Recruiters
- Recruiter registration and authentication
- Post new job openings
- Manage job postings (view, edit, delete)
- View applications for posted jobs
- Update application status
- Recruiter dashboard

### General Features
- Fully responsive design
- Modern and clean UI
- Secure authentication with JWT
- Form validation
- Search and filter functionality
- Real-time updates

## 🛠️ Technology Stack

### Frontend
- HTML5
- CSS3 (Custom CSS with modern design)
- JavaScript (Vanilla JS)
- Font Awesome Icons

### Backend
- Node.js
- Express.js
- MySQL2
- bcryptjs (Password hashing)
- jsonwebtoken (JWT authentication)
- CORS

### Database
- MySQL

## 📁 Project Structure

```
job-portal/
├── frontend/
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   ├── js/
│   │   ├── main.js            # Common functions
│   │   ├── home.js            # Home page functionality
│   │   ├── login.js           # Login functionality
│   │   ├── register.js        # Registration functionality
│   │   ├── job-listings.js    # Job listings page
│   │   ├── job-details.js     # Job details page
│   │   ├── apply-job.js       # Apply job functionality
│   │   ├── user-dashboard.js  # Job seeker dashboard
│   │   └── recruiter-dashboard.js # Recruiter dashboard
│   ├── index.html             # Home page
│   ├── login.html             # Login page
│   ├── register.html          # Registration page
│   ├── job-listings.html      # Browse jobs page
│   ├── job-details.html       # Job details page
│   ├── apply-job.html         # Apply for job page
│   ├── user-dashboard.html    # Job seeker dashboard
│   └── recruiter-dashboard.html # Recruiter dashboard
├── backend/
│   ├── config/
│   │   └── database.js        # Database configuration
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── jobs.js            # Job routes
│   │   ├── applications.js    # Application routes
│   │   └── savedJobs.js       # Saved jobs routes
│   ├── server.js              # Main server file
│   ├── package.json           # Node.js dependencies
│   └── .env.example          # Environment variables example
├── database/
│   ├── schema.sql            # Database schema
│   └── seed_data.sql         # Sample data
└── README.md                 # This file
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Step 1: Clone or Download the Project
```bash
# If using git
git clone <repository-url>
cd job-portal

# Or extract the downloaded zip file
```

### Step 2: Database Setup

1. **Create MySQL Database**
   ```sql
   CREATE DATABASE job_portal;
   ```

2. **Run Schema Script**
   ```bash
   # Using MySQL command line
   mysql -u root -p job_portal < database/schema.sql
   
   # Or import via phpMyAdmin or MySQL Workbench
   ```

3. **Load Sample Data (Optional)**
   ```bash
   mysql -u root -p job_portal < database/seed_data.sql
   ```

### Step 3: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   # Copy .env.example to .env
   cp .env.example .env
   
   # Edit .env file with your database credentials
   # DB_HOST=localhost
   # DB_USER=root
   # DB_PASSWORD=your_password
   # DB_NAME=job_portal
   # PORT=3000
   # JWT_SECRET=your_secret_key_here
   ```

4. **Start Backend Server**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Or production mode
   npm start
   ```

   The backend server will run on `http://localhost:3000`

### Step 4: Frontend Setup

1. **Navigate to frontend directory** (if needed)
   ```bash
   cd frontend
   ```

2. **Open in Browser**
   - Simply open `index.html` in your browser
   - Or use a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js http-server
     npx http-server -p 8000
     ```

3. **Access the Application**
   - Frontend: `http://localhost:8000` (or your chosen port)
   - Backend API: `http://localhost:3000/api`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Jobs
- `GET /api/jobs` - Get all jobs (with filters: ?category, ?location, ?search, ?limit)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (Recruiter only)
- `PUT /api/jobs/:id` - Update job (Recruiter only)
- `DELETE /api/jobs/:id` - Delete job (Recruiter only)
- `GET /api/jobs/recruiter/my-jobs` - Get recruiter's jobs

### Applications
- `POST /api/applications` - Apply for job (Job Seeker only)
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/job/:jobId` - Get job applications (Recruiter only)
- `PUT /api/applications/:id/status` - Update application status (Recruiter only)

### Saved Jobs
- `POST /api/saved-jobs` - Save job (Job Seeker only)
- `GET /api/saved-jobs` - Get saved jobs
- `DELETE /api/saved-jobs/:jobId` - Remove saved job

## 👤 Default Test Accounts

After running seed data, you can use these test accounts:

### Job Seekers
- Email: `john.doe@email.com`
- Password: `password123`
- Role: Job Seeker

### Recruiters
- Email: `hr@techcorp.com`
- Password: `password123`
- Role: Recruiter

**Note:** In production, passwords should be properly hashed. The seed data uses placeholder hashes. For testing, you may need to register new accounts or update the seed data with actual bcrypt hashes.

## 🎨 Features Overview

### Home Page
- Hero section with search functionality
- Feature highlights
- Recent job postings
- Category browsing
- Call-to-action sections

### Job Listings
- Search by keyword
- Filter by category and location
- Responsive job cards
- Direct links to job details

### Job Details
- Complete job information
- Apply button (for job seekers)
- Save job functionality
- Application status check

### User Dashboard (Job Seeker)
- View all applications
- Track application status
- Manage saved jobs
- Profile information

### Recruiter Dashboard
- Post new jobs
- Manage job postings
- View applications
- Update application status

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Input validation
- SQL injection prevention (parameterized queries)
- XSS prevention (HTML escaping)

## 📱 Responsive Design

The website is fully responsive and works on:
- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🐛 Troubleshooting

### Database Connection Error
- Check MySQL service is running
- Verify database credentials in `.env`
- Ensure database `job_portal` exists

### CORS Errors
- Ensure backend CORS is enabled
- Check frontend is accessing correct API URL
- Verify backend server is running

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET in `.env`
- Verify token expiration

### Port Already in Use
- Change PORT in `.env` file
- Or stop the process using the port

## 🔮 Future Improvements

1. **Enhanced Features**
   - Resume upload functionality
   - Email notifications
   - Advanced search with multiple filters
   - Job recommendations based on profile
   - Company profiles and pages
   - Rating and review system

2. **User Experience**
   - Real-time notifications
   - Chat/messaging system
   - Video interview scheduling
   - Application tracking timeline
   - Skills assessment tests

3. **Technical Improvements**
   - File upload handling (resumes, documents)
   - Image upload for company logos
   - Pagination for job listings
   - Advanced filtering options
   - Admin panel for system management
   - Email service integration
   - Password reset functionality
   - Email verification

4. **Security Enhancements**
   - Rate limiting
   - CSRF protection
   - Input sanitization
   - Security headers
   - HTTPS implementation

5. **Performance**
   - Database indexing optimization
   - Caching mechanisms
   - Image optimization
   - Lazy loading
   - CDN integration

## 📄 License

This project is created for educational purposes and college submission.

## 👨‍💻 Development Notes

- All code includes comprehensive comments
- Functions are well-documented
- Code follows clean code principles
- Responsive design implemented throughout
- Error handling included in all API routes

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review code comments
3. Verify database and server setup
4. Check browser console for errors

## 🎓 Project Submission Checklist

- ✅ Complete folder structure
- ✅ Database schema with all tables
- ✅ Backend API with all routes
- ✅ Frontend pages (all required pages)
- ✅ Responsive design
- ✅ User authentication
- ✅ Form validation
- ✅ Comments in all files
- ✅ Sample seed data
- ✅ README with instructions

---

**Project Title:** Job Portal Website  
**Technology:** HTML, CSS, JavaScript, Node.js, Express, MySQL  
**Year:** 2024


