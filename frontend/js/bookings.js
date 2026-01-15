// Bookings JS

let userBookings = [];

// Function to send booking confirmation email
async function sendBookingConfirmationEmail(bookingDetails) {
  try {
    // Skip if EmailJS SDK is not available
    if (typeof emailjs === 'undefined') {
      console.warn('EmailJS SDK not loaded; skipping booking confirmation email.');
      return false;
    }

    const user = getUser();
    const templateParams = {
      to_name: user.name,
      to_email: user.email,
      booking_id: bookingDetails.bookingId,
      room_number: bookingDetails.roomId.roomNumber,
      room_type: bookingDetails.roomId.roomType,
      check_in_date: formatDate(bookingDetails.checkInDate),
      check_out_date: formatDate(bookingDetails.checkOutDate),
      number_of_guests: bookingDetails.numberOfGuests,
      total_price: formatCurrency(bookingDetails.totalPrice),
      from_name: 'Hotel Management Team',
      message: `Your booking has been confirmed! Thank you for your reservation. Please keep your booking ID for reference during check-in.`
    };

    // Send email using EmailJS
    await emailjs.send(
      'service_iu01rim',      // Replace with your EmailJS service ID
      'template_fznkngq',     // Replace with your EmailJS template ID
      templateParams
    );
    
    console.log('Booking confirmation email sent successfully!');
    return true;
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    // Don't throw error - we don't want to stop booking if email fails
    return false;
  }
}

// Load bookings on page load
document.addEventListener('DOMContentLoaded', () => {
  loadBookings();
  setupPaymentForm();
});

// Load user bookings
async function loadBookings() {
  if (!isLoggedIn()) {
    const container = document.getElementById('bookingsContainer');
    if (container) {
      container.innerHTML = `
        <div class="alert alert-info" role="alert">
          <a href="login.html" class="alert-link">Login</a> to view your bookings.
        </div>
      `;
    }
    return;
  }

  try {
    const data = await apiRequest('/bookings', {
      method: 'GET'
    });

    userBookings = data.data || [];
    displayBookings(userBookings);
  } catch (error) {
    const container = document.getElementById('bookingsContainer');
    if (container) {
      container.innerHTML = `
        <div class="alert alert-danger" role="alert">
          Error loading bookings: ${error.message}
        </div>
      `;
    }
  }
}

