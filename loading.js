// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
    
    // Set a timer for 3 seconds (3000 milliseconds)
    setTimeout(() => {
        // Step 1: Add the fade-out class to the body for a smooth exit
        document.body.classList.add('fade-out');
        
        // Step 2: Wait 500ms for the CSS fade transition to finish, then redirect
        setTimeout(() => {
            // Change 'toggle.html' to whatever page you want to load next
            window.location.href = 'toggle.html'; 
        }, 500); 

    }, 5000); // 3000ms = 3 seconds
});