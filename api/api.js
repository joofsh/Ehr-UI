import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import PrettyError from 'pretty-error';
import config from '../config';
import http from 'http'
import SocketIo from 'socket.io';

const pretty = new PrettyError;
const app = express();

const server = new http.Server(app);

const io = new SocketIo(server);
io.path('/ws');

var port = config.apiPort || 4000;

if (!config.apiPort) {
  console.error('No Api port specified in config');
}

const runnable = app.listen(port, (err) => {
  if (err) {
    console.error(err);
  }
  console.info('API is running on port %s', port);
});

io.on('connection', (socket) => {
  socket.on('api', () => {
  });

});

io.listen(runnable);
