require('dotenv').config();
const { google } = require('googleapis');

async function testGoogleSheets() {
  console.log('\n🔍 Checking environment variables...');
  console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✅ Set' : '❌ Missing');
  console.log('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY:', process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ? '✅ Set' : '❌ Missing');
  console.log('GOOGLE_SHEETS_ID:', process.env.GOOGLE_SHEETS_ID ? '✅ Set' : '❌ Missing');
  console.log('GOOGLE_SHEETS_RANGE:', process.env.GOOGLE_SHEETS_RANGE || 'Responses!A:E (default)');

  try {
    // Setup auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n')
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('\n📊 Fetching spreadsheet metadata...');
    
    // First, get the spreadsheet metadata to see available sheets
    const metadata = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID
    });

    console.log('✅ Connected to spreadsheet:', metadata.data.properties.title);
    console.log('\n📋 Available sheets/tabs:');
    metadata.data.sheets.forEach((sheet, index) => {
      console.log(`  ${index + 1}. ${sheet.properties.title}`);
    });

    // Try to write to the first sheet or "Responses" if it exists
    const targetSheet = metadata.data.sheets.find(s => s.properties.title === 'Responses') 
                        || metadata.data.sheets[0];
    
    const range = `${targetSheet.properties.title}!A:E`;
    console.log(`\n✏️  Writing test data to: ${range}`);
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          new Date().toISOString(),
          'Test User',
          'test@example.com',
          'Test Subject',
          'This is a test message from the backend setup'
        ]]
      }
    });

    console.log('✅ SUCCESS! Message written to Google Sheets');
    console.log('Updated range:', response.data.updates.updatedRange);
    console.log('\n🎉 Your Google Sheets integration is working!');
    console.log('Check your sheet:', `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEETS_ID}`);

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    
    if (error.message.includes('invalid_grant')) {
      console.log('\n🔴 Authentication failed - Your private key is malformed.');
      console.log('Check:');
      console.log('   1. Quotes around the key in .env');
      console.log('   2. \\n characters are preserved');
      console.log('   3. Key starts with -----BEGIN and ends with -----END');
    } else if (error.message.includes('404') || error.message.includes('not found')) {
      console.log('\n🔴 Sheet not found or not accessible.');
      console.log('Check:');
      console.log('   1. Sheet ID is correct:', process.env.GOOGLE_SHEETS_ID);
      console.log('   2. Sheet is shared with service account:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
      console.log('   3. Service account has Editor permissions');
    } else if (error.message.includes('Unable to parse range')) {
      console.log('\n🔴 Range format issue.');
      console.log('The sheet may not have a tab named "Responses".');
      console.log('Try creating a tab named "Responses" or update GOOGLE_SHEETS_RANGE in .env');
    } else {
      console.log('\n🔴 Unexpected error:', error.message);
      if (error.stack) {
        console.log('\nStack trace:', error.stack);
      }
    }
  }
}

testGoogleSheets();
