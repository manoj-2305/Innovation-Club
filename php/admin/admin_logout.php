<?php
session_start();
include '../../database/db_connect.php'; // Ensure correct database connection

header("Content-Type: application/json"); // Ensure JSON response

$response = ["status" => "error", "message" => "Something went wrong."];

// Check if admin_id exists in session
if (isset($_SESSION['admin_id'])) {
    $admin_id = $_SESSION['admin_id'];

    // ✅ Update login_status to "close"
    $updateStatus = "UPDATE admin SET login_status = 'close' WHERE admin_id = ?";
    $stmt = $conn->prepare($updateStatus);

    if (!$stmt) {
        $response["message"] = "Database prepare failed: " . $conn->error;
        echo json_encode($response);
        exit();
    }

    $stmt->bind_param("s", $admin_id);
    
    if ($stmt->execute()) {
        $response = ["status" => "success", "message" => "Logout successful.", "redirect" => "../login.html"];
    } else {
        $response["message"] = "Update failed: " . $stmt->error;
    }

    $stmt->close();
}

// ✅ Destroy session and clear cookies
session_unset();
session_destroy();
setcookie(session_name(), '', time() - 3600, '/'); // Delete session cookie

// ✅ Send response back to JavaScript
echo json_encode($response);
exit();
?>
