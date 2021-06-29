let { HttpClient, SocketClient } = require('.');
let openports = require('openports');

openports(2, async (error, ports) => {
  let client = await HttpClient({
    serverKey: 'connordavis',
    port: ports[0],
  });

  setTimeout(() => {
    client.get('/').then((response) => {
      console.log('Response from server', response.data);
    });
  }, 100);

  let socketClient = await SocketClient({
    serverKey: 'connordavis-socket',
    port: ports[1],
  });

  socketClient.on('ping', () => socketClient.emit('pong'));
});
