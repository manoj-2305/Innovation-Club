document.addEventListener("DOMContentLoaded", function() {
    const studentNameElement = document.getElementById("studentName");
    const logoutBtn = document.querySelector(".logout-btn");
    const calendarEl = document.getElementById("attendance-calendar");
    const absentBox = document.getElementById("absentBox");
    const presentBox = document.getElementById("presentBox");
    const attendanceTableContainer = document.getElementById("attendanceTableContainer");
    const attendanceTableBody = document.getElementById("attendanceTableBody");
    const menuButtons = document.querySelectorAll(".menu-btn");
    const menuToggle = document.querySelector(".menu-toggle1");
    const sidebar = document.querySelector(".sidebar");
    const menuItems = document.querySelectorAll(".menu-btn");
    let calendar;

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            fetch("/innovation_club/php/student/student_logout.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                credentials: "include"
            })
            .then(response => response.json())
            .then(data => {
                console.log("Logout Response:", data);
                if (data.status === "success") {
                    window.location.href = data.redirect; // Redirect to login
                } else {
                    alert("Logout failed: " + data.message); // Show error if it fails
                }
            })
            .catch(error => console.error("Logout error:", error));
        });
    }
    menuToggle.addEventListener("click", function () {
        sidebar.classList.toggle("active");
    });

    // Close sidebar when any menu item is clicked
    menuItems.forEach(item => {
        item.addEventListener("click", function () {
            sidebar.classList.remove("active");
        });
    });
    

    function activateTab(tabId) {
        document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
        document.querySelectorAll(".menu-btn").forEach(btn => btn.classList.remove("active"));
        
        document.getElementById(tabId)?.classList.add("active");
        document.querySelector(`[data-tab="${tabId}"]`)?.classList.add("active");

        localStorage.setItem("activeTab", tabId);
    }

    menuButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            activateTab(this.getAttribute("data-tab"));
        });
    });

    activateTab(localStorage.getItem("activeTab") || "overview");

    function fetchAttendance() {
        fetch("/INNOVATION_CLUB/php/student/get_attendance.php")
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    let absentCount = 0;
                    let presentCount = 0;
                    let workingDays = data.attendance.length;
                    let absentDays = [];
                    let presentDays = [];
                    let events = [];

                    data.attendance.forEach(att => {
                        let dayDetails = {
                            year: new Date(att.date).getFullYear(),
                            month: new Date(att.date).toLocaleString("default", { month: "long" }),
                            date: new Date(att.date).getDate(),
                            day: new Date(att.date).toLocaleString("default", { weekday: "long" })
                        };

                        if (att.status.toLowerCase() === "absent") {
                            absentCount++;
                            absentDays.push(dayDetails);
                        } else {
                            presentCount++;
                            presentDays.push(dayDetails);
                        }

                        events.push({
                            title: att.status,
                            start: att.date,
                            className: att.status.toLowerCase() + "-day"
                        });
                    });

                    document.getElementById("workingDays").textContent = workingDays;
                    document.getElementById("absentCount").textContent = absentCount;
                    document.getElementById("presentCount").textContent = presentCount;

                    absentBox.addEventListener("click", () => showTable(absentDays));
                    presentBox.addEventListener("click", () => showTable(presentDays));

                    renderCalendar(events);
                }
            })
            .catch(error => console.error("Error fetching attendance:", error));
    }

    function showTable(days) {
        attendanceTableBody.innerHTML = days.length
            ? days.map(day => `<tr><td>${day.year}</td><td>${day.month}</td><td>${day.date}</td><td>${day.day}</td></tr>`).join("")
            : `<tr><td colspan="4">No records found</td></tr>`;

        attendanceTableContainer.classList.remove("hidden");
    }

    function renderCalendar(events) {
        if (calendarEl) {
            if (!calendar) {
                calendar = new FullCalendar.Calendar(calendarEl, {
                    initialView: "dayGridMonth",
                    height: "auto",
                    events: events,
                    eventContent: function(info) {
                        return { html: `<div class='${info.event.classNames[0]}'>${info.event.title}</div>` };
                    }
                });
                calendar.render();
            } else {
                calendar.removeAllEvents();
                calendar.addEventSource(events);
                calendar.render();
            }
        }
    }

    document.querySelector("[data-tab='attendance']").addEventListener("click", function() {
        setTimeout(() => calendar?.updateSize(), 300);
    });

    fetchAttendance();

    fetch("/INNOVATION_CLUB/php/student/get_student_name.php")
        .then(response => response.json())
        .then(data => studentNameElement.textContent = data.success ? data.name : "Error loading name")
        .catch(error => {
            console.error("Error fetching student name:", error);
            studentNameElement.textContent = "Error loading name";
        });

    fetch("/INNOVATION_CLUB/php/student/get_student_profile.php")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("name").value = data.name;
                document.getElementById("email").value = data.email;
                document.getElementById("reg_no").value = data.reg_no;
                document.getElementById("phno").value = data.phno;
                document.getElementById("year").value = data.year;
                document.getElementById("department").value = data.department;
                studentNameElement.textContent = data.name;
            } else {
                console.error("Error loading profile:", data.message);
            }
        })
        .catch(error => console.error("Error fetching profile:", error));

    const tabs = document.querySelectorAll(".tab-content");
    menuButtons.forEach(button => {
        button.addEventListener("click", function() {
            menuButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            tabs.forEach(tab => tab.classList.remove("active"));
            const tabId = this.getAttribute("data-tab");
            document.getElementById(tabId).classList.add("active");
        });
    });

});