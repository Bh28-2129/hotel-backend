// Authentication JS

// Function to send welcome email using EmailJS
async function sendWelcomeEmail(name, email) {
  try {
    // Skip if EmailJS SDK is not available (e.g., missing script tag)
    if (typeof emailjs === 'undefined') {
      console.warn('EmailJS SDK not loaded; skipping welcome email.');
      return false;
    }

    const templateParams = {
      to_name: name,
      to_email: email,
      from_name: 'Hotel Management Team',
      message: `Welcome to our Hotel Management System! Thank you for registering with us. We're excited to have you on board. You can now browse and book rooms at your convenience.`
    };

    // Send email using EmailJS
    await emailjs.send(
      'service_iu01rim',      // Replace with your EmailJS service ID
      'template_fznkngq',     // Replace with your EmailJS template ID
      templateParams
    );
    
    console.log('Welcome email sent successfully!');
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Don't throw error - we don't want to stop registration if email fails
    return false;
  }
}

// Register Form Handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    // Validate passwords match
    if (password !== confirmPassword) {
      showAlert('registerAlert', 'Passwords do not match', 'danger');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      showAlert('registerAlert', 'Password must be at least 6 characters', 'danger');
      return;
    }

    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, password })
      });

      saveUserData(data.token, data.user);
      
      // Send welcome email after successful registration
      await sendWelcomeEmail(name, email);
      
      showAlert('registerAlert', 'Registration successful! Check your email for welcome message. Redirecting...', 'success');
      
      // Update navbar UI
      updateUIBasedOnLoginState();
      
      // Close modal
      const authModal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
      if (authModal) authModal.hide();
      
      setTimeout(() => {
        // Redirect to dashboard/home
        window.location.href = 'index.html';
      }, 2000);
    } catch (error) {
      showAlert('registerAlert', error.message, 'danger');
    }
  });
}

// Initialize UI on page load
document.addEventListener('DOMContentLoaded', () => {
  updateUIBasedOnLoginState();
});
