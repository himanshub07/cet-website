document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const userData = {
        name: this.name.value.trim(),
        email: this.email.value.trim(),
        phone: this.phone.value.trim(),
        password: this.password.value.trim()
    };

    // Save user data to localStorage
    localStorage.setItem('userRegistration', JSON.stringify(userData));

    // Redirect to user information page
    window.location.href = 'cutoff.html';
});

// Toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const notificationsToggle = document.getElementById('notificationsToggle');
    const soundToggle = document.getElementById('soundToggle');

    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.style.background = 'linear-gradient(135deg, #1e1e1e 0%, #121212 100%)';
            document.body.style.color = '#eee';
        } else {
            document.body.style.background = 'linear-gradient(135deg, #6b73ff 0%, #000dff 100%)';
            document.body.style.color = '#333';
        }
    });

    notificationsToggle.addEventListener('change', function() {
        if (this.checked) {
            alert('Notifications enabled');
        } else {
            alert('Notifications disabled');
        }
    });

    soundToggle.addEventListener('change', function() {
        if (this.checked) {
            alert('Sound effects enabled');
        } else {
            alert('Sound effects disabled');
        }
    });
});
