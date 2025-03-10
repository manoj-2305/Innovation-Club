document.addEventListener("DOMContentLoaded", function() {
    const changePasswordBtn = document.getElementById("change_password_btn");
    const forgotPasswordBtn = document.getElementById("forgot_password_btn");
    const passwordContainer = document.querySelector(".password-container");
    const changePasswordSection = document.getElementById("change_password_section");
    const newPasswordSection = document.getElementById("new_password_section");
    const forgotPasswordSection = document.getElementById("forgot_password_section");
    const messageBox = document.getElementById("messageBox");
    
    function showMessageBox(message, isSuccess) {
        let messageBox = document.getElementById("messageBox");
        if (messageBox) {
            messageBox.className = `message-box ${isSuccess ? "success" : "error"}`;
            messageBox.innerText = message;
            messageBox.style.display = "block"; // Ensure it becomes visible
            messageBox.style.opacity = "1"; // Make sure it's fully visible

            setTimeout(() => {
                messageBox.style.opacity = "0";
                setTimeout(() => { messageBox.style.display = "none"; }, 500);
            }, 3000);
        }
    }
    
    function resetSections() {
        changePasswordSection.style.display = "none";
        newPasswordSection.style.display = "none";
        forgotPasswordSection.style.display = "none";
        passwordContainer.innerHTML = `
            <div id="messageBox" class="message-box" style="display: none;"></div>
            <input type="text" id="hashed_password" class="profile-input" value="********" readonly>
            <button id="change_password_btn">Change Password</button>
            <button id="forgot_password_btn">Forgot Password</button>
        `;
        attachEventListeners();
    }
    
    function showChangePasswordFields() {
        passwordContainer.innerHTML = `
            <div id="messageBox" class="message-box" style="display: none;"></div>
            <label for="old_password">Old Password:</label>
            <input type="password" id="old_password" class="profile-input">
            <label for="confirm_old_password">Confirm Old Password:</label>
            <input type="password" id="confirm_old_password" class="profile-input">
            <button id="submit_old_password">Submit</button>
        `;
        attachEventListeners();
    }
    
    function showNewPasswordFields() {
        passwordContainer.innerHTML = `
            <div id="messageBox" class="message-box" style="display: none;"></div>
            <label for="new_password">New Password:</label>
            <input type="password" id="new_password" class="profile-input">
            <label for="confirm_new_password">Confirm New Password:</label>
            <input type="password" id="confirm_new_password" class="profile-input">
            <button id="update_password">Update Password</button>
        `;
        attachEventListeners();
    }
    
    document.addEventListener("click", function(event) {
        if (event.target && event.target.id === "submit_old_password") {
            let oldPassword = document.getElementById("old_password").value;
            let confirmOldPassword = document.getElementById("confirm_old_password").value;

            if (!oldPassword || !confirmOldPassword) {
                showMessageBox("All fields must be entered!", false);
                return;
            }

            if (oldPassword !== confirmOldPassword) {
                showMessageBox("Old passwords do not match!", false);
                return;
            }

            fetch("/innovation_club/php/student/manage_password.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "verify", oldPassword })
            })
            .then(response => response.json())
            .then(data => {
                console.log("Server Response:", data);
                if (data.success) {
                    showMessageBox("Old password verified! Please enter a new password.", true);
                    showNewPasswordFields();
                } else {
                    showMessageBox(data.message || "Incorrect old password!", false);
                }
            })
            .catch(error => {
                console.error("Password verification error:", error);
                showMessageBox("Unexpected error! Check console.", false);
            });
        }
    });
    
    document.addEventListener("click", function(event) {
        if (event.target && event.target.id === "update_password") {
            let newPassword = document.getElementById("new_password").value;
            let confirmNewPassword = document.getElementById("confirm_new_password").value;

            if (!newPassword || !confirmNewPassword) {
                showMessageBox("All fields must be entered!", false);
                return;
            }

            if (newPassword !== confirmNewPassword) {
                showMessageBox("New passwords do not match!", false);
                return;
            }

            fetch("/innovation_club/php/student/manage_password.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "update", newPassword })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessageBox("Password updated successfully!", true);
                    resetSections();
                } else {
                    showMessageBox("Error updating password!", false);
                }
            })
            .catch(error => showMessageBox("Error updating password!", false));
        }
    });
    
    function attachEventListeners() {
        const changePasswordBtn = document.getElementById("change_password_btn");
        const forgotPasswordBtn = document.getElementById("forgot_password_btn");
        
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener("click", showChangePasswordFields);
        }
        
        if (forgotPasswordBtn) {
            forgotPasswordBtn.addEventListener("click", function() {
                // Hide other profile fields
                const profileContainer = document.querySelector(".profile-container");
                profileContainer.style.display = "none";

                // Show the registration number input and send OTP button
                passwordContainer.innerHTML = `
                    <div id="messageBox" class="message-box" style="display: none;"></div>
                    <label for="reset_reg_no">Enter Registration No:</label>
                    <input type="text" id="reset_reg_no" class="profile-input">
                    <button id="send_otp">Send OTP</button>

                    <div id="otpSection" class="otp-container" style="display: none;">
                        <div class="form-group">
                            <input type="text" id="otpInput" placeholder="Enter OTP" required>
                        </div>
                        <button type="button" class="reset-button" id="resendOtpBtn">Resend OTP</button>
                        <button type="button" id="verifyOtpBtn">Verify OTP</button>
                    </div>
                `;

                attachEventListeners();
            });
        }

        // Handle Send OTP button click
        const sendOtpBtn = document.getElementById("send_otp");
        if (sendOtpBtn) {
            sendOtpBtn.addEventListener("click", function() {
                const regNo = document.getElementById("reset_reg_no").value.trim();

                if (!regNo) {
                    showMessageBox("Registration number must be entered!", false);
                    return;
                }

                // Show loading message
                showMessageBox("Sending OTP, please wait...", true);
                
                fetch("/innovation_club/php/student/send_otp.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ regNo })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showMessageBox("OTP sent successfully! Please enter the OTP.", true);
                        document.getElementById("otpSection").style.display = "block"; // Show OTP section
                    } else {
                        showMessageBox(data.message || "Error sending OTP!", false);
                    }
                })
                .catch(error => showMessageBox("Error sending OTP!", false));
            });
        }

        // Handle Verify OTP button click
        const verifyOtpBtn = document.getElementById("verifyOtpBtn");
        if (verifyOtpBtn) {
            verifyOtpBtn.addEventListener("click", function() {
                const otp = document.getElementById("otpInput").value;
                const regNo = document.getElementById("reset_reg_no").value.trim();

                if (!otp) {
                    showMessageBox("OTP must be entered!", false);
                    return;
                }

                fetch("/innovation_club/php/student/verify_otp.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ otp, reg_no: regNo })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showMessageBox("OTP verified! Please enter a new password.", true);
                        showNewPasswordFields();
                    } else {
                        showMessageBox(data.message || "Incorrect OTP!", false);
                    }
                })
                .catch(error => showMessageBox("Error verifying OTP!", false));
            });
        }

        // Handle Resend OTP button click
        const resendOtpBtn = document.getElementById("resendOtpBtn");
        if (resendOtpBtn) {
            resendOtpBtn.addEventListener("click", function() {
                const regNo = document.getElementById("reset_reg_no").value.trim();

                if (!regNo) {
                    showMessageBox("Registration number must be entered!", false);
                    return;
                }

                fetch("/innovation_club/php/student/send_otp.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ regNo })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showMessageBox("OTP resent successfully! Please check your email.", true);
                        showMessageBox(data.message || "Error resending OTP!", false);
                    }
                })
                .catch(error => showMessageBox("Error resending OTP!", false));
            });
        }


        // Handle OTP submission
        const submitOtpBtn = document.getElementById("submit_otp");
        if (submitOtpBtn) {
            console.log("Submit OTP button found:", submitOtpBtn); // Debugging log
            submitOtpBtn.addEventListener("click", function() {
                const otp = document.getElementById("otp").value;
                console.log("OTP submitted:", otp); // Debugging log
                console.log("Registration number:", document.getElementById("reset_reg_no").value.trim()); // Debugging log

                if (!otp) {
                    showMessageBox("OTP must be entered!", false);
                    return;
                }

                fetch("/innovation_club/php/student/verify_otp.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ otp, reg_no: document.getElementById("reset_reg_no").value.trim() })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showMessageBox("OTP verified! Please enter a new password.", true);
                        showNewPasswordFields();
                    } else {
                        showMessageBox(data.message || "Incorrect OTP!", false);
                    }
                })
                .catch(error => showMessageBox("Error verifying OTP!", false));
            });
        }
    }

    attachEventListeners();
});
