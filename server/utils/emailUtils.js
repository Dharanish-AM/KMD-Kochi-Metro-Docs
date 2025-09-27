const { sendWelcomeEmail } = require('./emailService');

// Utility functions for common email scenarios

// Send bulk welcome emails (for batch user creation)
const sendBulkWelcomeEmails = async (usersArray) => {
  const results = [];
  
  for (const user of usersArray) {
    try {
      const result = await sendWelcomeEmail(user);
      results.push({
        email: user.email,
        success: result.success,
        messageId: result.messageId,
        error: result.error
      });
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      results.push({
        email: user.email,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
};

// Validate email configuration
const validateEmailConfig = () => {
  const requiredVars = ['MAIL_USER', 'MAIL_PASS'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    return {
      isValid: false,
      message: `Missing required environment variables: ${missing.join(', ')}`,
      missing: missing
    };
  }
  
  return {
    isValid: true,
    message: 'Email configuration is valid'
  };
};

// Send test email (for setup verification)
const sendTestEmail = async (recipientEmail = process.env.MAIL_USER) => {
  try {
    const testUserDetails = {
      name: "Test User",
      email: recipientEmail,
      password: "TestPassword123!",
      role: "Test Role",
      departmentName: "Test Department"
    };
    
    const result = await sendWelcomeEmail(testUserDetails);
    return result;
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Get email statistics (for monitoring)
const getEmailStats = () => {
  // This would typically connect to your email service's API
  // For now, return basic config status
  const config = validateEmailConfig();
  
  return {
    configurationStatus: config.isValid ? 'configured' : 'not_configured',
    service: 'Gmail SMTP',
    lastConfigCheck: new Date().toISOString(),
    ...config
  };
};

module.exports = {
  sendBulkWelcomeEmails,
  validateEmailConfig,
  sendTestEmail,
  getEmailStats
};