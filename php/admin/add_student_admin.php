<?php
header("Content-Type: application/json");
include("../../database/db_connect.php");  // Ensure database connection

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "errors" => ["Invalid request method"]]);
    exit();
}

$errors = []; // Store validation errors

// Retrieve form inputs
$name = trim($_POST["studentName"] ?? "");
$regNo = trim($_POST["regNo"] ?? "");
$year = trim($_POST["year"] ?? "");
$department = trim($_POST["department"] ?? "");
$email = trim($_POST["email"] ?? "");
$password = trim($_POST["password"] ?? "");

// Validate required fields
if (empty($name)) $errors[] = "Student name is required.";
if (empty($regNo)) $errors[] = "Registration number is required.";
if (empty($year)) $errors[] = "Year is required.";
if (empty($department)) $errors[] = "Department is required.";
if (empty($email)) $errors[] = "Email is required.";
if (empty($password)) $errors[] = "Password is required.";

// Validate email format
if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email format.";
}

// If validation errors exist, return them
if (!empty($errors)) {
    echo json_encode(["status" => "error", "errors" => $errors]);
    exit();
}

// Debugging: Log received values
error_log("Received data: Name=$name, RegNo=$regNo, Year=$year, Department=$department, Email=$email");

// Check if the registration number or email already exists
$checkQuery = "SELECT * FROM student WHERE reg_no = ? OR email = ?";
$stmt = $conn->prepare($checkQuery);
$stmt->bind_param("ss", $regNo, $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["status" => "error", "errors" => ["Registration number or email already exists."]]);
    exit();
}

// Hash password before storing
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insert student into the database
$query = "INSERT INTO student (name, reg_no, year, department, email, password) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("ssssss", $name, $regNo, $year, $department, $email, $hashed_password);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Student added successfully!"]);
} else {
    error_log("DB Error: " . $stmt->error);
    echo json_encode(["status" => "error", "errors" => ["Database error: " . $stmt->error]]);
}

$stmt->close();
$conn->close();
?>
