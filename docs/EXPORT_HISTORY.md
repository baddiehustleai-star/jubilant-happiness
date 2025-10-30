# Export History & Download Center

This document describes the Export History & Download Center feature implementation for Photo2Profit.

## Overview

The Export History & Download Center is a comprehensive feature that allows users to:

1. Generate CSV exports for multiple resale platforms (Mercari, Depop, Poshmark, eBay)
2. View and download their export history
3. Receive automated weekly exports via email with AI-generated market insights

## Features Implemented

### 1. CSV Adapters for Multiple Platforms

Location: `src/utils/csvAdapters.js`

Supports CSV generation for:
- **Mercari**: Title, Description, Price, Category, Brand, Condition, Shipping, Weight, Photos
- **Depop**: Title, Description, Price, Category, Size, Brand, Condition, Color, Style, Images
- **Poshmark**: Title, Description, Price, Original Price, Category, Subcategory, Brand, Size, Color, Condition, Tags, Photos
- **eBay**: Title, Description, StartPrice, BuyItNowPrice, Category, Brand, Condition, Format, Quantity, Shipping details

### 2. Firebase Integration

Location: `src/config/firebase.js`

Integrates Firebase services:
- **Firebase Storage**: For storing CSV files
- **Firestore**: For logging export history
- **Firebase Auth**: For user authentication

Configuration is managed via environment variables (see `.env.example`).

### 3. Export Service

Location: `src/utils/exportService.js`

Key functions:
- `generateAndUploadExport()`: Generates CSV, uploads to Storage, logs to Firestore
- `getUserExportHistory()`: Retrieves user's export history
- `uploadCSVToStorage()`: Handles file upload to Firebase Storage
- `logExportToFirestore()`: Records export metadata

### 4. Export History Component

Location: `src/components/ExportHistory.jsx`

A React component that:
- Displays export history in a table format
- Shows platform badges with color coding
- Provides download buttons for each export
- Includes loading and error states
- Auto-refreshes after new exports

### 5. Dashboard Page

Location: `src/pages/Dashboard.jsx`

Features:
- Platform selection (Mercari, Depop, Poshmark, eBay)
- One-click CSV generation
- Real-time export status updates
- Integrated Export History view
- Demo mode with sample listings

### 6. Weekly Automation Function

Location: `functions/index.js`

Firebase Cloud Functions for:

#### `weeklyExportAutomation`
- Runs every Sunday at 9 AM EST
- Processes all users with auto-export enabled
- Refreshes pricing data
- Generates CSVs for all configured platforms
- Uploads to Firebase Storage with signed URLs
- Logs exports to Firestore
- Generates AI market trend summary
- Sends email notifications via SendGrid

#### `generateExport`
- HTTP callable function for manual export generation
- Authenticated users only
- Generates and uploads CSV for specified platform
- Returns download URL

### 7. Email Notifications

Automated weekly emails include:
- AI-generated market trend summary
- Download links for all platform exports (7-day expiry)
- Professional HTML formatting with branding
- Platform-specific item counts

## Setup Instructions

### 1. Install Dependencies

```bash
# Frontend dependencies
npm install

# Cloud Functions dependencies
cd functions
npm install
cd ..
```

### 2. Configure Firebase

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firebase Storage and Firestore
3. Copy `.env.example` to `.env` and fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Configure SendGrid

1. Create a SendGrid account at https://sendgrid.com
2. Create an API key with Mail Send permissions
3. Set up Firebase Functions config:

```bash
firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY"
```

Or set environment variable:
```bash
export SENDGRID_API_KEY="YOUR_SENDGRID_API_KEY"
```

### 4. Deploy Cloud Functions

```bash
firebase deploy --only functions
```

### 5. Firestore Setup

Create the following collections:
- `users`: Store user profiles with `autoExport` boolean field
- `listings`: Store product listings with user reference
- `exports`: Auto-created by the export service

Set up Firestore rules to secure your data.

## Usage

### For Users

1. Navigate to the Dashboard at `/dashboard`
2. Select a platform (Mercari, Depop, Poshmark, or eBay)
3. Click "Generate CSV Export"
4. View export in the Export History table below
5. Click "Download" to get the CSV file

### For Developers

#### Generate Export Programmatically

