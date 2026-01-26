/**
 * Script to fetch Instagram profile pictures
 * Note: This uses an unofficial method that may break if Instagram changes their API
 * 
 * Usage: node scripts/fetch-instagram-profiles.js
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Instagram usernames mapped to roster IDs
const profiles = [
  { username: 'hlturner7', rosterId: 'harrison-turner' },
  { username: 'dillonyoung__', rosterId: 'dillon-young' },
  { username: 'arttukallio', rosterId: 'arttu-kallio' },
  { username: 'ameliehauke', rosterId: 'amelie-hauke' },
  { username: 'milo.romano00', rosterId: 'thomas-le' },
  { username: 'zento.mp3', rosterId: 'zento' },
  { username: 'red_light_dj', rosterId: 'red-light' },
  { username: 'michelle.ogunde', rosterId: 'blessing' },
];

// Alternative: Use a service like picuki.com or similar
// Or use: https://www.instagram.com/{username}/?__a=1 (may require authentication)

/**
 * Fetch profile picture URL from Instagram's public profile endpoint
 */
function fetchProfilePictureUrl(username) {
  return new Promise(async (resolve, reject) => {
    const url = `https://www.instagram.com/${username}/`;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    };
    
    https.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk.toString();
      });
      
      res.on('end', () => {
        // Method 1: Look for og:image meta tag (most reliable)
        const ogImageMatch = data.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
        if (ogImageMatch && ogImageMatch[1]) {
          const url = ogImageMatch[1].replace(/&amp;/g, '&');
          console.log(`✓ Found URL for ${username} (og:image)`);
          resolve(url);
          return;
        }
        
        // Method 2: Look for profile_pic_url in JSON data
        const jsonMatches = [
          data.match(/"profile_pic_url_hd"\s*:\s*"([^"]+)"/),
          data.match(/"profile_pic_url"\s*:\s*"([^"]+)"/),
          data.match(/profile_pic_url_hd["\s]*:["\s]*"([^"]+)"/),
        ];
        
        for (const match of jsonMatches) {
          if (match && match[1]) {
            const profilePicUrl = match[1]
              .replace(/\\u0026/g, '&')
              .replace(/\\\//g, '/')
              .replace(/\\"/g, '"')
              .replace(/&amp;/g, '&');
            console.log(`✓ Found URL for ${username} (JSON)`);
            resolve(profilePicUrl);
            return;
          }
        }
        
        // Method 3: Look for CDN URLs in the HTML
        const cdnMatches = [
          data.match(/(https:\/\/instagram\.fosl[^"'\s<>]+\.jpg[^"'\s<>]*)/),
          data.match(/(https:\/\/[^"'\s<>]*instagram[^"'\s<>]*\.jpg[^"'\s<>]*)/),
        ];
        
        for (const match of cdnMatches) {
          if (match && match[1] && match[1].includes('instagram')) {
            console.log(`✓ Found URL for ${username} (CDN)`);
            resolve(match[1]);
            return;
          }
        }
        
        console.log(`✗ Could not extract profile picture URL for ${username}`);
        reject(new Error(`Could not extract profile picture URL for ${username}`));
      });
      
      res.on('error', (err) => {
        console.error(`Response error for ${username}:`, err.message);
        reject(err);
      });
    }).on('error', (err) => {
      console.error(`Error fetching ${username}:`, err.message);
      reject(err);
    });
  });
}


// No need to create output directory - we're updating URLs directly in roster.json

// Fetch all profile picture URLs and update roster.json
async function fetchAll() {
  console.log('Fetching Instagram profile picture URLs...\n');
  
  const rosterPath = path.join(__dirname, '../public/data/roster.json');
  const rosterData = JSON.parse(fs.readFileSync(rosterPath, 'utf8'));
  
  for (const profile of profiles) {
    try {
      const profilePicUrl = await fetchProfilePictureUrl(profile.username);
      
      // Find the corresponding entry in roster.json
      let entry = rosterData.find(e => e.id === profile.rosterId);
      
      // If not found by ID, try to match by Instagram username in links
      if (!entry) {
        entry = rosterData.find(e => {
          if (!e.links?.instagram) return false;
          const instagramUrl = e.links.instagram.toLowerCase();
          const usernameLower = profile.username.toLowerCase();
          return instagramUrl.includes(usernameLower) || 
                 instagramUrl.includes(usernameLower.replace('_', '.')) ||
                 instagramUrl.includes(usernameLower.replace('.', '_'));
        });
      }
      
      if (entry) {
        entry.imageUrl = profilePicUrl;
        console.log(`  ✓ Updated ${entry.alias || entry.name} (${profile.username})`);
      } else {
        console.log(`  ✗ Could not find roster entry for ${profile.username}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limiting
    } catch (error) {
      console.error(`✗ Failed to fetch ${profile.username}: ${error.message}`);
    }
  }
  
  // Save updated roster.json
  fs.writeFileSync(rosterPath, JSON.stringify(rosterData, null, 2));
  console.log('\n✓ Updated roster.json with profile picture URLs!');
}

fetchAll();
