import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';
import transform from './transform';
import config from './credentials';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'token.json';

/**
 * @param {google.auth.OAuth2} oAuth2Client
 * @param {getEventsCallback} callback
 */
const getNewToken = (oAuth2Client, callback) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      writeNewFile(TOKEN_PATH, JSON.stringify(token));
      callback(oAuth2Client);
    });
  });
};


/**
 * @param {Object} credentials
 * @param {function} callback
 */
const authorize = (credentials, callback) => {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0],
  );
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
};


const writeNewFile = (filePath, data) => {
  fs.writeFile(filePath, data, (err) => {
    if (err) return console.error(err);
    console.log('Data stored to', filePath);
  });
};

/**
 * @param {google.auth.OAuth2} auth
 */
async function listMajors(auth) {
  const sheets = await google.sheets({ version: 'v4', auth });
  await sheets.spreadsheets.values.batchGet({
    spreadsheetId: '1nvAg7nLRx1kcOHB6JIvj8NXLpWZtlboxAFK43_EhUv8',
    ranges: ['IPHONES!A3:J66', 'IPHONES!L3:U66'],
  }, (err, res) => {
    if (err) return console.log(`The API returned an error: ${err}`);
    const buyRequest = transform(res.data.valueRanges[0].values);
    const sellRequest = transform(res.data.valueRanges[1].values);
      writeNewFile('./api/buyRequest.json', JSON.stringify(buyRequest));
      writeNewFile('./api/sellRequest.json', JSON.stringify(sellRequest));
  });
}

const run = () => {
  if (!config) return console.log('Error loading client secret file');
  authorize(config, listMajors);
};

export default run;
