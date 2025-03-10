<?php
session_start();
include '../../database/db_connect.php';

if (!isset($_SESSION['student_id'])) {
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit();
}

$student_id = $_SESSION['student_id'];

// Fetch student data without password
$sql = "SELECT name, email, reg_no, year, department FROM student WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $student_id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if ($row) {
    echo json_encode([
        "success" => true,
        "name" => $row['name'],
        "email" => $row['email'],
        "reg_no" => $row['reg_no'],
        "year" => $row['year'],
        "department" => $row['department']
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Student not found"]);
}

$stmt->close();
$conn->close();
?>
