<?php
header("Content-Type: application/json");
include("../../database/db_connect.php");

$query = "SELECT COUNT(*) AS total_students FROM student";
$result = $conn->query($query);

if ($result) {
    $row = $result->fetch_assoc();
    echo json_encode(["total_students" => $row["total_students"]]);
} else {
    echo json_encode(["total_students" => 0, "error" => "Query failed"]);
}

$conn->close();
?>
