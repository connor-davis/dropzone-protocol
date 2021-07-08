let { HttpClient, SocketClient } = require('.');
let openports = require('openports');

openports(2, async (error, ports) => {
  let client = await new HttpClient({
    serverKey: 'connordavis.co.za',
    port: ports[0],
  });

  let socketClient = await new SocketClient({
    serverKey: 'connordavis.co.za-socket',
    port: ports[1],
  });

  socketClient.on('ping', () => {
    socketClient.emit('pong');
    client.get('/').then((response) => {
      console.log('Response from server', response.data);
    });
  });
});
