-- ============================================
-- Job Portal Sample Seed Data
-- ============================================
-- This file contains sample data for testing the application
-- Run this after creating the schema
-- Note: Passwords are hashed using bcrypt (default: "password123")

USE job_portal;

-- ============================================
-- Sample Users
-- ============================================
-- Job Seekers (passwords will be hashed by the application)
INSERT INTO users (name, email, password, role) VALUES
('John Doe', 'john.doe@email.com', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'job_seeker'),
('Jane Smith', 'jane.smith@email.com', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'job_seeker'),
('Mike Johnson', 'mike.johnson@email.com', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'job_seeker'),
('Sarah Williams', 'sarah.williams@email.com', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'job_seeker');

-- Recruiters
INSERT INTO users (name, email, password, role) VALUES
('Tech Corp HR', 'hr@techcorp.com', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'recruiter'),
('Innovate Solutions', 'jobs@innovate.com', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'recruiter'),
('Global Industries', 'careers@global.com', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'recruiter');

-- ============================================
-- Sample Jobs
-- ============================================
-- Note: posted_by references user IDs (5, 6, 7 are recruiters from above)

INSERT INTO jobs (title, description, category, location, salary, company_name, posted_by) VALUES
('Senior Software Engineer', 'We are looking for an experienced software engineer to join our team. You will be responsible for developing and maintaining web applications using modern technologies. Requirements: 5+ years of experience, proficiency in JavaScript, Node.js, and React.', 'Technology', 'New York, NY', '$100,000 - $130,000', 'Tech Corp', 5),
('Frontend Developer', 'Join our dynamic team as a Frontend Developer. You will work on creating beautiful and responsive user interfaces. Skills required: HTML, CSS, JavaScript, React, Vue.js.', 'Technology', 'San Francisco, CA', '$80,000 - $100,000', 'Innovate Solutions', 6),
('Marketing Manager', 'We need a creative Marketing Manager to lead our marketing campaigns. You will develop strategies, manage social media, and coordinate with the sales team. Experience: 3+ years in digital marketing.', 'Marketing', 'Chicago, IL', '$70,000 - $90,000', 'Global Industries', 7),
('Data Analyst', 'Looking for a Data Analyst to help us make data-driven decisions. You will analyze large datasets, create reports, and provide insights to stakeholders. Skills: SQL, Python, Excel, Tableau.', 'Data Science', 'Austin, TX', '$65,000 - $85,000', 'Tech Corp', 5),
('UX/UI Designer', 'We are seeking a talented UX/UI Designer to create intuitive and engaging user experiences. You will work closely with developers and product managers. Portfolio required.', 'Design', 'Seattle, WA', '$75,000 - $95,000', 'Innovate Solutions', 6),
('Backend Developer', 'Join our backend team to build scalable server-side applications. You will work with Node.js, Python, and cloud services. Experience with databases and APIs required.', 'Technology', 'Remote', '$90,000 - $110,000', 'Global Industries', 7),
('Product Manager', 'We need a Product Manager to drive product strategy and work with cross-functional teams. You will define roadmaps, gather requirements, and ensure successful product launches.', 'Product', 'Boston, MA', '$95,000 - $120,000', 'Tech Corp', 5),
('DevOps Engineer', 'Looking for a DevOps Engineer to manage our infrastructure and CI/CD pipelines. Experience with AWS, Docker, Kubernetes, and automation tools required.', 'DevOps', 'Denver, CO', '$100,000 - $125,000', 'Innovate Solutions', 6),
('Sales Representative', 'Join our sales team to help grow our business. You will identify new opportunities, build relationships with clients, and close deals. Strong communication skills required.', 'Sales', 'Miami, FL', '$50,000 - $70,000 + Commission', 'Global Industries', 7),
('Content Writer', 'We are looking for a creative Content Writer to produce engaging content for our blog and marketing materials. Experience in SEO and content strategy preferred.', 'Content', 'Portland, OR', '$45,000 - $60,000', 'Tech Corp', 5);


