import type { Person } from '../types';

const SPREADSHEET_ID = '1kwEoFWriKDDUtYmXiQ9L29g6kF4D48xkNzuXCk1gtxg';
const GID = '0';

/**
 * Fetches data from Google Sheets and converts it to Person array
 */
export async function fetchRosterFromGoogleSheets(): Promise<Person[]> {
  try {
    // Try multiple URL formats for Google Sheets CSV export
    const csvUrls = [
      `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${GID}`,
      `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`,
      `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv`,
    ];
    
    let csvText = '';
    let lastError: Error | null = null;
    
    // Try each URL format
    for (const csvUrl of csvUrls) {
      try {
        console.log('Trying to fetch from:', csvUrl);
        
        const response = await fetch(csvUrl, {
          mode: 'cors',
          credentials: 'omit',
        });
        
        console.log('Response status:', response.status, response.statusText);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`URL ${csvUrl} failed:`, response.status, errorText.substring(0, 200));
          lastError = new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
          continue;
        }
        
        csvText = await response.text();
        console.log('Successfully fetched CSV from:', csvUrl);
        break;
      } catch (err) {
        console.warn(`Error with URL ${csvUrl}:`, err);
        lastError = err as Error;
        continue;
      }
    }
    
    if (!csvText) {
      throw lastError || new Error('All CSV export URLs failed. Make sure the sheet is publicly accessible.');
    }
    
    console.log('CSV text length:', csvText.length);
    console.log('CSV preview (first 500 chars):', csvText.substring(0, 500));
    
    const rows = parseCSV(csvText);
    console.log('Parsed rows:', rows.length);
    console.log('First few rows:', rows.slice(0, 10));
    
    // Find the header row (look for "Alias" in any column)
    let headerRowIndex = -1;
    let aliasColIndex = -1;
    let socialsColIndex = -1;
    let bildeColIndex = -1;
    let navnColIndex = -1;
    let coColIndex = -1;
    let statusColIndex = -1;
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      // Check all columns for "Alias" (case-insensitive)
      for (let j = 0; j < row.length; j++) {
        const cell = row[j]?.toLowerCase().trim();
        if (cell === 'alias') {
          headerRowIndex = i;
          aliasColIndex = j;
          console.log(`Found header row at index ${i}, "Alias" is in column ${j}`);
          
          // Find other column indices
          for (let k = 0; k < row.length; k++) {
            const headerCell = row[k]?.toLowerCase().trim();
            if (headerCell === 'socials' || headerCell === 'sosiale medier' || headerCell === 'social') {
              socialsColIndex = k;
            } else if (headerCell === 'bilde' || headerCell === 'image' || headerCell === 'photo') {
              bildeColIndex = k;
            } else if (headerCell === 'navn' || headerCell === 'name') {
              navnColIndex = k;
            } else if (headerCell === 'co' || headerCell === 'country') {
              coColIndex = k;
            } else if (headerCell === 'status') {
              statusColIndex = k;
            }
          }
          
          console.log('Header row:', row);
          console.log('Column indices:', { aliasColIndex, socialsColIndex, bildeColIndex, navnColIndex, coColIndex, statusColIndex });
          break;
        }
      }
      if (headerRowIndex !== -1) break;
    }
    
    if (headerRowIndex === -1) {
      console.warn('Could not find header row with "Alias", starting from row 1');
      headerRowIndex = 0;
      // Fallback to old column indices
      aliasColIndex = aliasColIndex === -1 ? 1 : aliasColIndex;
      navnColIndex = navnColIndex === -1 ? 2 : navnColIndex;
      socialsColIndex = socialsColIndex === -1 ? 4 : socialsColIndex;
      bildeColIndex = bildeColIndex === -1 ? 5 : bildeColIndex;
      coColIndex = coColIndex === -1 ? 9 : coColIndex;
      statusColIndex = statusColIndex === -1 ? 10 : statusColIndex;
    }
    
    const roster: Person[] = [];
    
    // Start processing from the row after the header
    for (let i = headerRowIndex + 1; i < rows.length; i++) {
      const row = rows[i];
      
      // Skip empty rows or rows without alias
      const alias = aliasColIndex >= 0 ? row[aliasColIndex]?.trim() || '' : '';
      if (!alias) {
        console.log(`Skipping row ${i}: empty alias`);
        continue;
      }
      
      // Only include rows with status exactly "Er med" (case-insensitive)
      const status = statusColIndex >= 0 ? row[statusColIndex]?.trim() || '' : '';
      const statusLower = status.toLowerCase();
      
      if (statusLower !== 'er med') {
        console.log(`Skipping row ${i} (${alias}): status is not "Er med" - "${status}"`);
        continue;
      }
      
      console.log(`✓ Including row ${i} (${alias}): status="${status}"`);
      
      const name = navnColIndex >= 0 ? row[navnColIndex]?.trim() || '' : '';
      const socials = socialsColIndex >= 0 ? row[socialsColIndex]?.trim() || '' : '';
      const countryCode = coColIndex >= 0 ? row[coColIndex]?.trim() || '' : '';
      const imageInfo = bildeColIndex >= 0 ? row[bildeColIndex]?.trim() || '' : '';
      
      console.log(`Processing row ${i}:`, { alias, name, status, countryCode, socials, imageInfo });
      
      // Generate ID from alias (lowercase, replace spaces and special chars)
      const id = alias
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Parse social links from socials column
      const links = parseSocialLinks(socials);
      
      // Extract image URL from Bilde column
      const imageUrl = extractImageUrlFromBilde(imageInfo, id);
      
      // Check if links object has any properties
      const hasLinks = links && Object.keys(links).length > 0;
      
      roster.push({
        id,
        alias,
        name: name || alias,
        role: {
          no: 'DJ',
          en: 'DJ',
        },
        countryCode: countryCode || undefined,
        imageUrl: imageUrl || undefined,
        links: hasLinks ? links : undefined,
      });
    }
    
    console.log('Final roster count:', roster.length);
    console.log('Roster:', roster);
    
    return roster;
  } catch (error) {
    console.error('Error fetching roster from Google Sheets:', error);
    throw error;
  }
}

