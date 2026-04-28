// Initialize Lucide Icons
lucide.createIcons();

// State Mock
let currentScenarioID = null;

// Ripple effect for buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mousedown', function (e) {
        const x = e.clientX - e.target.getBoundingClientRect().left;
        const y = e.clientY - e.target.getBoundingClientRect().top;
        
        const ripple = document.createElement('span');
        ripple.classList.add('pull-ripple');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Scenario Navigation Logic
function startScenario(scenario_id) {
    currentScenarioID = scenario_id;
    console.log(`Setting currentScenarioID to: ${currentScenarioID}`);
    
    // Show Loading Overlay
    const overlay = document.getElementById('nav-overlay');
    const overlayText = document.getElementById('scenario-text');
    
    overlayText.textContent = `Initializing game environment for Scenario ${scenario_id}...`;
    overlay.classList.remove('hidden');
    
    // Simulate navigation delay
    setTimeout(() => {
        // In reality, this would be: window.location.href = '/game'; or React Router push
        console.log('Navigating to Split-Screen Game Page...');
        // For demonstration, we just hide overlay to let user try others
        overlay.classList.add('hidden');
    }, 2000);
}
