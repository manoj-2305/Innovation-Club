<?php
header("Content-Type: application/json");
include("../../database/db_connect.php");

// Get the search query from GET request
$search = isset($_GET['q']) ? trim($_GET['q']) : '';

if (empty($search)) {
    echo json_encode([]); // Return an empty array if no search input
    exit;
}

// SQL Query to search for students by name or registration number
$query = "SELECT name, reg_no FROM student WHERE name LIKE ? OR reg_no LIKE ? ORDER BY name ASC";
$stmt = $conn->prepare($query);
$searchParam = "%{$search}%";
$stmt->bind_param("ss", $searchParam, $searchParam);
$stmt->execute();
$result = $stmt->get_result();

$students = [];
while ($row = $result->fetch_assoc()) {
    $students[] = $row;
}

echo json_encode($students);
$stmt->close();
$conn->close();
?>
