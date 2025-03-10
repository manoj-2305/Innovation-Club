document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("searchAttendance").addEventListener("click", fetchAttendance);
    document.getElementById("saveAttendance").addEventListener("click", saveAttendance);
});

function showAttendanceMessage(message, type) {
    const messageBox = document.getElementById("attendanceMessageBox");
    messageBox.innerHTML = message;
    messageBox.className = type === "error" ? "error-message" : "success-message";
    messageBox.style.display = "block";
    setTimeout(() => messageBox.style.display = "none", 3000);
}

function fetchAttendance() {
    const year = document.getElementById("yearSelect").value;
    const date = document.getElementById("attendanceDate").value;

    if (!year || !date) {
        showAttendanceMessage("Please select both year and date.", "error");
        return;
    }

    fetch(`/INNOVATION_CLUB/php/admin/save_attendance.php?year=${year}&date=${date}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("attendanceTable");
            tableBody.innerHTML = "";

            if (!Array.isArray(data) || data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="5">No students found.</td></tr>`;
                return;
            }

            const controlRow = document.createElement("tr");
            controlRow.innerHTML = `
                <td colspan="3"><strong>Set all members:</strong></td>
                <td colspan="2">
                    <button type="button" id="setAllPresent" class="btn">Set All as Present</button>
                    <button type="button" id="setAllAbsent" class="btn">Set All as Absent</button>
                </td>
            `;
            tableBody.appendChild(controlRow);

            data.forEach(student => {
                let presentChecked = student.status === "present" ? "checked" : "";
                let absentChecked = student.status === "absent" ? "checked" : "";

                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${student.name}</td>
                    <td>${student.reg_no}</td>
                    <td>${student.department}</td>
                    <td><input type="radio" name="attendance_${student.id}" value="present" ${presentChecked}></td>
                    <td><input type="radio" name="attendance_${student.id}" value="absent" ${absentChecked}></td>
                `;
                tableBody.appendChild(row);
            });

            document.getElementById("setAllPresent").addEventListener("click", () => setAllAttendance("present"));
            document.getElementById("setAllAbsent").addEventListener("click", () => setAllAttendance("absent"));
        })
        .catch(error => {
            console.error("Error fetching attendance:", error);
            showAttendanceMessage("Failed to load attendance data. Please try again.", "error");
        });
}

function setAllAttendance(status) {
    document.querySelectorAll("#attendanceTable tr input[type=radio]").forEach(radio => {
        if (radio.value === status) {
            radio.checked = true;
        }
    });
}

function saveAttendance() {
    const year = document.getElementById("yearSelect").value;
    const date = document.getElementById("attendanceDate").value;

    if (!year || !date) {
        showAttendanceMessage("Please select both year and date before submitting attendance.", "error");
        return;
    }

    const attendanceData = [];
    document.querySelectorAll("#attendanceTable tr").forEach(row => {
        const radios = row.querySelectorAll("input[type=radio]");
        if (radios.length > 0) {
            const studentId = radios[0].name.split("_")[1];
            const presentRadio = row.querySelector(`input[name=attendance_${studentId}][value=present]`);
            const status = presentRadio.checked ? "present" : "absent";

            attendanceData.push({ student_id: studentId, status });
        }
    });

    if (attendanceData.length === 0) {
        showAttendanceMessage("No attendance records found to save.", "error");
        return;
    }

    fetch("/INNOVATION_CLUB/php/admin/save_attendance.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, date, attendance: attendanceData })
    })
    .then(response => response.json())
    .then(data => {
        showAttendanceMessage(data.message || "Attendance saved successfully!", "success");
        fetchAttendance();
    })
    .catch(error => {
        console.error("Error saving attendance:", error);
        showAttendanceMessage("Failed to save attendance. Please try again.", "error");
    });
}
document.addEventListener("DOMContentLoaded", function () {
    fetch("/INNOVATION_CLUB/php/admin/fetch_admin.php")
        .then(response => response.json())
        .then(data => {
            document.getElementById("adminName").textContent = data.adminname || "Admin";
        })
        .catch(error => console.error("Error loading admin name:", error));
});
