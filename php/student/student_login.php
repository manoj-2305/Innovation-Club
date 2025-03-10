<?php
session_start();
include '../../database/db_connect.php'; // Ensure correct DB connection

header("Content-Type: application/json"); // Ensure JSON response

$reg_no = $_POST['reg_no']; // Student enters Registration Number
$password = $_POST['password']; // Student enters Password

// Validate student credentials
$sql = "SELECT * FROM student WHERE reg_no = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $reg_no);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $student = $result->fetch_assoc();

    if (password_verify($password, $student['password'])) {
        $_SESSION['student_id'] = $student['id'];
        $_SESSION['reg_no'] = $student['reg_no'];
        $_SESSION['student_name'] = $student['name'];

        // ✅ Update `login_status` to "open"
        $updateStatus = "UPDATE student SET login_status = 'open' WHERE reg_no = ?";
        $stmt = $conn->prepare($updateStatus);
        $stmt->bind_param("s", $reg_no);
        $stmt->execute();
        $stmt->close();

        echo json_encode(["status" => "success", "redirect" => "../template/php_templates/studentdashboard.php"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid password."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Student not found."]);
}

$conn->close();
?>
