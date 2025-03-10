<?php
include '../database/db_connect.php'; // Include the database connection

// ✅ Step 1: Create Database & Table if Not Exists
$createDB = "CREATE DATABASE IF NOT EXISTS innovation";
$conn->query($createDB);

$conn->select_db("innovation");

$createTable = "CREATE TABLE IF NOT EXISTS student (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reg_no VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    otp VARCHAR(6) NULL,
    otp_timestamp DATETIME NULL
)";
$conn->query($createTable);

// ✅ Step 2: Set Student Details (Modify as Needed)
$reg_no = "TU6230105111025"; // Student Registration Number (Unique)
$student_name = "Manoj"; // Student Name
$student_email = "manojmutireddy2305@gmail.com"; // Student Email
$student_password = password_hash("123", PASSWORD_BCRYPT); // Securely Hash Password

// ✅ Step 3: Insert Student into Table
$sql = "INSERT INTO student (reg_no, name, email, password) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $reg_no, $student_name, $student_email, $student_password);

if ($stmt->execute()) {
    echo "Student added successfully!";
} else {
    echo "Error: " . $stmt->error;
}

$conn->close();
?>
