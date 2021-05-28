/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable linebreak-style */

/* eslint-disable consistent-return */
import fs, { promises as fsp } from 'fs';
import readline from 'readline';
import util from 'util';
import { google } from 'googleapis';

type credInstall = {
  client_secret: string;
  client_id: string;
  redirect_uris: string;
};

type cred = {
  installed: credInstall;
};

export default class GetDataFromSheet {
  private sheet: any;

  private dataFromSheet = [];

  private oAuth2Client: any;

  private SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

  private TOKEN_PATH = 'token.json';

  // eslint-disable-next-line class-methods-use-this
  private async readDataFromFile(path: string): Promise<string> {
    // eslint-disable-next-line no-useless-catch
    try {
      const data = await fsp.readFile(path, 'utf8');
      return data;
    } catch (e: any) {
      throw e;
    }
  }

  private async listAll() {
    const utilGet = util.promisify(this.sheet.spreadsheets.values.get).bind(this.sheet);
    const buyRequest = utilGet({
      spreadsheetId: '1F6BvjBRKMf6cVTzrb3O-4uORjnhHN0I6DC9jkuxQibo',
      range: 'IPHONES!A1:J',
      alt: 'json',
    });
    const sellRequest = utilGet({
      spreadsheetId: '1F6BvjBRKMf6cVTzrb3O-4uORjnhHN0I6DC9jkuxQibo',
      range: 'IPHONES!L1:U',
      alt: 'json',
    });
    return Promise.all([buyRequest, sellRequest]);
  }

  private async getNewToken() {
    const authUrl = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      // eslint-disable-next-line no-mixed-spaces-and-tabs
      scope: this.SCOPES,
    });
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code: string | number) => {
      rl.close();
      this.oAuth2Client.getToken(code, (err: any, token: any) => {
        if (err) {
          return console.log('Error while trying to retrieve access token', err);
        }
        this.oAuth2Client.setCredentials(token);
        this.sheet = google.sheets({ version: 'v4', auth: this.oAuth2Client });

        // eslint-disable-next-line consistent-return
        fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (error: any) => {
          if (error) return console.log(err);
        });
        return this.listAll();
      });
    });
  }

  async authorize(): Promise<any> {
    let data: string;
    let token: string;
    // eslint-disable-next-line no-useless-catch
    try {
      data = await this.readDataFromFile('credential.json');
    } catch (e: any) {
      throw e;
    }
    if (data) {
      const credential: cred = JSON.parse(data);
      const { client_secret, client_id, redirect_uris } = credential.installed;
      this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
      try {
        token = await this.readDataFromFile(this.TOKEN_PATH);
        this.oAuth2Client.setCredentials(JSON.parse(token));
        this.sheet = google.sheets({ version: 'v4', auth: this.oAuth2Client });
        return this.listAll();
      } catch (e) {
        return this.getNewToken();
      }
    }
  }
}
