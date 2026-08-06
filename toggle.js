document.addEventListener("DOMContentLoaded", () => {
    // Grab the toggle switch by its ID
    const toggleSwitch = document.getElementById('switch');

    // Listen for when the user clicks the switch
    toggleSwitch.addEventListener('change', function() {
        
        // Check if the switch is turned ON
        if (this.checked) {
            
            // Wait 600ms to let the heart CSS animation finish playing
            setTimeout(() => {
                
                // Trigger the fade-out effect on the body
                document.body.classList.add('fade-out');
                
                // Your toggle.html CSS has a 1 second (1000ms) fade transition.
                // Wait exactly 1 second, then redirect to the loading page.
                setTimeout(() => {
                    window.location.href = 'password.html';
                }, 1000);
                
            }, 600); // 600ms delay before fading
        }
    });
});