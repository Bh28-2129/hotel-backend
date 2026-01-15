const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // For development, using a test account (you can replace with real SMTP later)
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
  });
};

// Send booking confirmation email
const sendBookingConfirmation = async (bookingDetails) => {
  const transporter = createTransporter();

  const { guestName, guestEmail, bookingId, roomNumber, roomType, checkInDate, checkOutDate, totalPrice, numberOfGuests } = bookingDetails;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Hotel Management" <noreply@hotelmanagement.com>',
    to: guestEmail,
    subject: `Booking Confirmation - ${bookingId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .details { background-color: white; padding: 15px; border-radius: 5px; margin: 10px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-label { font-weight: bold; }
          .footer { text-align: center; color: #6b7280; padding: 20px; font-size: 12px; }
          .button { background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏨 Hotel Management</h1>
            <h2>Booking Confirmation</h2>
          </div>
          
          <div class="content">
            <p>Dear ${guestName},</p>
            <p>Thank you for choosing our hotel! Your booking has been confirmed successfully.</p>
            
            <div class="details">
              <h3>Booking Details</h3>
              <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span>${bookingId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Room:</span>
                <span>${roomNumber} - ${roomType}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Check-in:</span>
                <span>${new Date(checkInDate).toLocaleDateString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Check-out:</span>
                <span>${new Date(checkOutDate).toLocaleDateString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Guests:</span>
                <span>${numberOfGuests}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total Price:</span>
                <span><strong>$${totalPrice}</strong></span>
              </div>
            </div>
            
            <p>Please arrive at the hotel reception between 2:00 PM and 11:00 PM on your check-in date.</p>
            <p>We look forward to welcoming you!</p>
          </div>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; 2026 Hotel Management System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    // For development without real SMTP, we'll just log the email
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com') {
      console.log('\n📧 EMAIL NOTIFICATION:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`To: ${guestEmail}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(`Booking ID: ${bookingId}`);
      console.log(`Room: ${roomNumber} - ${roomType}`);
      console.log(`Check-in: ${new Date(checkInDate).toLocaleDateString()}`);
      console.log(`Check-out: ${new Date(checkOutDate).toLocaleDateString()}`);
      console.log(`Total: $${totalPrice}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      return { success: true, message: 'Email logged to console (dev mode)' };
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmation
};
