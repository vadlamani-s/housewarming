const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwbogKtZ837gUWV8j09G53r9cuWP9hMEJhTLodOdrM3Q4b9mVPxaxTtXzIdbPERrlV9Jg/exec";

async function submitRSVP(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const msgBox = document.getElementById('form-message');
    
    const name = document.getElementById('guest-name').value.trim();
    const attending = document.querySelector('input[name="attendance"]:checked').value;
    const events = attending === "Yes" ? document.querySelector('input[name="event-select"]:checked').value : "N/A";
    
    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";
    msgBox.style.color = "#b8860b";
    msgBox.innerText = "Sending your response to the hosts...";
    
    const payload = new URLSearchParams({ 
        name: name, 
        attending: attending, 
        events: events 
    });
    
    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', 
            cache: 'no-cache',
            body: payload
        });
        msgBox.style.color = "#2e7d32";
        msgBox.innerText = "✨ Thank you! Your RSVP has been saved successfully.";
        submitBtn.innerText = "Submitted";
        document.getElementById('rsvp-form').reset();
    } catch (error) {
        console.error(error);
        msgBox.style.color = "#800020";
        msgBox.innerText = "❌ Something went wrong. Please try again.";
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit RSVP";
    }
}

function toggleEventOptions(status) {
    const optionsBlock = document.getElementById('event-options-block');
    if (status === 'No') {
        optionsBlock.style.opacity = '0.3';
        optionsBlock.querySelectorAll('input').forEach(r => r.disabled = true);
    } else {
        optionsBlock.style.opacity = '1';
        optionsBlock.querySelectorAll('input').forEach(r => r.disabled = false);
    }
}

// Bind event listeners dynamically to comply with strict CSP (no inline HTML onclicks)
document.addEventListener('DOMContentLoaded', () => {
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', submitRSVP);
    }

    const attendanceOptions = document.querySelectorAll('input[name="attendance"]');
    attendanceOptions.forEach(radio => {
        radio.addEventListener('change', (e) => {
            toggleEventOptions(e.target.value);
        });
    });
});
