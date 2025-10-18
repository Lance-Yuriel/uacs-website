import { google } from 'googleapis';
import { MemberCountResponse } from '@/types/site';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

export async function getMemberCount(): Promise<number> {
  const sheets = google.sheets({ version: 'v4', auth });
  
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'Sheet1!A:A', // Adjust range to your sheet structure
    });
    
    const rows = response.data.values;
    if (!rows || rows.length === 0) return 0;
    
    // Subtract 1 for header row if your sheet has headers
    // Adjust this logic based on your actual sheet structure
    return rows.length - 1;
  } catch (error) {
    console.error('Error fetching member count:', error);
    throw new Error('Failed to fetch member count from Google Sheets');
  }
}

export async function getMemberCountWithTimestamp(): Promise<MemberCountResponse> {
  try {
    const count = await getMemberCount();
    return {
      count,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching member count with timestamp:', error);
    throw error;
  }
}
