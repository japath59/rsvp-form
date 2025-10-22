import { google } from "googleapis";
import fs from "fs";

export async function POST(req) {
  const body = await req.json();
  const { name, email, attending, guests, message } = body;

  try {
    // Load Google credentials from JSON file
    const credentials = JSON.parse(fs.readFileSync(process.env.GOOGLE_CREDENTIALS_PATH, "utf8"));

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Append the form data to your Sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:F",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toLocaleString(),
            name,
            email,
            attending ? "Yes" : "No",
            guests,
            message
          ]
        ]
      }
    });

    return new Response(JSON.stringify({ success: true, result: response.data }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error appending to Google Sheet:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const credentials = JSON.parse(fs.readFileSync(process.env.GOOGLE_CREDENTIALS_PATH, "utf8"));

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Read RSVPs back from the sheet
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:F",
    });

    const rows = result.data.values || [];
    return new Response(JSON.stringify({ success: true, guests: rows }), { status: 200 });
  } catch (error) {
    console.error("Error reading from Google Sheet:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
