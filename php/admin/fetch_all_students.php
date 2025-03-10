<?php
header("Content-Type: application/json");
include("../../database/db_connect.php");

$query = "SELECT name, reg_no, year, department, email FROM student ORDER BY id DESC";
$result = $conn->query($query);

$students = [];
while ($row = $result->fetch_assoc()) {
    $students[] = $row;
}

echo json_encode($students);
$conn->close();
?>
