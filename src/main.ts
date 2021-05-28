/* eslint-disable linebreak-style */
import http from 'http';
import App from './app';

const app = new App();

http
  .createServer(app.app)
  .listen(app.app.get('port'), () => console.log('Server is running on port ', app.app.get('port')));
