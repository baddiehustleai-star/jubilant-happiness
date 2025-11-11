// api/services/email.service.js
import nodemailer from 'nodemailer';

const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

let transporter;
if (user && pass) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
  console.log('📧 Email service initialized with:', user);
} else {
  console.warn('⚠️  SMTP_USER or SMTP_PASS missing - email disabled');
}

/**
 * Send a receipt email after purchase
 */
export async function sendReceiptEmail(to, productTitle, price, orderId) {
  if (!transporter) {
    console.warn('Email disabled, skipping receipt');
    return false;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #ffc1cc 0%, #d4a5a5 100%);
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          color: white;
          margin: 0;
          font-size: 28px;
        }
        .content {
          background: white;
          padding: 30px;
          border: 1px solid #e0e0e0;
          border-top: none;
          border-radius: 0 0 10px 10px;
        }
        .order-details {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .order-details h2 {
          color: #d4a5a5;
          margin-top: 0;
        }
        .detail-row {
          display: flex;
          justify-between;
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: 600;
          color: #666;
        }
        .value {
          color: #333;
        }
        .price {
          font-size: 24px;
          font-weight: bold;
          color: #d4a5a5;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #888;
          font-size: 12px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #ffc1cc 0%, #d4a5a5 100%);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>💎 Photo2Profit</h1>
        <p style="color: white; margin: 10px 0 0 0;">Thank you for your purchase!</p>
      </div>
      
      <div class="content">
        <h2>Order Confirmation</h2>
        <p>Hi there! 👋</p>
        <p>Your order has been confirmed and is being processed. Here are your order details:</p>
        
        <div class="order-details">
          <h2>Order Details</h2>
          <div class="detail-row">
            <span class="label">Product:</span>
            <span class="value"><strong>${productTitle}</strong></span>
          </div>
          <div class="detail-row">
            <span class="label">Order ID:</span>
            <span class="value">${orderId}</span>
          </div>
          <div class="detail-row">
            <span class="label">Total Amount:</span>
            <span class="price">$${price.toFixed(2)}</span>
          </div>
          <div class="detail-row">
            <span class="label">Date:</span>
            <span class="value">${new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}</span>
          </div>
        </div>
        
        <p>We appreciate your business and hope you enjoy your purchase! ❤️</p>
        
        <center>
          <a href="${process.env.FRONTEND_URL || 'https://photo2profit.com'}/orders" class="button">
            View Order Status
          </a>
        </center>
        
        <p style="margin-top: 30px; font-size: 14px; color: #666;">
          Questions? Reply to this email and we'll help you out!
        </p>
      </div>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} Photo2Profit. All rights reserved.</p>
        <p>AI-powered product listings that sell themselves.</p>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Photo2Profit" <${user}>`,
      to,
      subject: `✓ Your Photo2Profit Purchase Receipt (#${orderId.slice(0, 8)})`,
      html,
    });

    console.log(`✅ Sent receipt email to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    return false;
  }
}

/**
 * Send a welcome email to new users
 */
export async function sendWelcomeEmail(to, userName) {
  if (!transporter) return false;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #ffc1cc 0%, #d4a5a5 100%);
          padding: 40px;
          text-align: center;
          border-radius: 10px;
        }
        .header h1 {
          color: white;
          margin: 0;
          font-size: 32px;
        }
        .content {
          background: white;
          padding: 30px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Welcome to Photo2Profit!</h1>
      </div>
      <div class="content">
        <p>Hi ${userName || 'there'}! 👋</p>
        <p>We're thrilled to have you on board. Photo2Profit uses AI to turn your product photos into professional listings that sell.</p>
        <p><strong>What's next?</strong></p>
        <ul>
          <li>Upload your first product photo</li>
          <li>Let AI remove the background and generate pricing</li>
          <li>Publish to eBay and Facebook Marketplace automatically</li>
        </ul>
        <p>Happy selling! 💎</p>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Photo2Profit" <${user}>`,
      to,
      subject: '🎉 Welcome to Photo2Profit!',
      html,
    });
    console.log(`✅ Sent welcome email to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error.message);
    return false;
  }
}
