let { Server } = require('.');
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
