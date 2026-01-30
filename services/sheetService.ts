
// Service to handle Google Sheet synchronization
// Sheet ID provided: 16NIR_pYVujvyOTJ5FG6iZTF9donH6dPYn4UnNj2NMFw
import { VipUserInfo } from '../types';

const SHEET_ID = '16NIR_pYVujvyOTJ5FG6iZTF9donH6dPYn4UnNj2NMFw';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

export const fetchVipListFromSheet = async (): Promise<VipUserInfo[]> => {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error("Failed to connect to Cloud Database");
    }
    const text = await response.text();
    
    // Parse CSV
    // Expectation: 
    // Column A [0] = Email
    // Column B [1] = Date (Ngày)
    // Column C [2] = Time (Giờ)
    const users: VipUserInfo[] = text
      .split(/\r?\n/)
      .map(row => {
        const cols = row.split(',');
        const email = cols[0]?.trim().toLowerCase(); // Normalize to lowercase
        const date = cols[1]?.trim() || '';
        const time = cols[2]?.trim() || '';
        
        // Combine Date and Time
        const fullActivationTime = (date && time) ? `${date} - ${time}` : (date || time || 'N/A');

        return {
          email: email || '',
          activationTime: fullActivationTime
        };
      })
      .filter(u => u.email && u.email.includes('@') && u.email.length > 5);

    // Deduplicate based on email
    const uniqueUsers = new Map<string, VipUserInfo>();
    users.forEach(u => uniqueUsers.set(u.email, u));

    return Array.from(uniqueUsers.values());
  } catch (error) {
    console.error("Cloud Sync Error:", error);
    return [];
  }
};

export const openSheetForEditing = () => {
  window.open(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`, '_blank');
};