/**
 * Simple CSV parser
 */
function parseCSV(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;
  
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentCell += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of cell
      currentRow.push(currentCell);
      currentCell = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // End of row
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip \n after \r
      }
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }
  
  // Add last cell and row if any
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }
  
  return rows;
}

/**
 * Parses social links string and detects the type (Instagram, TikTok, etc.)
 */
function parseSocialLinks(socials: string): Person['links'] {
  const links: Person['links'] = {};
  
  if (!socials) return links;
  
  // Split by comma, semicolon, or newline to handle multiple links
  const parts = socials.split(/[,;\n]/).map(p => p.trim()).filter(p => p);
  
  for (const part of parts) {
    if (!part) continue;
    
    // Extract URLs (full URLs)
    const urlMatch = part.match(/(https?:\/\/[^\s,;]+)/i);
    if (urlMatch) {
      const url = urlMatch[1];
      const urlLower = url.toLowerCase();
      
      // Determine link type based on URL
      if (urlLower.includes('instagram.com')) {
        links.instagram = url;
      } else if (urlLower.includes('tiktok.com')) {
        links.tiktok = url;
      } else if (urlLower.includes('soundcloud.com')) {
        links.soundcloud = url;
      } else if (urlLower.includes('residentadvisor.net') || urlLower.includes('ra.co')) {
        links.residentAdvisor = url;
      } else if (urlLower.includes('@') && urlLower.includes('.')) {
        // Might be an email
        const emailMatch = url.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i);
        if (emailMatch) {
          links.email = emailMatch[1];
        }
      }
      continue;
    }
    
    // Handle @username format
    if (part.startsWith('@')) {
      const username = part.substring(1);
      // Default to Instagram for @username
      if (!links.instagram && username.length > 0) {
        links.instagram = `https://instagram.com/${username}`;
      }
      continue;
    }
    
    // Handle plain usernames (assume Instagram)
    if (/^[a-zA-Z0-9._]+$/.test(part) && !part.includes('@')) {
      if (!links.instagram && part.length > 0) {
        links.instagram = `https://instagram.com/${part}`;
      }
      continue;
    }
  }
  
  return links;
}

/**
 * Extracts image URL from the Bilde column
 * Supports:
 * - Direct image URLs (any http/https URL)
 * - Google Drive shareable links (converts to direct image URL)
 * - Falls back to local image path if no URL found
 */
function extractImageUrlFromBilde(bilde: string, id: string): string | null {
  if (!bilde) {
    // No image provided
    return null;
  }
  
  // Try to extract URL from the cell content
  const urlMatch = bilde.match(/(https?:\/\/[^\s"<>]+)/i);
  if (urlMatch) {
    let url = urlMatch[1];
    
    // Convert Google Drive shareable links to direct image URLs
    if (url.includes('drive.google.com')) {
      // Extract file ID from various Google Drive URL formats:
      // - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
      // - https://drive.google.com/open?id=FILE_ID
      // - https://drive.google.com/uc?id=FILE_ID
      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)|[?&]id=([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        const fileId = fileIdMatch[1] || fileIdMatch[2];
        // Convert to direct image URL (thumbnail format, can be resized)
        // Using sz parameter: w1000 = width 1000px, or w1920 for full size
        url = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1920`;
        console.log(`Converted Google Drive link to direct image URL: ${url}`);
      }
    }
    
    // If it's already a direct image URL (jpg, png, webp, etc.) or Google Drive thumbnail, use it
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i) || url.includes('drive.google.com/thumbnail') || url.includes('googleusercontent.com')) {
      return url;
    }
    
    // For other URLs, try to use them as-is (might work for some image hosting services)
    return url;
  }
  
  // If no valid URL found, return null (no image)
  return null;
}
