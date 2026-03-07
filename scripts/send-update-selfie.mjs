import { Resend } from "resend";

// Using the credentials provided directly
const RESEND_API_KEY = "re_Mmx4PTzh_7RoXCg2RkE7MSY6XVCue7e5W";
const SENDER_EMAIL = "noreply@event.naape.ng";

const resend = new Resend(RESEND_API_KEY);

const emails = [
    "dapalsarah17@gmail.com",
    "kyolad@yahoo.com",
    "liyabethen@gmail.com",
    "ijeomaafakwu@gmail.com",
    "ajayititi081@gmail.com",
    "jacks.s@acn.aero",
    "cjurshak@gmail.com", // Repeated once in your list, deduplicated here
    "rosamarynk@gmail.com",
    "silvaolowu@gmail.com",
    "onyiezike@gmail.com",
    "oluwalz247@gmail.com"
];

// The new GetDP link
const NEW_GETDP_LINK = "https://getdp.co/vcu";

const subject = "Update: New Selfie Banner Link - 2026 International Women's Day";

const htmlContent = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
  <div style="background: linear-gradient(135deg, #8a258f, #66156a); padding: 40px 20px; text-align: center; color: white;">
    <h1 style="margin: 0; font-size: 28px;">📸 Create Your Event Banner!</h1>
  </div>
  <div style="padding: 40px 30px;">
    <p style="font-size: 18px; color: #1E1B4B; margin-top: 0;">Hi there,</p>
    <p style="font-size: 16px; color: #4B5563; line-height: 1.6;">
      We're excited to see you at the <strong>2026 International Women's Day</strong> event!
    </p>

    <div style="background: #fbf0fd; border: 1px solid #ebc8f2; padding: 25px; border-radius: 8px; margin: 30px 0;">
      <h2 style="margin-top: 0; color: #1E1B4B; font-size: 20px;">📸 Create Your Event Banner!</h2>
      <p style="color: #4B5563;">
        We wanted to let you know that we have updated the link to create your custom selfie banner. Please use the new link below, as the previous one is no longer in use.
      </p>
      <a href="https://getdp.co/vcu" style="display: inline-block; background: #c29a5b; color: #1f0b22; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">Create My Banner</a>
    </div>

    <p style="font-size: 16px; color: #4B5563; line-height: 1.6;">We look forward to seeing your amazing banners!</p>
    <p style="font-size: 16px; color: #1E1B4B; font-weight: bold;">— The Events Team</p>
  </div>
</div>
`;

async function main() {
    console.log(`Starting email broadcast to ${emails.length} recipients...`);

    for (const email of emails) {
        try {
            console.log(`Sending to ${email}...`);
            const response = await resend.emails.send({
                from: SENDER_EMAIL,
                to: email,
                subject: subject,
                html: htmlContent
            });

            if (response.error) {
                console.error(`❌ Failed to send to ${email}:`, response.error);
            } else {
                console.log(`✅ Successfully sent to ${email}. ID: ${response.data?.id}`);
            }

            // Briefly wait to avoid hitting rate limits
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (err) {
            console.error(`❌ Exception while sending to ${email}:`, err);
        }
    }

    console.log("🎉 All done!");
}

main();
