import { NextResponse } from "next/server";
import { getGoogleSheets } from "@/lib/google-sheets";

export async function GET() {
    const SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const LIMIT = 180;

    if (!SHEET_ID) {
        // If no sheet ID configured, just return available
        return NextResponse.json({ onsiteCount: 0, onsiteLimit: LIMIT, onsiteAvailable: true });
    }

    try {
        const sheets = await getGoogleSheets();
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: "Sheet1!F:F", // Attendance Mode column
        });

        const rows = response.data.values || [];
        const count = rows.filter(row => row[0]?.toString().toLowerCase() === "onsite").length;

        return NextResponse.json({
            onsiteCount: count,
            onsiteLimit: LIMIT,
            onsiteAvailable: count < LIMIT,
        });
    } catch (error) {
        console.error("Capacity fetch error:", error);
        // Graceful fallback if sheet not accessible during development
        return NextResponse.json({ onsiteCount: 0, onsiteLimit: LIMIT, onsiteAvailable: true });
    }
}
