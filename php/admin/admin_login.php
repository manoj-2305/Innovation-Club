<?php
session_start();
header("Content-Type: application/json");
include '../../database/db_connect.php'; // Include the database connection

// Check if POST data is set
if (!isset($_POST['username']) || !isset($_POST['password'])) {
    echo json_encode(["status" => "error", "message" => "Missing username or password."]);
    exit();
}

// Get input from login form
$admin_id = trim($_POST['username']);
$admin_password = trim($_POST['password']);

// Validate admin credentials
$sql = "SELECT * FROM admin WHERE admin_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $admin_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $admin = $result->fetch_assoc();

    if (password_verify($admin_password, $admin['password'])) {
        // ✅ Secure session handling
        session_regenerate_id(true);
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_id'] = $admin['admin_id'];

        // ✅ Update login_status to "open" in the database
        $updateStatus = "UPDATE admin SET login_status = 'open' WHERE admin_id = ?";
        $updateStmt = $conn->prepare($updateStatus);
        $updateStmt->bind_param("s", $admin_id);
        $updateStmt->execute();
        $updateStmt->close();

        echo json_encode(["status" => "success", "redirect" => "../template/php_templates/admindashboard.php"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid password."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Admin not found."]);
}

// Close database connections
$stmt->close();
$conn->close();
?>
