/**
 * Simulates sending a message to a Slack channel, and ACTUALLY sends a push notification 
 * to a public ntfy.sh topic for the hackathon demo to fulfill the "real action in external tool" requirement.
 */
export async function sendSlackMessage(message: string): Promise<void> {
  console.log(`\n================ SLACK NOTIFICATION ================`);
  console.log(`[SLACK] New Message: ${message}`);
  console.log(`====================================================\n`);
  
  // Real Action: Send push notification to ntfy.sh without requiring API keys!
  try {
    await fetch('https://ntfy.sh/microsoft-enterprise-os-demo', {
      method: 'POST',
      body: message,
      headers: {
        'Title': 'EnterpriseOS Alert',
        'Tags': 'robot,warning'
      }
    });
  } catch (err) {
    console.error("Failed to send real webhook action:", err);
  }
}
