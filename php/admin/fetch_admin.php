<?php
include '../../database/db_connect.php'; // Ensure database connection

$query = "SELECT adminname FROM admin LIMIT 1"; // Adjust table name if necessary
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode(["adminname" => $row['adminname']]);
} else {
    echo json_encode(["adminname" => "Admin"]);
}

$conn->close();
?>
