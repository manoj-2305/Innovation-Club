<?php
include '../database/db_connect.php'; // Include the database connection

// ✅ Step 1: Ensure the 'innovation' database exists
$createDBQuery = "CREATE DATABASE IF NOT EXISTS innovation";
$conn->query($createDBQuery);

// ✅ Step 2: Select the 'innovation' database
$conn->select_db("innovation");

// ✅ Step 3: Create the 'admin' table if it doesn't exist (Added phone_number & login_status)
$createAdminTableQuery = "CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL, 
    password VARCHAR(255) NOT NULL,
    login_status VARCHAR(10) DEFAULT 'close',
    otp VARCHAR(6) NULL,
    otp_timestamp DATETIME NULL
)";
$conn->query($createAdminTableQuery);

// ✅ Step 4: Set Admin Credentials
$admin_id = "manoj"; // Change this to your desired admin ID
$admin_email = "manojmutireddy@gmail.com"; // Change this to the admin's email
$admin_phone = "9985408139"; // Change this to the admin's phone number
$admin_password = password_hash("123", PASSWORD_BCRYPT); // Securely hash the password

// ✅ Step 5: Insert the Admin into the Table (Updated to include phone_number & login_status)
$sql = "INSERT INTO admin (admin_id, email, phone_number, password, login_status) VALUES (?, ?, ?, ?, 'close')";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $admin_id, $admin_email, $admin_phone, $admin_password);

if ($stmt->execute()) {
    echo "Admin added successfully!";
} else {
    echo "Error: " . $stmt->error;
}

$conn->close();
?>
