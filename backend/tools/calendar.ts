export async function createCalendarEvent(title: string, date: Date, attendees: string[]) {
  console.log(`\n[CALENDAR API] 📅 Creating Calendar Event...`);
  console.log(`[CALENDAR API] Title: ${title}`);
  console.log(`[CALENDAR API] Date: ${date.toLocaleString()}`);
  console.log(`[CALENDAR API] Attendees: ${attendees.join(", ")}`);
  
  // Format dates for ICS (YYYYMMDDThhmmssZ)
  const dtStart = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endDate = new Date(date.getTime() + 15 * 60000); // 15 mins meeting
  const dtEnd = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const attendeeString = attendees.map(email => `ATTENDEE;RSVP=TRUE:mailto:${email}`).join('\r\n');

  const icsContent = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//EnterprisePilot AI//Meeting Scheduler//EN\r\nCALSCALE:GREGORIAN\r\nMETHOD:REQUEST\r\nBEGIN:VEVENT\r\nSUMMARY:${title}\r\nDTSTART:${dtStart}\r\nDTEND:${dtEnd}\r\nDESCRIPTION:Automated Sync-up Call scheduled by EnterprisePilot AI\\n\\nPlease join using the meeting link.\r\nLOCATION:Google Meet / Microsoft Teams\r\nORGANIZER;CN=EnterprisePilot AI:mailto:no-reply@enterprisepilot.ai\r\n${attendeeString}\r\nEND:VEVENT\r\nEND:VCALENDAR`;

  const eventId = `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  console.log(`[CALENDAR API] ✅ Successfully created event! Event ID: ${eventId}\n`);
  
  return {
    success: true,
    eventId,
    icsContent
  };
}
