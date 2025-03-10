document.addEventListener('DOMContentLoaded', () => {
    // Tab switching functionality
    const loginTabs = document.querySelectorAll('.login-tab');
    const loginForms = document.querySelectorAll('.login-form');
    const forms = document.querySelectorAll('form');

    function activateTab(role) {
        loginTabs.forEach(tab => tab.classList.remove('active'));
        loginForms.forEach(form => form.classList.remove('active'));

        const tab = document.querySelector(`.login-tab[data-form="${role}Login"]`);
        const form = document.getElementById(`${role}Login`);

        if (tab && form) {
            tab.classList.add('active');
            form.classList.add('active');
        }
    }

    // Get role from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role');
    if (role === 'admin' || role === 'student') {
        activateTab(role);
    }

    loginTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            activateTab(tab.getAttribute('data-form').replace('Login', ''));
        });
    });

    // Form submission
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const formId = form.id;

            let loginUrl;
            if (formId === 'adminLogin') {
                loginUrl = '/INNOVATION_CLUB/php/admin/admin_login.php';
            } else if (formId === 'studentLogin') {
                loginUrl = '/INNOVATION_CLUB/php/student/student_login.php';
            } else {
                showError(form, 'Invalid login form.');
                return;
            }

            try {
                const response = await fetch(loginUrl, {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                if (result.status === 'success') {
                    window.location.href = result.redirect;
                } else {
                    showError(form, result.message || 'Invalid credentials.');
                }
            } catch (err) {
                showError(form, 'An error occurred. Please try again.');
            }
        });
    });

    // Show error message dynamically
    function showError(form, message) {
        const error = form.querySelector('.form-error');
        if (!error) return;
        error.textContent = message;
        error.style.display = 'block';
        error.style.color = '#fff';  // White text for better contrast
        error.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';  // Bright red with slight transparency
        error.style.padding = '10px';
        error.style.borderRadius = '5px';
        error.style.marginTop = '10px';
        error.style.textAlign = 'center';
        error.style.fontWeight = 'bold';
        error.style.boxShadow = '0 4px 10px rgba(255, 0, 0, 0.6)';  // Optional shadow for extra pop
    }
});
