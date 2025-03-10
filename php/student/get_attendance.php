<?php
header('Content-Type: application/json');
include '../../database/db_connect.php'; // Ensure this file contains database connection details

session_start();
if (!isset($_SESSION['student_id'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized access"]);
    exit;
}

$student_id = $_SESSION['student_id'];

$sql = "SELECT date, status FROM attendance WHERE student_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $student_id);
$stmt->execute();
$result = $stmt->get_result();

$attendance = [];
while ($row = $result->fetch_assoc()) {
    $attendance[] = [
        "date" => $row['date'],
        "status" => $row['status']
    ];
}

echo json_encode(["success" => true, "attendance" => $attendance]);

$stmt->close();
$conn->close();
?>
