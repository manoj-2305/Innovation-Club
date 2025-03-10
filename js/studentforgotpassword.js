document.addEventListener("DOMContentLoaded", function () {
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const resendOtpBtn = document.getElementById('resendOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const changePasswordBtn = document.getElementById('changePasswordBtn');

    const regNoInput = document.getElementById('regNoInput'); // Student Registration Number
    const otpInput = document.getElementById('otpInput');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    const forgotPasswordForm = document.getElementById('forgotPasswordForm'); // Hide this
    const otpSection = document.getElementById('otpSection'); // Show this
    const newPasswordSection = document.getElementById('newPasswordSection');
    const messageBox = document.getElementById('messageBox');

    function showMessage(message, type) {
        messageBox.innerHTML = message;
        messageBox.className = `message-box ${type}`;
    }

    function sendOtp() {
        const reg_no = regNoInput.value.trim();

        if (!reg_no) {
            showMessage("Please enter your registration number.", "error");
            return;
        }

        sendOtpBtn.disabled = true;

        fetch('/INNOVATION_CLUB/php/student/studentforgotpassword.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reg_no: reg_no, action: 'sendOtp' })
        })
        .then(response => response.json())
        .then(data => {
            sendOtpBtn.disabled = false;
            if (data.success) {
                showMessage("OTP has been sent to your registered email.", "success");
                forgotPasswordForm.style.display = 'none';
                otpSection.style.display = 'block';
                resendOtpBtn.style.display = 'block';
            } else {
                showMessage(data.error || 'Error sending OTP', "error");
            }
        })
        .catch(error => {
            sendOtpBtn.disabled = false;
            console.error("Error:", error);
            showMessage("Something went wrong.", "error");
        });
    }

    // ✅ Allow pressing Enter to submit the form
    document.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent default form submission behavior

            if (document.activeElement === regNoInput) {
                sendOtp();
            } else if (document.activeElement === otpInput) {
                verifyOtpBtn.click();
            } else if (document.activeElement === newPasswordInput || document.activeElement === confirmPasswordInput) {
                changePasswordBtn.click();
            }
        }
    });

    sendOtpBtn.addEventListener('click', sendOtp);
    resendOtpBtn.addEventListener('click', sendOtp);

    verifyOtpBtn.addEventListener('click', () => {
        fetch('/INNOVATION_CLUB/php/student/studentforgotpassword.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reg_no: regNoInput.value, otp: otpInput.value, action: 'verifyOtp' })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage("OTP Verified! Enter a new password.", "success");
                otpSection.style.display = 'none';
                newPasswordSection.style.display = 'block';
            } else {
                showMessage(data.error || 'Invalid OTP', "error");
            }
        });
    });

    changePasswordBtn.addEventListener('click', () => {
        if (newPasswordInput.value !== confirmPasswordInput.value) {
            showMessage('Passwords do not match.', "error");
            return;
        }

        fetch('/INNOVATION_CLUB/php/student/studentforgotpassword.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reg_no: regNoInput.value, newPassword: newPasswordInput.value, action: 'changePassword' })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage('Password changed successfully. Redirecting to login...', "success");
                setTimeout(() => { window.location.href = 'login.html'; }, 3000);
            } else {
                showMessage(data.error || 'Error changing password', "error");
            }
        });
    });
});
