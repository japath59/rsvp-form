import { google } from "googleapis";

export async function POST(req) {
  const body = await req.json();
  const { name, email, attending, guests, message } = body;

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // important
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:F",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[new Date().toLocaleString(), name, email, attending ? "Yes" : "No", guests, message]],
      },
    });

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error("Error writing to Google Sheet:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
