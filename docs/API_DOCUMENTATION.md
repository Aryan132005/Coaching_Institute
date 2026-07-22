# API Documentation - Coaching Institute Portal

All API endpoints reside under the `/api` prefix. The base development server runs on `http://localhost:5000/api`.

---

## 1. Authentication Endpoints

### Register User
* **URL:** `/auth/register`
* **Method:** `POST`
* **Access:** Public
* **Payload:**
```json
{
  "name": "Jane Miller",
  "email": "jane@gmail.com",
  "password": "studentpassword",
  "phone": "9876543211",
  "role": "student"
}
```
* **Response (201 Created):**
```json
{
  "_id": "usr9d8v10u831",
  "name": "Jane Miller",
  "email": "jane@gmail.com",
  "role": "student",
  "phone": "9876543211",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login User
* **URL:** `/auth/login`
* **Method:** `POST`
* **Access:** Public
* **Payload:**
```json
{
  "email": "student@coaching.com",
  "password": "student123"
}
```
* **Response (200 OK):**
```json
{
  "_id": "usr8c2m01a1562",
  "name": "John Doe",
  "email": "student@coaching.com",
  "role": "student",
  "phone": "8888888888",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Current Profile
* **URL:** `/auth/me`
* **Method:** `GET`
* **Access:** Private (Authenticated Student/Admin)
* **Headers:** `Authorization: Bearer <JWT_TOKEN>`
* **Response (200 OK):**
```json
{
  "_id": "usr8c2m01a1562",
  "name": "John Doe",
  "email": "student@coaching.com",
  "role": "student",
  "phone": "8888888888",
  "createdAt": "2026-07-22T04:53:01.000Z"
}
```

### Request Password Reset Link
* **URL:** `/auth/forgot-password`
* **Method:** `POST`
* **Access:** Public
* **Payload:**
```json
{
  "email": "student@coaching.com"
}
```
* **Response (200 OK):**
```json
{
  "message": "Password reset link sent to your email."
}
```

### Reset Password using token
* **URL:** `/auth/reset-password/:token`
* **Method:** `POST`
* **Access:** Public
* **Payload:**
```json
{
  "password": "newpassword123"
}
```
* **Response (200 OK):**
```json
{
  "message": "Password updated successfully! You can now log in."
}
```

---

## 2. Course Program Endpoints

### Get All Courses
* **URL:** `/courses`
* **Method:** `GET`
* **Access:** Public
* **Parameters (Optional):**
  * `category` - filter courses by type, e.g. `?category=Engineering`
  * `search` - text query matching title/description, e.g. `?search=JEE`
* **Response (200 OK):**
```json
[
  {
    "_id": "668ec0000000000000000001",
    "title": "JEE Main & Advanced Crackers Program",
    "description": "Comprehensive 2-year prep program...",
    "duration": "2 Years",
    "fees": 150000,
    "category": "Engineering",
    "faculty": "Dr. Ramesh Sharma, Prof. Sarah Jenkins, Dr. Vikram Malhotra",
    "seatsAvailable": 50,
    "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80",
    "createdAt": "2026-07-22T04:53:01.000Z"
  }
]
```

### Get Single Course Details
* **URL:** `/courses/:id`
* **Method:** `GET`
* **Access:** Public
* **Response (200 OK):**
```json
{
  "_id": "668ec0000000000000000001",
  "title": "JEE Main & Advanced Crackers Program",
  "description": "Comprehensive 2-year prep program...",
  "duration": "2 Years",
  "fees": 150000,
  "category": "Engineering",
  "faculty": "Dr. Ramesh Sharma, Prof. Sarah Jenkins, Dr. Vikram Malhotra",
  "seatsAvailable": 50,
  "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80",
  "createdAt": "2026-07-22T04:53:01.000Z"
}
```

### Create Course Program
* **URL:** `/courses`
* **Method:** `POST`
* **Access:** Private (Admin Only)
* **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
* **Payload:**
```json
{
  "title": "Mobile App Development with Flutter",
  "description": "Cross-platform mobile apps for iOS and Android.",
  "duration": "4 Months",
  "fees": 35000,
  "category": "Technology",
  "faculty": "Anjali Desai",
  "seatsAvailable": 25,
  "image": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&q=80"
}
```
* **Response (201 Created):** Course object as created in the database.

---

## 3. Online Admission Endpoints

### Submit Admission Application
* **URL:** `/admissions`
* **Method:** `POST`
* **Access:** Private (Student)
* **Headers:** `Authorization: Bearer <STUDENT_JWT_TOKEN>`
* **Payload:**
```json
{
  "studentName": "John Doe",
  "email": "student@coaching.com",
  "phone": "8888888888",
  "courseId": "668ec0000000000000000001",
  "documents": "Attached mock high school files link"
}
```
* **Response (201 Created):** Admission object initialized with status `pending`.

### Get All Admissions
* **URL:** `/admissions`
* **Method:** `GET`
* **Access:** Private (Admin Only)
* **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
* **Response (200 OK):** Array of all admission applications with populated Course details.

### Get My Admissions
* **URL:** `/admissions/my`
* **Method:** `GET`
* **Access:** Private (Student)
* **Headers:** `Authorization: Bearer <STUDENT_JWT_TOKEN>`
* **Response (200 OK):** Array of admission applications submitted by the logged-in student.

---

## 4. Contact Enquiry Endpoints

### Submit Contact Enquiry
* **URL:** `/enquiries`
* **Method:** `POST`
* **Access:** Public
* **Payload:**
```json
{
  "name": "Sarah Connor",
  "email": "sarah@gmail.com",
  "phone": "9999900000",
  "message": "When will the next batch start?"
}
```
* **Response (201 Created):** Enquiry object initialized with status `pending`.

### Get All Enquiries
* **URL:** `/enquiries`
* **Method:** `GET`
* **Access:** Private (Admin Only)
* **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
* **Response (200 OK):** Array of all enquiries.

### Resolve Enquiry
* **URL:** `/enquiries/:id/status`
* **Method:** `PUT`
* **Access:** Private (Admin Only)
* **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
* **Payload:**
```json
{
  "status": "resolved"
}
```
* **Response (200 OK):** Updated Enquiry object.
