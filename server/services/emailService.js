const fs = require('fs');
const path = require('path');

const LOGS_DIR = path.join(__dirname, '..', 'uploads', 'emailLogs');
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

const sendEmail = async ({ to, subject, html }) => {
  console.log(`[EMAIL_SERVICE] Sending email to: ${to}`);
  console.log(`[EMAIL_SERVICE] Subject: ${subject}`);
  
  const logContent = `
Date: ${new Date().toISOString()}
To: ${to}
Subject: ${subject}
Body:
${html}
===================================================
`;
  
  // Also write to a file in uploads/emailLogs so the user can easily view what email was sent
  const filename = `${Date.now()}_email.txt`;
  fs.writeFileSync(path.join(LOGS_DIR, filename), logContent.trim(), 'utf8');
  return { success: true, message: 'Email sent successfully (simulated).' };
};

module.exports = {
  sendEmail
};
