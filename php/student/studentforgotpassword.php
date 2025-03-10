<?php
require_once '../../database/db_connect.php';
require '../../PHPMailer/src/PHPMailer.php';
require '../../PHPMailer/src/SMTP.php';
require '../../PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$file = 'error_log.txt'; // Log file

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    file_put_contents($file, "Received data: " . json_encode($data) . "\n", FILE_APPEND);

    $reg_no = $data['reg_no'] ?? '';

    if (empty($reg_no)) {
        file_put_contents($file, "Missing Registration Number\n", FILE_APPEND);
        echo json_encode(['success' => false, 'error' => 'Please enter your registration number']);
        exit;
    }

    // ✅ Step 1: Check if Registration Number Exists
    $stmt = $conn->prepare("SELECT email FROM student WHERE reg_no = ?");
    $stmt->bind_param("s", $reg_no);
    $stmt->execute();
    $result = $stmt->get_result();
    $student = $result->fetch_assoc();

    if (!$student) {
        file_put_contents($file, "Registration Number Not Found\n", FILE_APPEND);
        echo json_encode(['success' => false, 'error' => 'Registration number not found']);
        exit;
    }

    $email = $student['email']; // Get student's registered email

    if ($data['action'] === 'sendOtp') {
        // ✅ Step 2: Generate OTP and Save to Database
        $otp = rand(100000, 999999);
        $timestamp = date('Y-m-d H:i:s');

        $stmt = $conn->prepare("UPDATE student SET otp = ?, otp_timestamp = ? WHERE reg_no = ?");
        $stmt->bind_param("sss", $otp, $timestamp, $reg_no);

        if ($stmt->execute()) {
            file_put_contents($file, "OTP Updated for Student\n", FILE_APPEND);
            
            $mail = new PHPMailer(true);
            try {
                $mail->isSMTP();
                $mail->Host = 'smtp.gmail.com';
                $mail->SMTPAuth = true;
                $mail->Username = 'innovationclubtu@gmail.com'; // Change this
                $mail->Password = 'gbqtcjsvsssvcurj'; // Change this
                $mail->SMTPSecure = 'tls';
                $mail->Port = 587;
                $mail->setFrom('noreply@takshashilauniv.ac.in', 'Takshashila Innovation Club');
                $mail->addAddress($email);
                $mail->isHTML(true);
                $mail->Subject = 'Takshashila University - OTP Verification';

                // ✅ Professional Email Template
                $mail->Body = "
                <html>
                <head>
                    <style>
                        .email-container {
                            font-family: Arial, sans-serif;
                            background-color: #f9f9f9;
                            padding: 20px;
                            border-radius: 10px;
                            text-align: center;
                            max-width: 500px;
                            margin: auto;
                            border: 1px solid #ddd;
                        }
                        .email-header {
                            font-size: 20px;
                            font-weight: bold;
                            color: #333;
                        }
                        .otp {
                            font-size: 24px;
                            font-weight: bold;
                            color: rgb(226, 103, 22);
                            background: #ffebcd;
                            padding: 12px;
                            display: inline-block;
                            border-radius: 5px;
                            margin-top: 10px;
                        }
                        .footer {
                            margin-top: 20px;
                            font-size: 12px;
                            color: #888;
                        }
                    </style>
                </head>
                <body>
                    <div class='email-container'>
                        <h2 class='email-header'>Takshashila University - Innovation Club</h2>
                        <p>Dear Student,</p>
                        <p>You have requested to reset your password. Use the OTP below to proceed:</p>
                        <p class='otp'>$otp</p>
                        <p>This OTP is valid for <strong>10 minutes</strong>.</p>
                        <p>If you did not request this, please ignore this email.</p>
                        <p class='footer'>This is an automated email. Please do not reply.</p>
                    </div>
                </body>
                </html>";

                if ($mail->send()) {
                    file_put_contents($file, "Student OTP Email Sent\n", FILE_APPEND);
                    echo json_encode(['success' => true]);
                } else {
                    file_put_contents($file, "Student Email Sending Failed\n", FILE_APPEND);
                    echo json_encode(['success' => false, 'error' => 'Mail sending failed']);
                }

            } catch (Exception $e) {
                file_put_contents($file, "Mail error: " . $e->getMessage() . "\n", FILE_APPEND);
                echo json_encode(['success' => false, 'error' => 'Mail error: ' . $e->getMessage()]);
            }

        } else {
            file_put_contents($file, "Student Database Update Failed\n", FILE_APPEND);
            echo json_encode(['success' => false, 'error' => 'Database error']);
        }

    } elseif ($data['action'] === 'verifyOtp') {
        $otp = $data['otp'] ?? '';

        $stmt = $conn->prepare("SELECT otp, otp_timestamp FROM student WHERE reg_no = ?");
        $stmt->bind_param("s", $reg_no);
        $stmt->execute();
        $result = $stmt->get_result();
        $student = $result->fetch_assoc();

        if ($student && $student['otp'] == $otp) {
            if (time() - strtotime($student['otp_timestamp']) > 600) {
                echo json_encode(['success' => false, 'error' => 'OTP expired']);
            } else {
                echo json_encode(['success' => true]);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'Invalid OTP']);
        }

    } elseif ($data['action'] === 'changePassword') {
        $newPassword = password_hash($data['newPassword'], PASSWORD_DEFAULT);

        $stmt = $conn->prepare("UPDATE student SET password = ? WHERE reg_no = ?");
        $stmt->bind_param("ss", $newPassword, $reg_no);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Password update failed']);
        }
    }
}
?>
