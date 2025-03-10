<?php
header("Content-Type: application/json");
include("../../database/db_connect.php");

// Ensure the timezone matches your database
date_default_timezone_set("Asia/Kolkata");  // Change as per your region

// Get today's date in 'YYYY-MM-DD' format
$today = date('Y-m-d');

// Debugging: Log the current date to check if it matches DB values
error_log("Today's Date: " . $today);

// Correct query to fetch students added today
$query = "SELECT name, reg_no, year, department, email 
          FROM student 
          WHERE created_at >= ? AND created_at < DATE_ADD(?, INTERVAL 1 DAY) 
          ORDER BY id DESC";

$stmt = $conn->prepare($query);
$stmt->bind_param("ss", $today, $today);
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