// Display bookings
function displayBookings(bookings) {
  const container = document.getElementById('bookingsContainer');
  if (!container) return;

  // Display all bookings
  const activeBookings = bookings;

  if (activeBookings.length === 0) {
    container.innerHTML = `
      <div class="alert alert-info" role="alert">
        You haven't made any bookings yet. 
        <a href="rooms.html" class="alert-link">Book a room now</a>
      </div>
    `;
    return;
  }

  container.innerHTML = activeBookings.map(booking => `
    <div class="card booking-card shadow-sm mb-3">
      <div class="card-body">
        <div class="row">
          <div class="col-md-8">
            <h5 class="card-title">
              ${booking.roomId.roomNumber} - ${booking.roomId.roomType}
            </h5>
            <p class="card-text mb-2">
              <strong>Booking ID:</strong> ${booking.bookingId}
            </p>
            <p class="card-text mb-2">
              <strong>Check-in:</strong> ${formatDate(booking.checkInDate)}<br>
              <strong>Check-out:</strong> ${formatDate(booking.checkOutDate)}<br>
              <strong>Guests:</strong> ${booking.numberOfGuests}
            </p>
            ${booking.specialRequests ? `
              <p class="card-text mb-2">
                <strong>Special Requests:</strong> ${booking.specialRequests}
              </p>
            ` : ''}
          </div>
          <div class="col-md-4 text-end">
            <div class="mb-3">
              <span class="status-badge status-${booking.status}">
                ${booking.status.toUpperCase()}
              </span>
            </div>
            <div class="mb-3">
              <p class="mb-1">
                <strong>${formatCurrency(booking.totalPrice)}</strong>
              </p>
              <p class="text-muted small">Total Price</p>
            </div>
            <div>
              ${booking.status !== 'cancelled' && booking.status !== 'checked-out' ? `
                <button class="btn btn-sm btn-danger" onclick="cancelBooking('${booking._id}')">
                  Cancel
                </button>
              ` : ''}
              ${booking.paymentStatus === 'pending' ? `
                <button class="btn btn-sm btn-success" onclick="processPayment('${booking._id}')">
                  Pay Now
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Delete booking
async function cancelBooking(bookingId) {
  if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
    return;
  }

  try {
    await apiRequest(`/bookings/${bookingId}`, {
      method: 'DELETE'
    });

    alert('Booking deleted successfully');
    loadBookings();
  } catch (error) {
    alert('Error deleting booking: ' + error.message);
  }
}

// Process payment
function processPayment(bookingId) {
  // Set hidden field with booking ID
  document.getElementById('paymentBookingId').value = bookingId;

  // Show payment modal
  const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
  paymentModal.show();
}

// Setup payment form
function setupPaymentForm() {
  const paymentForm = document.getElementById('paymentForm');
  const paymentMethodSelect = document.getElementById('paymentMethod');
  
  if (!paymentForm) return;

  // Handle payment method change
  if (paymentMethodSelect) {
    paymentMethodSelect.addEventListener('change', function() {
      const method = this.value;
      
      // Hide all detail sections
      document.getElementById('cardDetails').style.display = 'none';
      document.getElementById('upiDetails').style.display = 'none';
      document.getElementById('cashDetails').style.display = 'none';
      
      // Clear required attributes
      document.querySelectorAll('#cardDetails input, #upiDetails input').forEach(input => {
        input.removeAttribute('required');
      });
      
      // Show relevant section and set required fields
      if (method === 'credit_card' || method === 'debit_card') {
        document.getElementById('cardDetails').style.display = 'block';
        document.getElementById('cardNumber').setAttribute('required', 'required');
        document.getElementById('cardExpiry').setAttribute('required', 'required');
        document.getElementById('cardCVV').setAttribute('required', 'required');
        document.getElementById('cardHolderName').setAttribute('required', 'required');
      } else if (method === 'upi_payment') {
        document.getElementById('upiDetails').style.display = 'block';
        document.getElementById('upiId').setAttribute('required', 'required');
      } else if (method === 'cash') {
        document.getElementById('cashDetails').style.display = 'block';
      }
    });
  }

  paymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const bookingId = document.getElementById('paymentBookingId').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    if (!bookingId || !paymentMethod) {
      showPaymentAlert('Please select a payment method', 'danger');
      return;
    }

    // Gather payment details based on method
    const paymentDetails = {
      method: paymentMethod
    };

    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      paymentDetails.cardNumber = document.getElementById('cardNumber').value;
      paymentDetails.cardExpiry = document.getElementById('cardExpiry').value;
      paymentDetails.cardCVV = document.getElementById('cardCVV').value;
      paymentDetails.cardHolderName = document.getElementById('cardHolderName').value;
    } else if (paymentMethod === 'upi_payment') {
      paymentDetails.upiId = document.getElementById('upiId').value;
    }

    await completePayment(bookingId, paymentMethod, paymentDetails);
  });
}

// Show payment alert
function showPaymentAlert(message, type = 'info') {
  const alertDiv = document.getElementById('paymentAlert');
  alertDiv.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
}

// Complete payment
async function completePayment(bookingId, paymentMethod, paymentDetails) {
  try {
    const response = await apiRequest('/payments', {
      method: 'POST',
      body: JSON.stringify({
        bookingId,
        paymentMethod,
        paymentDetails
      })
    });

    showPaymentAlert('Payment processed successfully! Sending confirmation email...', 'success');
    
    // Find the booking details to send email
    const booking = userBookings.find(b => b._id === bookingId);
    if (booking) {
      // Send booking confirmation email
      await sendBookingConfirmationEmail(booking);
    }
    
    // Clear form
    document.getElementById('paymentForm').reset();
    
    // Hide all detail sections
    document.getElementById('cardDetails').style.display = 'none';
    document.getElementById('upiDetails').style.display = 'none';
    document.getElementById('cashDetails').style.display = 'none';
    
    // Close modal after 2 seconds
    setTimeout(() => {
      const paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
      if (paymentModal) paymentModal.hide();
      loadBookings();
    }, 2000);
  } catch (error) {
    showPaymentAlert('Error processing payment: ' + error.message, 'danger');
  }
}
