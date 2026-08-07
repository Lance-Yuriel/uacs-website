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
    // First, get the sheet metadata to understand the structure
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    });
    
    const sheetName = spreadsheet.data.sheets?.[0]?.properties?.title || 'Sheet1';
    
    // Get all data from the first column (assuming it contains member data)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: `${sheetName}!A:A`,
    });
    
    const rows = response.data.values;
    if (!rows || rows.length === 0) return 0;
    
    // Filter out empty rows and header row
    const validRows = rows.filter(row => row[0] && row[0].trim() !== '');
    
    // If the first row looks like a header (contains common header words), exclude it
    const firstRow = validRows[0]?.[0]?.toLowerCase() || '';
    const isHeader = ['name', 'email', 'member', 'id', 'date', 'timestamp'].some(header => 
      firstRow.includes(header)
    );
    
    const memberCount = isHeader ? validRows.length - 1 : validRows.length;
    
    console.log(`Google Sheets: Found ${memberCount} members (${validRows.length} total rows, header: ${isHeader})`);
    
    return Math.max(0, memberCount);
  } catch (error) {
    console.error('Error fetching member count:', error);
    throw new Error('Failed to fetch member count from Google Sheets');
  }
}

function parseDateString(dateStr: string): Date | null {
  if (!dateStr) return null;
  const cleanStr = dateStr.trim();
  
  // Match DD/MM/YYYY or DD-MM-YYYY with optional time
  const match = cleanStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    const date = new Date(year, month - 1, day);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  const fallbackDate = new Date(cleanStr);
  if (!isNaN(fallbackDate.getTime())) {
    return fallbackDate;
  }
  
  return null;
}

export async function getCurrentYearMemberCount(): Promise<number> {
  const sheets = google.sheets({ version: 'v4', auth });
  
  try {
    // Get the sheet metadata
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    });
    
    const sheetName = spreadsheet.data.sheets?.[0]?.properties?.title || 'Sheet1';
    
    // Get all data from the sheet (assuming columns: Name, Email, Date, etc.)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: `${sheetName}!A:Z`, // Get all columns to check for date column
    });
    
    const rows = response.data.values;
    if (!rows || rows.length === 0) return 0;
    
    const currentYear = new Date().getFullYear();
    let currentYearMembers = 0;
    
    // Find the date column (look for common date column names)
    const headerRow = rows[0] || [];
    const dateColumnIndex = headerRow.findIndex(header => {
      const headerLower = header?.toLowerCase() || '';
      return ['date', 'timestamp', 'joined', 'signup', 'created'].some(keyword => 
        headerLower.includes(keyword)
      );
    });
    
    if (dateColumnIndex !== -1) {
      // Filter by current year using the date column
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row && row[dateColumnIndex]) {
          const dateStr = row[dateColumnIndex];
          const date = parseDateString(dateStr);
          
          if (date && date.getFullYear() === currentYear) {
            currentYearMembers++;
          }
        }
      }
      
      console.log(`Google Sheets: Found ${currentYearMembers} members for ${currentYear}`);
      return currentYearMembers;
    } else {
      // No date column found, return total count
      console.log('No date column found, returning total member count');
      return await getMemberCount();
    }
  } catch (error) {
    console.error('Error fetching current year member count:', error);
    // Fallback to total count if there's an error
    return await getMemberCount();
  }
}

export async function getMemberCountWithTimestamp(): Promise<MemberCountResponse> {
  try {
    // Try to get current year count first, fallback to total count
    const count = await getCurrentYearMemberCount();
    return {
      count,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching member count with timestamp:', error);
    throw error;
  }
}
