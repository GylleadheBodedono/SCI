import { google } from 'googleapis';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Prioritize Environment Variables (Vercel Production)
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'); // Fix newlines for Vercel
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '1FnOYddjOYdqx8kZgxvtWn2sLAejJYOWto1XMXa3n7ag'; // Fallback for safety or force env

let auth: any;

if (CLIENT_EMAIL && PRIVATE_KEY) {
    auth = new google.auth.JWT({
        email: CLIENT_EMAIL,
        key: PRIVATE_KEY,
        scopes: SCOPES,
    });
} else {
    // Fallback to local file for development (if needed/exists)
    // or just rely on GoogleAuth checking standard env vars
    const CREDENTIALS_PATH = path.join(process.cwd(), '..', 'sistema-de-gerenciamento-ifood-8c6392536fe2.json');
    auth = new google.auth.GoogleAuth({
        keyFile: CREDENTIALS_PATH,
        scopes: SCOPES,
    });
}

export const sheets = google.sheets({ version: 'v4', auth });

export async function getSheetData(range: string) {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range,
        });
        return response.data.values || [];
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        throw error;
    }
}

export async function appendRow(range: string, values: any[]) {
    try {
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [values],
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error appending row:', error);
        throw error;
    }
}

export async function getLastRow(sheetName: string): Promise<number> {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${sheetName}!A:A`, // Check column A to determine height
        });
        return response.data.values ? response.data.values.length : 0;
    } catch (error) {
        console.error('Error getting last row:', error);
        return 0;
    }
}

export async function updateRow(range: string, values: any[]) {
    try {
        console.log('[updateRow] Range:', range);
        console.log('[updateRow] Values:', values);
        console.log('[updateRow] SpreadsheetId:', SPREADSHEET_ID);
        
        const response = await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [values],
            },
        });
        
        console.log('[updateRow] Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('[updateRow] Error:', error);
        throw error;
    }
}

export async function deleteRow(range: string) {
    try {
        // Clear the row content (Google Sheets doesn't have a native "delete row" in API)
        // We clear all values in the row range
        const response = await sheets.spreadsheets.values.clear({
            spreadsheetId: SPREADSHEET_ID,
            range,
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting row:', error);
        throw error;
    }
}

/**
 * Get the Sheet ID (gid) for a given sheet name
 * Required for batchUpdate operations like deleting rows
 */
export async function getSheetId(sheetName: string): Promise<number> {
    try {
        const response = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
        });
        
        const sheet = response.data.sheets?.find(
            s => s.properties?.title === sheetName
        );
        
        if (!sheet?.properties?.sheetId) {
            throw new Error(`Sheet "${sheetName}" not found`);
        }
        
        return sheet.properties.sheetId;
    } catch (error) {
        console.error('Error getting sheet ID:', error);
        throw error;
    }
}

/**
 * Delete multiple rows at once (batch delete)
 * Rows are deleted from bottom to top to avoid index shifting issues
 * @param sheetName - Name of the sheet
 * @param rowNumbers - Array of row numbers (1-based, as shown in spreadsheet)
 */
export async function deleteMultipleRows(sheetName: string, rowNumbers: number[]) {
    try {
        if (rowNumbers.length === 0) {
            return { deletedRows: 0 };
        }

        const sheetId = await getSheetId(sheetName);
        
        // Sort row numbers in DESCENDING order to delete from bottom to top
        // This prevents index shifting issues
        const sortedRows = [...rowNumbers].sort((a, b) => b - a);
        
        // Create delete requests for each row
        const requests = sortedRows.map(rowNumber => ({
            deleteDimension: {
                range: {
                    sheetId: sheetId,
                    dimension: 'ROWS',
                    startIndex: rowNumber - 1, // 0-based index
                    endIndex: rowNumber,       // exclusive
                },
            },
        }));

        console.log(`[deleteMultipleRows] Deleting ${rowNumbers.length} rows: ${sortedRows.join(', ')}`);

        const response = await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: {
                requests,
            },
        });

        console.log(`[deleteMultipleRows] Deleted ${rowNumbers.length} rows successfully`);
        return { deletedRows: rowNumbers.length, response: response.data };
    } catch (error) {
        console.error('Error deleting multiple rows:', error);
        throw error;
    }
}

/**
 * Append multiple rows at once (batch insert)
 * Uses UPDATE method to ensure data is written to the correct columns (A:O)
 * The append API sometimes writes to wrong columns when sheet has data gaps
 */
export async function appendMultipleRows(sheetName: string, rows: any[][]) {
    try {
        if (rows.length === 0) {
            return { updatedRows: 0 };
        }

        // Get the last row number to know where to start inserting
        const lastRow = await getLastRow(sheetName);
        const startRow = lastRow + 1; // Start after the last row with data
        const endRow = startRow + rows.length - 1;
        
        // Build the exact range: sheetName!A{startRow}:O{endRow}
        const exactRange = `'${sheetName}'!A${startRow}:O${endRow}`;
        
        console.log(`[appendMultipleRows] Writing ${rows.length} rows to range: ${exactRange}`);
        
        const response = await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: exactRange,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: rows,
            },
        });
        
        console.log(`[appendMultipleRows] Result: ${JSON.stringify(response.data.updatedRange)}`);
        return response.data;
    } catch (error) {
        console.error('Error appending multiple rows:', error);
        throw error;
    }
}

/**
 * Update multiple cells at once using batchUpdate
 * @param updates - Array of { range: string, values: any[][] }
 */
export async function batchUpdateCells(updates: { range: string; values: any[][] }[]) {
    try {
        if (updates.length === 0) {
            return { updatedCells: 0 };
        }

        const data = updates.map(u => ({
            range: u.range,
            values: u.values,
        }));

        const response = await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: {
                valueInputOption: 'USER_ENTERED',
                data,
            },
        });

        console.log(`[batchUpdateCells] Updated ${response.data.totalUpdatedCells} cells`);
        return response.data;
    } catch (error) {
        console.error('Error batch updating cells:', error);
        throw error;
    }
}
