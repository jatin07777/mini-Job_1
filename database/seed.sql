-- ============================================
-- Job Portal - Sample Seed Data
-- ============================================
-- This file contains sample data for testing
-- Password for all users: password123 (hashed with bcrypt)
-- ============================================

USE job_portal;

-- ============================================
-- Sample Users
-- ============================================
-- Note: Passwords are hashed using bcrypt
-- Default password for all: "password123"
-- Hash: $2a$10$rOzJqJqJqJqJqJqJqJqJqOeJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq

-- Job Seekers
INSERT INTO users (name, email, password, role) VALUES
('John Doe', 'john.doe@email.com', '$2a$10$rOzJqJqJqJqJqJqJqJqJqOeJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'job_seeker'),
('Jane Smith', 'jane.smith@email.com', '$2a$10$rOzJqJqJqJqJqJqJqJqJqOeJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'job_seeker'),
('Mike Johnson', 'mike.johnson@email.com', '$2a$10$rOzJqJqJqJqJqJqJqJqJqOeJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'job_seeker'),
('Sarah Williams', 'sarah.williams@email.com', '$2a$10$rOzJqJqJqJqJqJqJqJqJqOeJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'job_seeker');

-- Recruiters
INSERT INTO users (name, email, password, role) VALUES
('Tech Corp HR', 'hr@techcorp.com', '$2a$10$rOzJqJqJqJqJqJqJqJqJqOeJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'recruiter'),
('Design Studio', 'recruit@designstudio.com', '$2a$10$rOzJqJqJqJqJqJqJqJqJqOeJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'recruiter'),
('Data Solutions Inc', 'jobs@datasolutions.com', '$2a$10$rOzJqJqJqJqJqJqJqJqJqOeJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'recruiter'),
('Marketing Pro', 'careers@marketingpro.com', '$2a$10$rOzJqJqJqJqJqJqJqJqJqOeJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'recruiter');

-- ============================================
-- Sample Jobs
-- ============================================
INSERT INTO jobs (title, description, category, location, salary, company_name, posted_by) VALUES
('Senior Full Stack Developer', 
'We are looking for an experienced Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies. Requirements: 5+ years of experience, proficiency in React, Node.js, and MySQL.',
'Technology', 'San Francisco, CA', '$120,000 - $150,000', 'Tech Corp', 5),

('UI/UX Designer', 
'Join our creative team as a UI/UX Designer. You will design beautiful and intuitive user interfaces for web and mobile applications. Must have a strong portfolio and experience with Figma, Adobe XD, and design systems.',
'Design', 'New York, NY', '$80,000 - $100,000', 'Design Studio', 6),

('Data Scientist', 
'We are seeking a talented Data Scientist to analyze complex datasets and build machine learning models. You will work with large-scale data and collaborate with cross-functional teams. Required: Python, SQL, TensorFlow, and 3+ years of experience.',
'Data Science', 'Seattle, WA', '$130,000 - $160,000', 'Data Solutions Inc', 7),

('Digital Marketing Manager', 
'Lead our digital marketing efforts and drive growth through innovative campaigns. You will manage SEO, SEM, social media, and content marketing strategies. Experience with Google Analytics, Facebook Ads, and marketing automation tools required.',
'Marketing', 'Los Angeles, CA', '$90,000 - $110,000', 'Marketing Pro', 8),

('Frontend Developer', 
'We need a skilled Frontend Developer to build responsive and interactive web applications. You will work with React, TypeScript, and modern CSS frameworks. Strong problem-solving skills and attention to detail required.',
'Technology', 'Austin, TX', '$95,000 - $115,000', 'Tech Corp', 5),

('Product Manager', 
'Lead product development initiatives and work closely with engineering and design teams. You will define product roadmaps, gather requirements, and ensure successful product launches. MBA or equivalent experience preferred.',
'Product', 'Boston, MA', '$110,000 - $140,000', 'Tech Corp', 5),

('Backend Developer', 
'Join our backend team to build scalable and efficient server-side applications. You will work with Node.js, Express, PostgreSQL, and cloud infrastructure. Experience with microservices architecture is a plus.',
'Technology', 'Remote', '$100,000 - $125,000', 'Data Solutions Inc', 7),

('Sales Representative', 
'We are looking for an energetic Sales Representative to drive revenue growth. You will identify new business opportunities, build client relationships, and close deals. Strong communication and negotiation skills required.',
'Sales', 'Chicago, IL', '$60,000 - $80,000 + Commission', 'Marketing Pro', 8),

('Graphic Designer', 
'Create stunning visual designs for print and digital media. You will work on branding, marketing materials, and social media content. Proficiency in Adobe Creative Suite and strong creative portfolio required.',
'Design', 'Miami, FL', '$65,000 - $85,000', 'Design Studio', 6),

('Machine Learning Engineer', 
'Build and deploy machine learning models to solve complex business problems. You will work with large datasets, implement algorithms, and optimize model performance. Required: Python, PyTorch, and experience with ML pipelines.',
'Data Science', 'Remote', '$140,000 - $170,000', 'Data Solutions Inc', 7);

-- ============================================
-- Sample Applications
-- ============================================
INSERT INTO applications (job_id, user_id, status, cover_letter) VALUES
(1, 1, 'pending', 'I am very interested in this position and believe my 6 years of experience in full stack development make me a great fit.'),
(2, 2, 'reviewed', 'I have been working as a UI/UX designer for 4 years and have a strong portfolio of successful projects.'),
(3, 3, 'pending', 'My background in data science and machine learning aligns perfectly with your requirements.'),
(1, 2, 'accepted', 'I am excited about the opportunity to join your team and contribute to innovative projects.'),
(4, 1, 'pending', 'I have successfully managed digital marketing campaigns for several companies and would love to bring my expertise to your team.');

-- ============================================
-- Sample Saved Jobs
-- ============================================
INSERT INTO saved_jobs (job_id, user_id) VALUES
(5, 1),
(6, 1),
(7, 2),
(8, 3),
(9, 2);

