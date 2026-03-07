import { NextResponse } from "next/server";
import { getGoogleSheets } from "@/lib/google-sheets";
import { sendEmail, generateAttendeeConfirmationEmail, generateAdminNotificationEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Process only Onsite requests for capacity
        let onsiteCount = 0;
        const SHEET_ID = process.env.GOOGLE_SHEET_ID;

        // We assume the sheet is named "Sheet1" and the headers are strictly followed.
        // Ensure you have at least a column for Registration ID in Sheet1!A:P.

        let sheets;
        try {
            if (SHEET_ID) {
                sheets = await getGoogleSheets();
            }
        } catch (e) {
            console.warn("Google Sheets not initialized:", e);
        }

        if (sheets && SHEET_ID) {
            if (data.attendanceMode === "Onsite") {
                const response = await sheets.spreadsheets.values.get({
                    spreadsheetId: SHEET_ID,
                    range: "Sheet1!F:F", // Column F is Attendance Mode
                });

                const rows = response.data.values || [];
                // Count how many "Onsite" exists
                onsiteCount = rows.filter(row => row[0]?.toString().toLowerCase() === "onsite").length;

                if (onsiteCount >= 180) {
                    return NextResponse.json(
                        { error: "Onsite capacity has been reached. Please select virtual attendance." },
                        { status: 400 }
                    );
                }
            }
        }

        // Generate unique ID
        const today = new Date();
        const yyyymmdd = today.toISOString().split("T")[0].replace(/-/g, "");

        // For simplicity, generate a random 3-digit suffix. In production, you might get this from the sheet row count.
        const randomSuffix = Math.floor(Math.random() * 900 + 100);
        const registrationId = `EVT-${yyyymmdd}-${randomSuffix}`;

        // Append to sheet
        if (sheets && SHEET_ID) {
            const now = new Date().toISOString();
            const newRow = [
                registrationId,
                data.firstName,
                data.surname,
                data.email,
                data.phone,
                data.attendanceMode,
                data.attendedBefore,
                data.joiningFrom,
                data.employer,
                data.organization,
                data.description,
                data.aviationRole || "",
                "2026 International Women's Day", // Event Name
                "March 07, 2026", // Event Date
                now, // Registration Time
                "Confirmed", // Status
            ];

            await sheets.spreadsheets.values.append({
                spreadsheetId: SHEET_ID,
                range: "Sheet1!A:P",
                valueInputOption: "USER_ENTERED",
                requestBody: { values: [newRow] },
            });
        }

        // Send Emails
        try {
            console.log(`[Registration API] Emails temporarily disabled pending fixes. Skipping emails for registration ID ${registrationId}, attendee email ${data.email}`);
            
            /* -- TEMPORARILY DISABLED: 
            const adminEmail = process.env.ADMIN_EMAIL;

            // Attendee Email
            await sendEmail({
                to: data.email,
                subject: "Your Registration is Confirmed: 2026 International Women's Day",
                html: generateAttendeeConfirmationEmail(data.firstName, registrationId),
            });
            console.log(`[Registration API] Successfully sent attendee confirmation email to ${data.email}`);

            // Admin Email
            if (adminEmail) {
                console.log(`[Registration API] ADMIN_EMAIL configured. Sending notification to ${adminEmail}`);
                await sendEmail({
                    to: adminEmail,
                    subject: `New Event Registration: ${registrationId}`,
                    html: generateAdminNotificationEmail(data, registrationId),
                });
                console.log(`[Registration API] Successfully sent admin notification email to ${adminEmail}`);
            } else {
                console.log(`[Registration API] No ADMIN_EMAIL found in environment variables, skipping admin notification.`);
            }
            -- */
        } catch (emailError) {
            console.error("[Registration API] Email sending failed:", emailError);
        }

        return NextResponse.json({ success: true, registrationId }, { status: 201 });

    } catch (error: unknown) {
        console.error("Registration Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
