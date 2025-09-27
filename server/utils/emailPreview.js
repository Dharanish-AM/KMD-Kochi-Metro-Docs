const { generateWelcomeEmailTemplate } = require('./emailService');
const fs = require('fs');
const path = require('path');

// Function to generate and preview email template
const previewEmailTemplate = () => {
  const sampleUser = {
    name: "John Doe",
    email: "john.doe@metro.com",
    password: "TempPass123!",
    role: "Employee",
    departmentName: "Engineering"
  };

  // Note: We need to modify emailService.js to export the template function
  const template = generateWelcomeEmailTemplate(
    sampleUser.name,
    sampleUser.email,
    sampleUser.password,
    sampleUser.role,
    sampleUser.departmentName
  );

  // Save HTML template to file for preview
  const previewPath = path.join(__dirname, 'email-preview.html');
  fs.writeFileSync(previewPath, template.html);
  
  console.log('📧 Email template preview generated!');
  console.log(`📁 Open this file in your browser: ${previewPath}`);
  console.log('\n📝 Email Subject:', template.subject);
  console.log('\n📄 Text Version:');
  console.log(template.text);
};

// Run if called directly
if (require.main === module) {
  previewEmailTemplate();
}

module.exports = { previewEmailTemplate };