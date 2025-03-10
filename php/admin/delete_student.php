<?php
include '../../database/db_connect.php'; // Ensure you have database connection here

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['reg_no'])) {
    $reg_no = $_POST['reg_no'];

    // Prepare delete query
    $stmt = $conn->prepare("DELETE FROM student WHERE reg_no = ?");
    $stmt->bind_param("s", $reg_no);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Student deleted successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to delete student"]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
}
?>
