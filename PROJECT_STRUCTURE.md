# Job Portal - Complete Project Structure

## 📂 Folder Structure

```
job-portal/
│
├── 📁 frontend/
│   ├── 📁 css/
│   │   └── style.css                    # Main stylesheet (responsive, modern design)
│   │
│   ├── 📁 js/
│   │   ├── main.js                     # Common functions (auth, API calls, utilities)
│   │   ├── home.js                     # Home page functionality
│   │   ├── login.js                    # Login page functionality
│   │   ├── register.js                 # Registration page functionality
│   │   ├── job-listings.js             # Job listings with search/filters
│   │   ├── job-details.js              # Job details page
│   │   ├── apply-job.js                # Apply job functionality
│   │   ├── user-dashboard.js           # Job seeker dashboard
│   │   └── recruiter-dashboard.js      # Recruiter dashboard
│   │
│   ├── index.html                      # Home page
│   ├── login.html                      # Login page
│   ├── register.html                   # Registration page
│   ├── job-listings.html               # Browse jobs page
│   ├── job-details.html                # Job details page
│   ├── apply-job.html                  # Apply for job page
│   ├── user-dashboard.html             # Job seeker dashboard
│   └── recruiter-dashboard.html        # Recruiter dashboard
│
├── 📁 backend/
│   ├── 📁 config/
│   │   └── database.js                 # MySQL connection pool
│   │
│   ├── 📁 middleware/
│   │   └── auth.js                     # JWT authentication middleware
│   │
│   ├── 📁 routes/
│   │   ├── auth.js                     # Auth routes (register, login)
│   │   ├── jobs.js                     # Job CRUD routes
│   │   ├── applications.js              # Application routes
│   │   └── savedJobs.js                # Saved jobs routes
│   │
│   ├── server.js                       # Express server setup
│   ├── package.json                    # Node.js dependencies
│   └── .env.example                   # Environment variables template
│
├── 📁 database/
│   ├── schema.sql                      # Database schema (tables, indexes)
│   └── seed_data.sql                   # Sample data for testing
│
├── README.md                           # Complete project documentation
├── PROJECT_STRUCTURE.md               # This file
└── .gitignore                         # Git ignore file
```

## 📊 Database Tables

1. **users** - User accounts (job seekers & recruiters)
2. **jobs** - Job postings
3. **applications** - Job applications
4. **saved_jobs** - Saved jobs by job seekers

## 🎯 Pages Overview

### Public Pages
- ✅ Home Page (`index.html`)
- ✅ Login Page (`login.html`)
- ✅ Register Page (`register.html`)
- ✅ Job Listings (`job-listings.html`)
- ✅ Job Details (`job-details.html`)

### Protected Pages
- ✅ Apply Job (`apply-job.html`) - Job Seeker only
- ✅ User Dashboard (`user-dashboard.html`) - Job Seeker only
- ✅ Recruiter Dashboard (`recruiter-dashboard.html`) - Recruiter only

## 🔌 API Routes Summary

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Jobs
- `GET /api/jobs` - List all jobs (with filters)
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (Recruiter)
- `PUT /api/jobs/:id` - Update job (Recruiter)
- `DELETE /api/jobs/:id` - Delete job (Recruiter)
- `GET /api/jobs/recruiter/my-jobs` - Recruiter's jobs

### Applications
- `POST /api/applications` - Apply for job
- `GET /api/applications/my-applications` - User's applications
- `GET /api/applications/job/:jobId` - Job applications
- `PUT /api/applications/:id/status` - Update status

### Saved Jobs
- `POST /api/saved-jobs` - Save job
- `GET /api/saved-jobs` - Get saved jobs
- `DELETE /api/saved-jobs/:jobId` - Remove saved job

## ✅ Features Checklist

### Frontend
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern UI with clean aesthetics
- ✅ Search functionality
- ✅ Filter by category and location
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Authentication flow

### Backend
- ✅ RESTful API
- ✅ JWT authentication
- ✅ Password hashing
- ✅ Role-based access control
- ✅ Input validation
- ✅ Error handling
- ✅ Database connection pooling

### Database
- ✅ Normalized schema
- ✅ Foreign key constraints
- ✅ Indexes for performance
- ✅ Sample seed data

## 🚀 Quick Start

1. **Setup Database**
   ```bash
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/seed_data.sql
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   npm start
   ```

3. **Open Frontend**
   - Open `frontend/index.html` in browser
   - Or use a local server

## 📝 Notes

- All files include comprehensive comments
- Code follows clean code principles
- Security best practices implemented
- Responsive design throughout
- Error handling in all components


