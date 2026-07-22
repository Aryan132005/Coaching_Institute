# Database Schema - Coaching Institute Portal

This document outlines the MongoDB/JSON collections design, data types, validators, and relationships.

---

## 1. Users Collection
Stores student profiles and administrators.

### Schema Fields
- `_id` (ObjectId/String): Unique primary key.
- `name` (String, required): Full name of the user.
- `email` (String, required, unique): Unique login email address.
- `password` (String, required): Hashed password using `bcryptjs`.
- `role` (String, enum: `['student', 'admin']`): Role-based access control. Defaults to `student`.
- `phone` (String, optional): Contact number.
- `createdAt` (Date): Auto-generated timestamp.

### Sample Document
```json
{
  "_id": "usr8c2m01a1562",
  "name": "John Doe",
  "email": "student@coaching.com",
  "password": "$2a$10$tZ8p4.k0m/Lg5m3b4e7h2uT5eE8q2w9zY7o9i...",
  "role": "student",
  "phone": "8888888888",
  "createdAt": "2026-07-22T04:53:01.000Z"
}
```

---

## 2. Courses Collection
Stores academic and boot camp courses offered by the institute.

### Schema Fields
- `_id` (ObjectId/String): Unique primary key.
- `title` (String, required): Course name.
- `description` (String, required): Full text details of course curriculum.
- `duration` (String, required): e.g., "2 Years", "6 Months".
- `fees` (Number, required): Cost of enrollment in INR.
- `category` (String, required): Department e.g., "Engineering", "Medical", "Technology", "Civil Services".
- `faculty` (String, required): Names of course mentors.
- `seatsAvailable` (Number, required): Remaining seats (defaults to 30).
- `image` (String, optional): Unsplash or custom CDN cover image URL.
- `createdAt` (Date): Auto-generated timestamp.

### Sample Document
```json
{
  "_id": "668ec0000000000000000001",
  "title": "JEE Main & Advanced Crackers Program",
  "description": "Comprehensive 2-year classroom/online coaching program for JEE aspirants...",
  "duration": "2 Years",
  "fees": 150000,
  "category": "Engineering",
  "faculty": "Dr. Ramesh Sharma, Prof. Sarah Jenkins, Dr. Vikram Malhotra",
  "seatsAvailable": 50,
  "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80",
  "createdAt": "2026-07-22T04:53:01.000Z"
}
```

---

## 3. Admissions Collection
Stores online admission applications.

### Schema Fields
- `_id` (ObjectId/String): Unique primary key.
- `studentName` (String, required): Applicant name.
- `email` (String, required): Student contact email (used for matching dashboards).
- `phone` (String, required): Student contact phone.
- `courseId` (ObjectId, ref: `Course`, required): Reference to course.
- `documents` (String, required): Link to folder/drive or grade sheet list.
- `status` (String, enum: `['pending', 'approved', 'rejected']`): Defaults to `pending`.
- `appliedAt` (Date): Auto-generated timestamp.

### Sample Document
```json
{
  "_id": "adm9a2j38l571",
  "studentName": "John Doe",
  "email": "student@coaching.com",
  "phone": "8888888888",
  "courseId": "668ec0000000000000000001",
  "documents": "Mock High School Certificate.pdf",
  "status": "pending",
  "appliedAt": "2026-07-22T04:53:01.000Z"
}
```

---

## 4. Announcements Collection
Stores notification notices posted by administrators.

### Schema Fields
- `_id` (ObjectId/String): Unique primary key.
- `title` (String, required): Title of notice.
- `description` (String, required): Main notice text.
- `date` (Date): Posted timestamp (defaults to current date).
- `postedBy` (ObjectId, ref: `User`, required): Administrator reference.
- `isActive` (Boolean): Published flag. Defaults to `true`.

### Sample Document
```json
{
  "_id": "ann6k3v91u749",
  "title": "Scholarship Admission Test (SAT) 2026",
  "description": "Register for the SAT scheduled on August 10th, 2026. Get up to 100% tuition fee waiver...",
  "postedBy": "usr9d7m24j1562",
  "date": "2026-07-20T00:00:00.000Z",
  "isActive": true
}
```

---

## 5. Enquiries Collection
Stores contact form questions submitted by public visitors or students.

### Schema Fields
- `_id` (ObjectId/String): Unique primary key.
- `name` (String, required): Name of contact.
- `email` (String, required): Email address.
- `phone` (String, required): Contact phone.
- `message` (String, required): Detailed query.
- `status` (String, enum: `['pending', 'resolved']`): Resolution flag. Defaults to `pending`.
- `createdAt` (Date): Auto-generated timestamp.

### Sample Document
```json
{
  "_id": "enq7b4x10n983",
  "name": "Alice Cooper",
  "email": "alice@gmail.com",
  "phone": "7777777777",
  "message": "Can I pay the fees for the JEE Cracker program in monthly installments?",
  "status": "pending",
  "createdAt": "2026-07-22T04:53:01.000Z"
}
```

---

## 6. Faculty Collection
Stores details of institute educators.

### Schema Fields
- `_id` (ObjectId/String): Unique primary key.
- `name` (String, required): Teacher's name.
- `subject` (String, required): Core department e.g., "Physics", "Computer Science".
- `qualification` (String, required): Academic degree.
- `experience` (Number, required): Teaching years.
- `photo` (String, required): Image URL link.
- `bio` (String): Educator bio paragraph.

### Sample Document
```json
{
  "_id": "fac3n8k91y829",
  "name": "Dr. Ramesh Sharma",
  "subject": "Physics",
  "qualification": "Ph.D. in Physics (IIT Delhi)",
  "experience": 15,
  "photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80",
  "bio": "Dr. Ramesh has over 15 years of experience coaching students for JEE Advanced and NEET..."
}
```
