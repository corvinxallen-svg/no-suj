document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('errorMessage');
    const container = document.querySelector('.container');
    const togglePassword = document.getElementById('togglePassword'); // The new eye icon

    const CORRECT_PASSWORD = "192000"; 

    // --- Show/Hide Password Logic ---
    togglePassword.addEventListener('click', function () {
        // Toggle the input type
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Toggle the eye icon appearance
        if (type === 'text') {
            // Draw an eye with a slash through it (Hidden Mode Indicator)
            this.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `;
        } else {
            // Draw the normal open eye (Visible Mode Indicator)
            this.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `;
        }
    });

    // --- Enter Key Submit Logic ---
    passwordInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const enteredPassword = passwordInput.value;

            if (enteredPassword === CORRECT_PASSWORD) {
                errorMessage.classList.remove('show');
                document.body.classList.add('fade-out');
                
                setTimeout(() => {
                    window.location.href = 'lastbtn.html'; 
                }, 500); 

            } else {
                errorMessage.classList.add('show');
                container.classList.add('shake');
                
                setTimeout(() => {
                    container.classList.remove('shake');
                }, 400);
                
                passwordInput.value = '';
            }
        }
    });
    
    passwordInput.addEventListener('input', () => {
        errorMessage.classList.remove('show');
    });
});