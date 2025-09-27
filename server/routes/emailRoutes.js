const router = require("express").Router();
const { sendTestEmail, validateEmailConfig, getEmailStats } = require("../utils/emailUtils");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

// Test email endpoint (Admin only)
router.post("/test-email", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { email } = req.body;
    const recipientEmail = email || process.env.MAIL_USER;
    
    const result = await sendTestEmail(recipientEmail);
    
    if (result.success) {
      res.status(200).json({
        message: "Test email sent successfully",
        recipient: recipientEmail,
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        message: "Failed to send test email",
        error: result.error
      });
    }
  } catch (error) {
    console.error("Error in test email endpoint:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
});

// Check email configuration status (Admin only)
router.get("/config-status", verifyToken, verifyAdmin, (req, res) => {
  try {
    const stats = getEmailStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error checking email config:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
});

module.exports = router;