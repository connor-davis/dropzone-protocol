let { Server, SocketServer } = require('.');

let server = new Server({
  serverKey: 'connordavis',
});

let { Router } = require('express');
let router = Router();

router.get('/', async (request, response) => {
  return response.status(200).json({
    message: 'Hello World!',
  });
});

server.use(router);

server.listen();

let socketServer = new SocketServer({
  serverKey: 'connordavis-socket',
});

socketServer.onConnect((socket) => {
  console.log('A new socket connection was established.');

  setTimeout(() => {
    socket.emit('ping');
  }, 100);

  socket.on('pong', () => console.log('Client ponged.'));
});

socketServer.listen();
