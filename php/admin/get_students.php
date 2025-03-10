<?php
include '../../database/db_connect.php'; // Include the database connection

header('Content-Type: application/json');

$year = $_GET['year'];

$sql = "SELECT id, name, reg_no, department FROM student WHERE year = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $year);
$stmt->execute();
$result = $stmt->get_result();

$students = [];
while ($row = $result->fetch_assoc()) {
    $students[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode($students);
?>
