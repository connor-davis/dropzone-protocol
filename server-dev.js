let { ExpressServer, SocketServer } = require('.');
let openports = require('openports');

openports(2, async (error, ports) => {
  let server = new ExpressServer({
    serverKey: 'connordavis.co.za',
    port: ports[0],
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
    serverKey: 'connordavis.co.za-socket',
    port: ports[1],
  });

  socketServer.onConnect((socket) => {
    console.log('A new socket connection was established.');

    setTimeout(() => {
      socket.emit('ping');
    }, 100);

    socket.on('pong', () => console.log('Client ponged.'));
  });

  socketServer.listen();
});