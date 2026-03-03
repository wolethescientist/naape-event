import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const from = process.env.SENDER_EMAIL || "The Events Team <events@yourdomain.com>";
  console.log(`[Email] Attempting to send email to ${to} with subject "${subject}" from "${from}"`);

  try {
    const response = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (response.error) {
      console.error(`[Email] Resend API Error for ${to}:`, response.error);
    } else {
      console.log(`[Email] Successfully sent to ${to}. ID:`, response.data?.id);
    }

    return response;
  } catch (err) {
    console.error(`[Email] Exception caught returning resend.emails.send for ${to}:`, err);
    throw err;
  }
}

export function generateAttendeeConfirmationEmail(firstName: string, registrationId: string) {
  const zoomLink = process.env.EVENT_ZOOM_LINK || "https://us05web.zoom.us/j/85992016590?pwd=XGICdMoGzNxKNqwcqUFEggVCAqnElg.1";
  const zoomMeetingId = process.env.EVENT_ZOOM_MEETING_ID || "859 9201 6590";
  const zoomPasscode = process.env.EVENT_ZOOM_PASSCODE || "wnAP1x";
  const address = process.env.EVENT_ADDRESS || "NCAA Conference Hall, Lagos";

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #8a258f, #66156a); padding: 40px 20px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px;">Registration Confirmed! ✓</h1>
      </div>
      <div style="padding: 40px 30px;">
        <p style="font-size: 18px; color: #1E1B4B; margin-top: 0;">Hi ${firstName},</p>
        <p style="font-size: 16px; color: #4B5563; line-height: 1.6;">Thank you for registering for the <strong>2026 International Women's Day</strong>. Your registration has been successfully processed.</p>
        
        <div style="background: #fbf0fd; border: 1px solid #ebc8f2; padding: 25px; rounded: 8px; margin: 30px 0;">
          <h2 style="margin-top: 0; color: #1E1B4B; font-size: 20px; border-bottom: 2px solid #ebc8f2; padding-bottom: 10px;">Event Details</h2>
          <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6B7280; font-weight: bold; width: 30%;">Registration ID:</td>
              <td style="padding: 8px 0; color: #1E1B4B; font-weight: bold;">${registrationId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6B7280; font-weight: bold;">Date & Time:</td>
              <td style="padding: 8px 0; color: #1E1B4B;">March 07, 2026 • 10:00 AM WAT</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6B7280; font-weight: bold;">Venue:</td>
              <td style="padding: 8px 0; color: #1E1B4B;">${address}</td>
            </tr>
          </table>
        </div>

        <div style="margin: 30px 0;">
          <h2 style="color: #1E1B4B; font-size: 20px;">Virtual Access</h2>
          <p style="color: #4B5563;">If you're joining us online, you can use the link below:</p>
          <a href="${zoomLink}" style="display: inline-block; background: #8a258f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">Join via Zoom</a>
          <div style="margin-top: 20px; color: #4B5563; font-size: 14px; line-height: 1.6;">
            <p style="margin: 5px 0;"><strong>Meeting ID:</strong> ${zoomMeetingId}</p>
            <p style="margin: 5px 0;"><strong>Passcode:</strong> ${zoomPasscode}</p>
            <p style="margin: 5px 0;"><strong>Join Instructions:</strong> <a href="https://us05web.zoom.us/meetings/85992016590/invitations?signature=kMO-iGqCQD7fyNZb5TjZEUT2MSYalUARz-JrgYF-hbs" style="color: #8a258f; text-decoration: none;">View Details</a></p>
          </div>
        </div>

        <div style="background: #fbf0fd; border: 1px solid #ebc8f2; padding: 25px; rounded: 8px; margin: 30px 0;">
          <h2 style="margin-top: 0; color: #1E1B4B; font-size: 20px;">📸 Create Your Event Banner!</h2>
          <p style="color: #4B5563;">Join the movement and share your excitement! Create your custom selfie banner to post on your socials.</p>
          <a href="https://getdp.co/vbH" style="display: inline-block; background: #c29a5b; color: #1f0b22; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">Create My Banner</a>
        </div>

        <p style="font-size: 16px; color: #4B5563; line-height: 1.6;">We look forward to seeing you!</p>
        <p style="font-size: 16px; color: #1E1B4B; font-weight: bold;">— The Events Team</p>
      </div>
    </div>
  `;
}

export function generateAdminNotificationEmail(attendee: Record<string, string>, registrationId: string) {
  return `
    <h2>New Registration Received: ${registrationId}</h2>
    <ul>
      <li><strong>Name:</strong> ${attendee.firstName} ${attendee.surname}</li>
      <li><strong>Email:</strong> ${attendee.email}</li>
      <li><strong>Phone:</strong> ${attendee.phone}</li>
      <li><strong>Mode:</strong> ${attendee.attendanceMode}</li>
      <li><strong>Attended Before:</strong> ${attendee.attendedBefore}</li>
      <li><strong>Location:</strong> ${attendee.joiningFrom}</li>
      <li><strong>Employer:</strong> ${attendee.employer}</li>
      <li><strong>Organization:</strong> ${attendee.organization}</li>
      <li><strong>Role:</strong> ${attendee.description} ${attendee.aviationRole ? `(${attendee.aviationRole})` : ''}</li>
    </ul>
  `;
}
