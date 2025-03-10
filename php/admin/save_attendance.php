<?php
include '../../database/db_connect.php'; // Include the database connection

header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Handle GET Request - Fetch Attendance Data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $year = $_GET['year'] ?? null;
    $date = $_GET['date'] ?? null;

    if (!$year || !$date) {
        echo json_encode(["status" => "error", "message" => "Year and date are required"]);
        exit;
    }

    $sql = "SELECT s.id, s.name, s.reg_no, s.department, 
                   COALESCE(a.status, 'absent') AS status
            FROM student s
            LEFT JOIN attendance a ON s.id = a.student_id AND a.date = ?
            WHERE s.year = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $date, $year);
    $stmt->execute();
    $result = $stmt->get_result();

    $students = [];
    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }

    $stmt->close();
    echo json_encode($students);
    exit;
}

// Handle POST Request - Save or Update Attendance Data
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data['year']) || !isset($data['date']) || !isset($data['attendance'])) {
        echo json_encode(["status" => "error", "message" => "Invalid data received"]);
        exit;
    }

    $year = $data['year'];
    $date = $data['date'];
    $attendance = $data['attendance'];

    // Ensure the attendance table exists with a UNIQUE constraint
    $sql = "CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        date DATE NOT NULL,
        status ENUM('present', 'absent') NOT NULL,
        UNIQUE KEY unique_attendance (student_id, date),
        FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE
    )";
    $conn->query($sql);

    // Insert or Update Attendance
    foreach ($attendance as $entry) {
        $student_id = $entry['student_id'] ?? null;
        $status = $entry['status'] ?? null;

        if (!empty($student_id) && !empty($status)) {
            $check_sql = "SELECT id FROM attendance WHERE student_id = ? AND date = ?";
            $check_stmt = $conn->prepare($check_sql);
            $check_stmt->bind_param("is", $student_id, $date);
            $check_stmt->execute();
            $check_stmt->store_result();

            if ($check_stmt->num_rows > 0) {
                $update_stmt = $conn->prepare("UPDATE attendance SET status = ? WHERE student_id = ? AND date = ?");
                $update_stmt->bind_param("sis", $status, $student_id, $date);
                $update_stmt->execute();
                $update_stmt->close();
            } else {
                $insert_stmt = $conn->prepare("INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)");
                $insert_stmt->bind_param("iss", $student_id, $date, $status);
                $insert_stmt->execute();
                $insert_stmt->close();
            }
            $check_stmt->close();
        }
    }

    echo json_encode(["status" => "success", "message" => "Attendance updated successfully"]);
    exit;
}

$conn->close();
?>