```javascript
import { generateAndUploadExport } from './utils/exportService';

const listings = [
  {
    title: 'Product Name',
    description: 'Product description',
    price: '29.99',
    category: 'Category',
    brand: 'Brand Name',
    // ... other fields
  }
];

const result = await generateAndUploadExport(listings, 'mercari', userId);
console.log('Download URL:', result.downloadURL);
```

#### Retrieve Export History

```javascript
import { getUserExportHistory } from './utils/exportService';

const exports = await getUserExportHistory(userId, 50);
console.log('User exports:', exports);
```

## File Structure

```
src/
├── config/
│   └── firebase.js              # Firebase configuration
├── utils/
│   ├── csvAdapters.js          # CSV generation for each platform
│   └── exportService.js        # Export logic and Firebase interaction
├── components/
│   └── ExportHistory.jsx       # Export history table component
└── pages/
    ├── Landing.jsx             # Landing page
    └── Dashboard.jsx           # Main dashboard with export features

functions/
├── package.json                # Cloud Functions dependencies
└── index.js                    # Cloud Functions (weekly automation, etc.)
```

## API Reference

### Export Service Functions

#### `generateAndUploadExport(listings, platform, userId)`
Generates CSV and uploads to Firebase.

**Parameters:**
- `listings` (Array): Array of listing objects
- `platform` (String): Platform name ('mercari', 'depop', 'poshmark', 'ebay')
- `userId` (String): User ID

**Returns:** Promise with export result object

#### `getUserExportHistory(userId, limitCount)`
Retrieves user's export history from Firestore.

**Parameters:**
- `userId` (String): User ID
- `limitCount` (Number): Maximum number of exports to retrieve (default: 50)

**Returns:** Promise with array of export records

### CSV Adapter Functions

Each platform has a dedicated generator function:
- `generateMercariCSV(listings)`
- `generateDepopCSV(listings)`
- `generatePoshmarkCSV(listings)`
- `generateEbayCSV(listings)`

All accept an array of listing objects and return a CSV string.

## Cloud Functions

### `weeklyExportAutomation`
Scheduled function that runs weekly.

**Schedule:** Every Sunday at 9 AM EST

**Process:**
1. Fetch users with `autoExport: true`
2. Get user's active listings
3. Generate CSVs for configured platforms
4. Upload to Firebase Storage
5. Generate AI market trends
6. Send email with download links

### `generateExport`
HTTP callable function for manual exports.

**Usage:**
```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const generateExport = httpsCallable(functions, 'generateExport');

const result = await generateExport({
  listings: [...],
  platform: 'mercari'
});
```

## Customization

### Adding New Platforms

1. Add CSV adapter in `src/utils/csvAdapters.js`:
```javascript
export function generateNewPlatformCSV(listings) {
  return listings.map(item => ({
    'Field1': item.field1,
    'Field2': item.field2,
    // ... map your fields
  }));
}
```

2. Update `getCSVGenerator()` to include new platform
3. Add platform option in Dashboard UI
4. Update Cloud Function's `generateCSVForPlatform()`

### Customizing Email Templates

Edit the email template in `functions/index.js`, `sendWeeklyExportEmail()` function.

### Adjusting Automation Schedule

Modify the cron expression in `weeklyExportAutomation`:
```javascript
.schedule('0 9 * * 0') // Change to your desired schedule
```

## Security Considerations

1. **Firebase Rules**: Set up proper Firestore and Storage security rules
2. **Authentication**: Ensure users can only access their own exports
3. **Signed URLs**: Download URLs expire after 7 days by default
4. **Environment Variables**: Never commit `.env` file to version control
5. **SendGrid API Key**: Keep secure and rotate regularly

## Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### Firebase Connection Issues
- Verify `.env` file has correct credentials
- Check Firebase project settings
- Ensure billing is enabled for Cloud Functions

### Email Not Sending
- Verify SendGrid API key is configured
- Check SendGrid sender verification
- Review Cloud Functions logs: `firebase functions:log`

## Future Enhancements

- [ ] Real AI integration for market trends (OpenAI, Anthropic)
- [ ] User preferences for email frequency
- [ ] Bulk export to multiple platforms simultaneously
- [ ] Export templates and customization
- [ ] Integration with actual platform APIs (when available)
- [ ] Analytics dashboard for export performance
- [ ] Price optimization recommendations

## Support

For issues or questions:
1. Check Firebase Console logs
2. Review Cloud Functions logs
3. Verify environment configuration
4. Check Firestore security rules

## License

See [LICENSE](../LICENSE) for details.
