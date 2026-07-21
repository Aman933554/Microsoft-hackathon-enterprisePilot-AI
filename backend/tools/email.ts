import nodemailer from 'nodemailer';
import "dotenv/config";

export async function sendApprovalEmail(budget: number, feature: string, threadId: string) {
  try {
    let transporter;

    // Check if we have real SMTP credentials
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        service: 'gmail', // defaults to gmail, can be overridden if needed
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      console.log("[EMAIL] Using real SMTP credentials from .env.");
    } else {
      console.log("[EMAIL] No SMTP credentials found. Skipping actual email sending to prevent hang.");
      console.log("[EMAIL] (Mock Mode) Approval email would have been sent for feature:", feature);
      return; // Skip email sending
    }

    // HTML Email Body matching the "Ultimate UI"
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #121212; color: #ffffff; padding: 20px; border-radius: 8px;">
        <h2 style="color: #eab308; text-align: center;">🚨 Approval Required – EnterprisePilot AI</h2>
        <hr style="border-color: #333;" />
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #333; color: #a1a1aa;">Feature:</td>
            <td style="padding: 10px; border-bottom: 1px solid #333; text-align: right;"><b>${feature}</b></td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #333; color: #a1a1aa;">Requested Budget:</td>
            <td style="padding: 10px; border-bottom: 1px solid #333; text-align: right; color: #a855f7;"><b>₹${budget.toLocaleString()}</b></td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #333; color: #a1a1aa;">Risk Level:</td>
            <td style="padding: 10px; border-bottom: 1px solid #333; text-align: right; color: #ef4444;"><b>Medium</b></td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #a1a1aa;">Requested By:</td>
            <td style="padding: 10px; text-align: right;">Engineering Agent</td>
          </tr>
        </table>

        <div style="text-align: center; margin-top: 30px;">
          <a href="http://10.169.241.10:3000/action?threadId=${threadId}&budget=${budget}&feature=${encodeURIComponent(feature)}&approved=true" style="background-color: #10b981; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 10px;">Approve ✅</a>
          <a href="http://10.169.241.10:3000/action?threadId=${threadId}&budget=${budget}&feature=${encodeURIComponent(feature)}&approved=false" style="background-color: #ef4444; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reject ❌</a>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://notion.so" style="color: #a1a1aa; text-decoration: underline; font-size: 0.9rem;">Review full details in Notion</a>
        </div>
      </div>
    `;

    // Send the email
    const info = await transporter.sendMail({
      from: '"EnterprisePilot AI" <no-reply@enterprisepilot.ai>',
      to: process.env.MANAGER_EMAIL || "sharmaaman9318411@gmail.com", 
      subject: "Approval Required – EnterprisePilot AI", 
      text: `Approval Required for ${feature} (Budget: ₹${budget.toLocaleString()}). Please review in Notion.`,
      html: htmlBody, 
    });

    console.log(`[SYSTEM] 📧 Email actually sent! Message ID: ${info.messageId}`);
    
    // If we used Ethereal, log the preview URL!
    if (!process.env.SMTP_USER) {
      console.log(`\n======================================================`);
      console.log(`📨 View the sent email here (No login required):`);
      console.log(`➡️  ${nodemailer.getTestMessageUrl(info)}`);
      console.log(`======================================================\n`);
    }

  } catch (error) {
    console.error("[EMAIL] Error sending email:", error);
  }
}
