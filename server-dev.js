let { DropZoneServer } = require('.');
let openports = require('openports');
let { Router } = require('express');
let router = Router();

openports(1, async (error, ports) => {
  let server = new DropZoneServer({ key: 'Connor Davis', port: ports[0] });

  router.get('/', async (request, response) => {
    return response.status(200).json({ message: 'Hello World' });
  });

  server.use('/', router);

  server.listen();
});
