const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,  // your Gmail address
      pass: process.env.MAIL_PASS,  // app password if 2FA enabled
    },
  });
};

// Email template for new user credentials
const generateWelcomeEmailTemplate = (name, email, password, role, departmentName) => {
  return {
    subject: `Welcome to KMRL Document Management System - Your Account Details`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to KMRL</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
          }
          .content {
            padding: 40px 30px;
          }
          .welcome-text {
            font-size: 18px;
            color: #333;
            margin-bottom: 30px;
          }
          .credentials-box {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            border-radius: 10px;
            padding: 25px;
            margin: 30px 0;
            color: white;
          }
          .credentials-box h3 {
            margin-top: 0;
            font-size: 20px;
            text-align: center;
            margin-bottom: 20px;
          }
          .credential-item {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 5px;
            padding: 15px;
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .credential-label {
            font-weight: bold;
            font-size: 14px;
          }
          .credential-value {
            font-family: 'Courier New', monospace;
            background: rgba(255, 255, 255, 0.3);
            padding: 8px 12px;
            border-radius: 5px;
            font-size: 14px;
            font-weight: bold;
          }
          .info-section {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 30px 0;
            border-radius: 0 5px 5px 0;
          }
          .info-section h4 {
            color: #667eea;
            margin-top: 0;
            font-size: 16px;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
            transition: transform 0.3s ease;
          }
          .button:hover {
            transform: translateY(-2px);
          }
          .footer {
            background: #333;
            color: white;
            padding: 30px;
            text-align: center;
            font-size: 14px;
          }
          .footer p {
            margin: 5px 0;
            opacity: 0.8;
          }
          .security-note {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
          }
          .security-note strong {
            color: #d63031;
          }
          @media (max-width: 600px) {
            .container {
              margin: 0;
              border-radius: 0;
            }
            .content {
              padding: 30px 20px;
            }
            .credential-item {
              flex-direction: column;
              text-align: center;
            }
            .credential-value {
              margin-top: 10px;
              width: 100%;
              box-sizing: border-box;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚊 KMRL Document System</h1>
            <p>Kochi Metro Rail Limited</p>
          </div>
          
          <div class="content">
            <div class="welcome-text">
              <p>Dear <strong>${name}</strong>,</p>
              <p>Welcome to the KMRL Document Management System! Your account has been successfully created by the system administrator.</p>
            </div>

            <div class="credentials-box">
              <h3>🔐 Your Login Credentials</h3>
              <div class="credential-item">
                <span class="credential-label">Email:</span>
                <span class="credential-value">${email}</span>
              </div>
              <div class="credential-item">
                <span class="credential-label">Password:</span>
                <span class="credential-value">${password}</span>
              </div>
              <div class="credential-item">
                <span class="credential-label">Role:</span>
                <span class="credential-value">${role}</span>
              </div>
              ${departmentName ? `
              <div class="credential-item">
                <span class="credential-label">Department:</span>
                <span class="credential-value">${departmentName}</span>
              </div>
              ` : ''}
            </div>

            <div class="security-note">
              <strong>⚠️ Security Notice:</strong><br>
              For your security, please change your password after your first login. Keep your credentials confidential and never share them with anyone.
            </div>

            <div class="info-section">
              <h4>📋 What's Next?</h4>
              <ul>
                <li>Log in to the system using your credentials above</li>
                <li>Complete your profile information</li>
                <li>Change your password for better security</li>
                <li>Explore the document management features</li>
                <li>Contact your administrator if you need assistance</li>
              </ul>
            </div>

            <div style="text-align: center;">
              <a href="#" class="button">🚀 Access Dashboard</a>
            </div>

            <div class="info-section">
              <h4>📞 Need Help?</h4>
              <p>If you have any questions or need assistance, please contact your system administrator or the IT support team.</p>
            </div>
          </div>

          <div class="footer">
            <p><strong>Kochi Metro Rail Limited</strong></p>
            <p>Document Management System</p>
            <p>© ${new Date().getFullYear()} KMRL. All rights reserved.</p>
            <p style="font-size: 12px; margin-top: 15px;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to KMRL Document Management System

Dear ${name},

Your account has been successfully created by the system administrator.

Your Login Credentials:
- Email: ${email}
- Password: ${password}
- Role: ${role}
${departmentName ? `- Department: ${departmentName}` : ''}

SECURITY NOTICE: For your security, please change your password after your first login. Keep your credentials confidential.

What's Next:
1. Log in to the system using your credentials above
2. Complete your profile information
3. Change your password for better security
4. Explore the document management features
5. Contact your administrator if you need assistance

Need Help?
If you have any questions or need assistance, please contact your system administrator or the IT support team.

---
Kochi Metro Rail Limited
Document Management System
© ${new Date().getFullYear()} KMRL. All rights reserved.

This is an automated message. Please do not reply to this email.
    `
  };
};

// Function to send welcome email with credentials
const sendWelcomeEmail = async (userDetails) => {
  try {
    const { name, email, password, role, departmentName } = userDetails;
    
    const transporter = createTransporter();
    const emailTemplate = generateWelcomeEmailTemplate(name, email, password, role, departmentName);
    
    const mailOptions = {
      from: {
        name: 'KMRL Document System',
        address: process.env.MAIL_USER
      },
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
      priority: 'high'
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Function to send password reset email (for future use)
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'KMRL Document System',
        address: process.env.MAIL_USER
      },
      to: email,
      subject: 'Password Reset Request - KMRL Document System',
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
      text: `
        Password Reset Request
        
        Click the link below to reset your password:
        ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}
        
        This link will expire in 1 hour.
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  createTransporter,
  generateWelcomeEmailTemplate
};