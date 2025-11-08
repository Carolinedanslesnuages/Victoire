# CSV Export Feature - Usage Guide

## Feature Overview
The CSV Export feature allows users to export all their expense history to a CSV file that can be opened in Excel, Google Sheets, or any spreadsheet application.

## Location
The export feature is available in:
- **Settings Screen** → **Data Export** section

## How to Use

1. **Open Settings**
   - Tap the "⚙️ Settings" button on the home screen
   - Or navigate to Settings from the tab bar

2. **Find Data Export Section**
   - Scroll to the "Data Export" section
   - You'll see a description: "Export all your expense history to analyze in Excel or other tools"

3. **Export Your Data**
   - Tap the "📤 Export to CSV" button
   - If you have no expenses yet, you'll see a message: "No data to export"
   - If you have expenses, the system will:
     - Generate a CSV file with all your transactions
     - Open the native share dialog
     - Allow you to save or share the file

4. **File Details**
   - **Filename format**: `PACE_expenses_YYYY-MM-DD.csv`
   - **Example**: `PACE_expenses_2024-01-15.csv`

5. **Share Options**
   - Save to Files (iOS) / Downloads (Android)
   - Share via email
   - Save to cloud storage (iCloud, Google Drive, Dropbox)
   - Share with other apps

## CSV File Format

The exported CSV file contains the following columns:

```csv
Date,Amount,Description,Category
2024-01-15,25.50,"Grocery shopping","Food"
2024-01-14,50.00,"Gas station","Transportation"
2024-01-13,12.99,"Coffee","Leisure"
```

### Column Descriptions
- **Date**: Transaction date in YYYY-MM-DD format (ISO 8601)
- **Amount**: Transaction amount with 2 decimal places
- **Description**: Transaction description (quoted if contains special characters)
- **Category**: Transaction category (if assigned), or empty if no category

### CSV Features
- ✅ Sorted by date (most recent first)
- ✅ Proper escaping of quotes in descriptions
- ✅ Standard CSV format compatible with Excel
- ✅ UTF-8 encoding for international characters
- ✅ Empty category field if not assigned

## Example Use Cases

### 1. Personal Analysis in Excel
Export your data and create custom charts and pivot tables in Excel to analyze your spending patterns.

### 2. Tax Preparation
Export expenses for a specific period and share with your accountant or tax preparer.

### 3. Backup Before Reset
Export your data before resetting the app to keep a record of your expenses.

### 4. Data Portability
Move your expense data to another budgeting tool or personal finance system.

### 5. Long-term Archive
Create monthly or yearly archives of your expense history.

## Translations

The feature is available in:
- 🇬🇧 English
- 🇫🇷 French

## Technical Details

### Dependencies
- **expo-file-system**: For file creation and management
- **expo-sharing**: For native share dialog

### Data Source
The export includes ALL transactions stored in the app, not just the current budget cycle.

### File Location
The CSV file is temporarily created in the app's cache directory and can be saved to any location via the share dialog.

### Privacy
- Data is processed locally on your device
- No data is sent to external servers
- You have full control over where to save or share the file

## Troubleshooting

### "No data to export" message
- This means you haven't recorded any expenses yet
- Add some expenses first, then try exporting again

### Export button not working
- Make sure you have granted storage permissions (if prompted)
- Try restarting the app
- Check if you have available storage space

### Can't find the exported file
- Use the share dialog to save to a specific location
- On iOS: Save to Files app or iCloud Drive
- On Android: Save to Downloads folder or Google Drive

### Special characters in CSV
- Descriptions with quotes are properly escaped
- International characters (accents, etc.) are preserved
- Excel should automatically detect UTF-8 encoding

## Future Enhancements (Planned)

### Feature 7.2: Cloud Synchronization
A future update will add:
- Optional cloud backup
- Multi-device synchronization
- Anonymous or Apple/Google account login
- Automatic backup of your data

See `EPIC_7_SUMMARY.md` for more details.

## Support

If you encounter any issues with the export feature:
1. Check this guide for troubleshooting tips
2. Make sure you have the latest version of the app
3. Report issues on the GitHub repository

---

**Version**: 1.4.0+  
**Last Updated**: 2024-01-15
