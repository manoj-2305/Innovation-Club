<?php
session_start();
include '../../database/db_connect.php'; // Ensure this points to your DB connection file

// Check if the session exists
if (!isset($_SESSION['admin_id'])) {
    header("Location: ../login.html"); // Redirect if session does not exist
    exit();
}

$admin_id = $_SESSION['admin_id'];

// Query to check login_status from the database
$sql = "SELECT login_status FROM admin WHERE admin_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $admin_id);
$stmt->execute();
$stmt->bind_result($login_status);
$stmt->fetch();
$stmt->close();

// If login_status is "close", redirect to login page
if ($login_status !== 'open') {
    session_unset();
    session_destroy();
    header("Location: ../login.html");
    exit();
}

// Prevent browser caching after logout
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Innovation Club</title>
    <link rel="stylesheet" href="/innovation_club/css/style1.css">
    <link rel="stylesheet" href="/innovation_club/css/admin-dashboard.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="dashboard-body">
    <button class="menu-toggle2">☰</button>
    <nav class="sidebar">
        <div class="sidebar-header">
            <label for="adminProfileUpload">
                <img id="adminProfile" src="../img/avatar.png" alt="Admin Avatar" class="avatar">
            </label>
            <input type="file" id="adminProfileUpload" style="display: none;" accept="image/*">
            <h3 class="user-name" id="adminName">Loading...</h3>

            <p class="user-role">Administrator</p>
        </div>
        <ul class="sidebar-menu">
            <li class="active" data-tab="overview">Overview</li>
            <li data-tab="students">Students
                <ul class="submenu">
                    <li data-tab="addStudents">Add Students</li>
                    <li data-tab="manageStudents">Manage Students</li>
                    <li data-tab="attendance">Attendance</li>
                </ul>
            </li>
            <li data-tab="inbox">INBOX
                <ul class="submenu">
                    <li data-tab="inboxMessages">Inbox</li>
                    <li data-tab="sendNotification">Send Notification</li>
                </ul>
            </li>
        </ul>
        <button class="logout-btn">Logout</button>
    </nav>

    <main class="dashboard-main">
        <div class="tab-content active" id="overview">
            <h2>Dashboard Overview</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Total Students</h3>
                    <div class="stat-value" id="studentCount">Loading...</div> <!-- ✅ Correct ID -->
                </div>
                <div class="stat-card">
                    <h3>Assignments Given</h3>
                    <div class="stat-value">0</div>
                </div>
                <div class="stat-card">
                    <h3>Upcoming Events</h3>
                    <div class="stat-value">0</div>
                </div>
            </div>
        </div>
        
        <div class="tab-content" id="addStudents">
            <h2>Add Student</h2>
            
            <!-- Button to Open Popup -->
            <button id="openStudentForm" class="open-popup-btn">+ Add Student</button>
        
            <!-- Student Form Popup -->
            <div id="studentPopup" class="popup-container hidden">
                <div class="popup-box">
                    <h3>Add New Student</h3>
                    <div id="messageBox"></div>
                    <div class="popup-content">
                        <form id="studentForm">
                            <label for="studentName">Name:</label>
                            <input type="text" id="studentName" name="studentName" required>
        
                            <label for="regNo">Reg No:</label>
                            <input type="text" id="regNo" name="regNo" required>
        
                            <label for="year">Year:</label>
                            <input type="text" id="year" name="year" required>
        
                            <label for="department">Department:</label>
                            <input type="text" id="department" name="department" required>
        
                            <label for="email">Email:</label>
                            <input type="email" id="email" name="email" required>
        
                            <label for="password">Password:</label>
                            <input type="password" id="password" name="password" required>
        
                            <button type="submit" class="submit-btn">Submit</button>
                        </form>
                    </div>
                    <button type="button" id="closeStudentForm" class="close-popup-btn">Cancel</button>
                </div>
            </div>
        
            <!-- Recently Added Students -->
            <h3>Recently Added Students</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Reg No</th>
                            <th>Year</th>
                            <th>Department</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody id="recentStudentsTable"></tbody>
                </table>
            </div>
        </div>
        

        <div class="tab-content" id="manageStudents">
            <h2>Manage Students</h2>
            <div class="search-bar">
                <input type="text"id="studentSearch" placeholder="Search students...">
            </div>
            <div class="filter-container">
                <button class="categories-btn" id="toggleFilter">Filter By</button>
                <div id="filterOptions" class="filter-options">
                    <select id="filterYear">
                        <option value="">All Years</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                    </select>
        
                    <select id="filterDepartment">
                        <option value="">All Departments</option>
                        <option value="BTECH CSE(GENERAL)">CSE</option>
                        <option value="BTECH CSE(CS)">CYBER SECURITY</option>
                        <option value="BTECH ECE">ECE</option>
                        <option value="BTECH CSE(AIML)-A">BTECH CSE(AIML)-A</option>
                        <option value="BTECH CSE(AIML)-B">BTECH CSE(AIML)-B</option>
                        <option value="BTECH CSE(AIDS)-A">BTECH CSE(AIDS)-A</option>
                        <option value="BTECH CSE(AIDS)-B">BTECH CSE(AIDS)-B</option>
                        <option value="AHS">AHS</option>
                        <option value="AGRICULTURE">AGRICULTURE</option>
                        <option value="PHARMACY">PHARMACY</option>
                    </select>
                </div>
            </div>
            <div id="messageContainer">
                <div id="successMessage" class="message-box success-message" style="display: none;">
                    <p id="successText"></p>
                </div>
                <div id="errorMessage" class="message-box error-message" style="display: none;">
                    <p id="errorText"></p>
                </div>
            </div>
        
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Reg No</th>
                            <th>Year</th>
                            <th>Department</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="manageStudentsTable">

                    </tbody>
                </table>
            </div>
        </div>

        <div class="tab-content" id="attendance">
            <h2>Attendance</h2>
            <div class="attendance-filters">
                <label for="yearSelect">Student Year:</label>
                <select id="yearSelect">
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                </select>
        
                <label for="attendanceDate">Date:</label>
                <input type="date" id="attendanceDate">
                <button id="searchAttendance">Search</button>
            </div>
            <div id="attendanceMessageBox" class="attendance-status"></div>


            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Reg No</th>
                            <th>Department</th>
                            <th>Present</th>
                            <th>Absent</th>
                        </tr>
                    </thead>
                    <tbody id="attendanceTable">
                        <!-- Student list will be dynamically populated -->
                    </tbody>
                </table>
            </div>
            <button id="saveAttendance">Submit Attendance</button>
        </div>
        <div class="tab-content" id="inboxMessages">
            <div class="inbox-header1">
                <h2>Inbox</h2>
            </div>

            <!-- Sent Messages Table -->
            <div id="sentMessagesContainer">
                <table class="inbox-table1">
                    <thead>
                        <tr>
                            <th>To</th>
                            <th>Subject</th>
                            <th>Message</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody id="sentMessages">
                        <!-- Sent messages will be dynamically loaded here -->
                    </tbody>
                </table>
            </div>
        </div>

        <div class="tab-content" id="sendNotification">
            <div class="inbox-header1">
                <h2>Send Notification</h2>
            </div>

            <form id="sendMessageForm" enctype="multipart/form-data">
                <label for="recipientType">Send To:</label>
                <select id="recipientType" name="recipientType">
                    <option value="all">All Students</option>
                    <option value="specific">Specific Student</option>
                    <option value="year">By Year</option>
                    <option value="department">By Department</option>
                </select>

                <div id="specificStudentDiv" style="display: none; position: relative;">
                    <label for="studentSearchMain">Search Student:</label>
                    <div style="display: flex; gap: 5px;">
                        <input type="text" id="studentSearchMain" name="studentSearch" placeholder="Enter Student Name or Reg No">
                        <button id="searchStudentBtn" class="btn-search">Search</button>
                    </div>
                    <div id="studentResults"></div>  <!-- Dropdown appears here -->
                </div>
                <div id="yearDiv" style="display: none;">
                    <label for="yearSelect">Select Year:</label>
                    <select id="yearSelect" name="yearSelect">
                        <option value="1st">1st Year</option>
                        <option value="2nd">2nd Year</option>
                        <option value="3rd">3rd Year</option>
                        <option value="4th">4th Year</option>
                    </select>
                </div>

                <div id="departmentDiv" style="display: none;">
                    <label for="departmentSelect">Select Department:</label>
                    <select id="departmentSelect" name="departmentSelect">
                        <option value="CSE">Computer Science</option>
                        <option value="ECE">Electronics</option>
                        <option value="ME">Mechanical</option>
                        <option value="EE">Electrical</option>
                    </select>
                </div>

                <label for="emailSubject">Subject:</label>
                <input type="text" id="emailSubject" name="emailSubject" required>

                <label for="emailMessage">Message:</label>
                <textarea id="emailMessage" name="emailMessage" required></textarea>

                <label for="emailAttachment">Attachments:</label>
                <input type="file" id="emailAttachment" name="emailAttachment" multiple>

                <button type="submit" class="btn btn-success">Send</button>
            </form>
        </div>
    </main>

    <script src="/innovation_club/js/admin_dashboard.js"></script>
    <script src="/innovation_club/js/admin_dashboard1.js"></script>
    <script src="/innovation_club/js/admin_dashboard2.js"></script>
</body>
</html>