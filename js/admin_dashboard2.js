document.addEventListener("DOMContentLoaded", function () {
    // Password Management Functionality
    const changePasswordBtn = document.getElementById("change_password_btn");
    const forgotPasswordBtn = document.getElementById("forgot_password_btn");
    const changePasswordSection = document.getElementById("change_password_section");
    const newPasswordSection = document.getElementById("new_password_section");
    const forgotPasswordSection = document.getElementById("forgot_password_section");
    const updatePasswordBtn = document.getElementById("update_password"); // Add reference to update password button

    // Show Change Password Section
    changePasswordBtn.addEventListener("click", function () {
        changePasswordSection.style.display = "block";
        forgotPasswordSection.style.display = "none";
        newPasswordSection.style.display = "none";
        document.getElementById("old_password").value = ""; // Clear old password input
        document.getElementById("new_password").value = ""; // Clear new password input
        document.getElementById("confirm_new_password").value = ""; // Clear confirm new password input
    });

    // Show Forgot Password Section
    forgotPasswordBtn.addEventListener("click", function () {
        forgotPasswordSection.style.display = "block";
        changePasswordSection.style.display = "none";
        newPasswordSection.style.display = "none";
        document.getElementById("reset_reg_no").value = ""; // Clear registration number input
    });

    // Function to display messages in the message box
    function displayMessage(message, isError = false) {
        const messageBox = document.getElementById("messageBox");
        messageBox.style.display = "block";
        messageBox.className = isError ? "message-box error-message" : "message-box success-message";
        messageBox.innerText = message;
    }

    // Handle Old Password Verification
    const submitOldPasswordBtn = document.getElementById("submit_old_password");
    submitOldPasswordBtn.addEventListener("click", function () {
        const oldPasswordInput = document.getElementById("old_password").value;
        if (!oldPasswordInput) {
            displayMessage("Old password is required.", true);
            return;
        }
        fetch('/innovation_club/php/admin/manage_password.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'verify', oldPassword: oldPasswordInput })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                newPasswordSection.style.display = "block";
                changePasswordSection.style.display = "none";
                displayMessage("Old password verified successfully.");
            } else {
                displayMessage(data.message, true);
            }
        })
        .catch(error => {
            console.error("Error verifying old password:", error);
            displayMessage("An error occurred while verifying the old password.", true);
        });
    });

    // Handle Update Password
    updatePasswordBtn.addEventListener("click", function () {
        const newPasswordInput = document.getElementById("new_password").value;
        const confirmNewPasswordInput = document.getElementById("confirm_new_password").value;

        if (!newPasswordInput || !confirmNewPasswordInput) {
            displayMessage("Both new password fields are required.", true);
            return;
        }

        if (newPasswordInput !== confirmNewPasswordInput) {
            displayMessage("New passwords do not match.", true);
            return;
        }

        fetch('/innovation_club/php/admin/manage_password.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'update', newPassword: newPasswordInput })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayMessage("Password updated successfully.");
                newPasswordSection.style.display = "none"; // Hide new password section
            } else {
                displayMessage(data.message, true);
            }
        })
        .catch(error => {
            console.error("Error updating password:", error);
            displayMessage("An error occurred while updating the password.", true);
        });
    });

    const sendOtpBtn = document.getElementById("send_otp");
    sendOtpBtn.addEventListener("click", function () {
        const regNoInput = document.getElementById("reset_reg_no").value;
        if (!regNoInput) {
            displayMessage("Registration number is required.", true);
            return;
        }
        fetch('/innovation_club/php/admin/manage_password.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'sendOtp', regNo: regNoInput })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("otpSection").style.display = "block";
                displayMessage("OTP has been sent to your registered email.");
            } else {
                displayMessage(data.message, true);
            }
        })
        .catch(error => {
            console.error("Error sending OTP:", error);
            displayMessage("An error occurred while sending the OTP.", true);
        });
    });

    // Handle OTP Verification
    const verifyOtpBtn = document.getElementById("verifyOtpBtn");
    verifyOtpBtn.addEventListener("click", function () {
        const otpInput = document.getElementById("otpInput").value;
        if (!otpInput) {
            displayMessage("OTP is required.", true);
            return;
        }
        fetch('/innovation_club/php/admin/manage_password.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'verifyOtp', otp: otpInput })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                newPasswordSection.style.display = "block";
                forgotPasswordSection.style.display = "none";
                displayMessage("OTP verified successfully.");
            } else {
                displayMessage(data.message, true);
            }
        })
        .catch(error => {
            console.error("Error verifying OTP:", error);
            displayMessage("An error occurred while verifying the OTP.", true);
        });
    });

    // Recipient Selection Handling
    const recipientType = document.getElementById("recipientType");
    const specificStudentDiv = document.getElementById("specificStudentDiv");
    const yearDiv = document.getElementById("yearDiv");
    const departmentDiv = document.getElementById("departmentDiv");

    function hideAllRecipientOptions() {
        specificStudentDiv.style.display = "none";
        yearDiv.style.display = "none";
        departmentDiv.style.display = "none";
    }

    recipientType.addEventListener("change", function () {
        hideAllRecipientOptions();

        if (recipientType.value === "specific") {
            specificStudentDiv.style.display = "block";
            document.getElementById("studentSearchMain").focus();
        } else if (recipientType.value === "year") {
            yearDiv.style.display = "block";
        } else if (recipientType.value === "department") {
            departmentDiv.style.display = "block";
        }
    });

    // AJAX Search for Students
    const studentSearch = document.getElementById("studentSearchMain");
    const studentResults = document.getElementById("studentResults");

    function fetchStudents() {
        const query = studentSearch.value.trim();
        if (query.length < 1) {
            studentResults.innerHTML = "";
            studentResults.style.display = "none";
            return;
        }

        fetch(`/innovation_club/php/admin/fetch_students_notification.php?q=${query}`)
            .then(response => response.json())
            .then(data => {
                studentResults.innerHTML = "";
                studentResults.style.display = data.length > 0 ? "block" : "none";

                if (data.length === 0) {
                    studentResults.innerHTML = "<div class='search-result-item'>No students found</div>";
                    return;
                }

                data.forEach(student => {
                    const div = document.createElement("div");
                    div.textContent = `${student.name} (${student.reg_no})`;
                    div.classList.add("search-result-item");

                    // Click event to select student
                    div.addEventListener("click", function () {
                        studentSearch.value = student.name; // Set input value
                        studentResults.innerHTML = ""; // Clear dropdown
                        studentResults.style.display = "none"; // Hide dropdown
                    });

                    studentResults.appendChild(div);
                });
            })
            .catch(error => console.error("Error fetching students:", error));
    }

    // Attach input event listener for real-time search
    studentSearch.addEventListener("input", fetchStudents);

    // Fetch and Display Sent Messages
    function loadSentMessages() {
        fetch("/innovation_club/php/admin/fetch_sent_messages.php")
            .then(response => response.json())
            .then(data => {
                const tableBody = document.getElementById("sentMessages");
                tableBody.innerHTML = "";
                if (data.length === 0) {
                    tableBody.innerHTML = "<tr><td colspan='4'>No messages found.</td></tr>";
                    return;
                }
                data.forEach(message => {
                    let row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${message.recipient}</td>
                        <td>${message.subject}</td>
                        <td>${message.message.substring(0, 50)}...</td>
                        <td>${message.date}</td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => console.error("Error loading messages:", error));
    }

    loadSentMessages();
});
