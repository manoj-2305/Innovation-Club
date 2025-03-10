document.addEventListener("DOMContentLoaded", function () {
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const resendOtpBtn = document.getElementById('resendOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const changePasswordBtn = document.getElementById('changePasswordBtn');

    const emailInput = document.getElementById('emailInput');
    const otpInput = document.getElementById('otpInput');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    const forgotPasswordForm = document.getElementById('forgotPasswordForm'); // Hide this
    const otpSection = document.getElementById('otpSection'); // Show this
    const newPasswordSection = document.getElementById('newPasswordSection');
    const messageBox = document.getElementById('messageBox');

    function showMessage(message, type) {
        messageBox.innerHTML = message;
        messageBox.className = `message-box ${type}`; // Apply success/error class
    }
    

    function sendOtp() {
        const email = emailInput.value.trim();

        if (!email) {
            showMessage("Please enter a valid email.", "error");
            return;
        }

        sendOtpBtn.disabled = true;

        fetch('/INNOVATION_CLUB/php/admin/adminforgotpassword.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, action: 'sendOtp' })
        })
        .then(response => response.json())
        .then(data => {
            sendOtpBtn.disabled = false;
            if (data.success) {
                showMessage("OTP has been sent to your email.", "success");

                // ✅ HIDE email input & "Send OTP" button
                forgotPasswordForm.style.display = 'none';

                // ✅ SHOW OTP input section
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

    sendOtpBtn.addEventListener('click', sendOtp);
    resendOtpBtn.addEventListener('click', sendOtp);

    verifyOtpBtn.addEventListener('click', () => {
        fetch('/INNOVATION_CLUB/php/admin/adminforgotpassword.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput.value, otp: otpInput.value, action: 'verifyOtp' })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage("OTP Verified! Enter a new password.", "success");

                // ✅ HIDE OTP input section
                otpSection.style.display = 'none';

                // ✅ SHOW Password reset section
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

        fetch('/INNOVATION_CLUB/php/admin/adminforgotpassword.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput.value, newPassword: newPasswordInput.value, action: 'changePassword' })
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
