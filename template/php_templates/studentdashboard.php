<?php
session_start();
include '../../database/db_connect.php'; 

if (!isset($_SESSION['reg_no'])) {
    header("Location: ../login.html");
    exit();
}

$reg_no = $_SESSION['reg_no'];

// ✅ Query the database to check `login_status`
$sql = "SELECT login_status FROM student WHERE reg_no = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $reg_no);
$stmt->execute();
$stmt->bind_result($login_status);
$stmt->fetch();
$stmt->close();

// ✅ If `login_status` is "close", redirect to login page
if ($login_status !== 'open') {
    session_unset();
    session_destroy();
    header("Location: ../login.html");
    exit();
}

// ✅ Prevent browser caching after logout
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");
?>

<!DOCTYPE html> 
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - CSMS</title>
    <link rel="stylesheet" href="/innovation_club/css/style1.css">
    <link rel="stylesheet" href="/innovation_club/css/student_dashboard.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.js"></script>
</head>
<body class="dashboard-body">
    <!-- Small Menu Button for Mobile -->
    <button class="menu-toggle1">☰</button>

    <nav class="sidebar">
        <div class="sidebar-header">
            <img src="img/avatar.png" alt="User Avatar" class="avatar">
            <h3 class="user-name" id="studentName">Loading...</h3>
            <p class="user-role">Student</p>
        </div>
        <ul class="sidebar-menu">
            <li class="menu-btn active" data-tab="overview">Overview</li>
            <li class="menu-btn" data-tab="attendance">Attendance</li>
            <li class="menu-btn" data-tab="assignments">Assignments</li>
            <li class="menu-btn" data-tab="profile">Profile</li>
        </ul>
        <button class="logout-btn">Logout</button>
    </nav>


    <main class="dashboard-main">
        <div class="tab-content active" id="overview">
            <h2>Dashboard Overview</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Attendance</h3>
                    <div class="chart-container">
                        <canvas id="attendanceChart"></canvas>
                    </div>
                </div>
                
                <div class="stat-card">
                    <h3>Upcoming Assignments</h3>
                    <ul class="assignment-list">
                        <li>
                            <span class="assignment-title">Mathematics Project</span>
                            <span class="due-date">Due: 2024-02-15</span>
                        </li>
                        <li>
                            <span class="assignment-title">Physics Lab Report</span>
                            <span class="due-date">Due: 2024-02-18</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="tab-content" id="attendance">
            <h2>Attendance Record</h2>
        
            <!-- Stats Box -->
            <div class="attendance-stats">
                <div class="stat-card">
                    <h3>Working Days</h3>
                    <div class="stat-value" id="workingDays">0</div>
                </div>
                <div class="stat-card clickable" id="absentBox">
                    <h3>Absent Days</h3>
                    <div class="stat-value" id="absentCount">0</div>
                </div>
                <div class="stat-card clickable" id="presentBox">
                    <h3>Present Days</h3>
                    <div class="stat-value" id="presentCount">0</div>
                </div>
            </div>
        
            <!-- Attendance Table (Initially Hidden) -->
            <div id="attendanceTableContainer" class="hidden">
                <table class="attendance-table">
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>Month</th>
                            <th>Date</th>
                            <th>Day</th>
                        </tr>
                    </thead>
                    <tbody id="attendanceTableBody"></tbody>
                </table>
            </div>
        
            <!-- Calendar -->
            <div id="attendance-calendar"></div>
        </div>
        

        <div class="tab-content" id="assignments">
            <h2>Assignments</h2>
            <div class="assignments-grid"></div>
        </div>

        <div class="tab-content" id="profile">
            <h2>Student Profile</h2>
            <div class="profile-container">
                <div>
                    <label for="name">Name:</label>
                    <input type="text" id="name" class="profile-input" readonly>
                </div>
                <div>
                    <label for="email">Email:</label>
                    <input type="email" id="email" class="profile-input" readonly>
                </div>
                <div>
                    <label for="reg_no">Registration No:</label>
                    <input type="text" id="reg_no" class="profile-input" readonly>
                </div>
                <div>
                    <label for="year">Year:</label>
                    <input type="text" id="year" class="profile-input" readonly>
                </div>
                <div class="full-width">
                    <label for="department">Department:</label>
                    <input type="text" id="department" class="profile-input" readonly>
                </div>
            </div>
        </div>
        
    </main>
    <script src="/innovation_club/js/student_dashboard.js"></script>      
</body>
</html>