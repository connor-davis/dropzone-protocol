let { Client, SocketClient } = require('.');

(async () => {
  let client = await Client({
    serverKey: 'connordavis',
  });

  setTimeout(() => {
    client.get('/').then((response) => {
      console.log('Response from server', response.data);
    });
  }, 100);

  let socketClient = await SocketClient({
    serverKey: 'connordavis-socket',
  });

  socketClient.on('ping', () => socketClient.emit('pong'));
})();
