<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../../database/db_connect.php'; // Ensure this file establishes database connection

if (!isset($_SESSION['student_id'])) {
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit();
}

$student_id = $_SESSION['student_id'];
$sql = "SELECT name FROM student WHERE id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "SQL prepare failed: " . $conn->error]);
    exit();
}

$stmt->bind_param("i", $student_id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if ($row) {
    echo json_encode(["success" => true, "name" => $row['name']]);
} else {
    echo json_encode(["success" => false, "message" => "Student not found"]);
}

$stmt->close();
$conn->close();
?>
