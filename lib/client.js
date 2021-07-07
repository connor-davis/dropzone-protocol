let HyProxy = require('hyproxy');
let hyproxy = new HyProxy();
let sodium = require('sodium-universal');
let { crypto_generichash, crypto_generichash_BYTES } = sodium;
let axios = require('axios');
let socketClient = require('socket.io-client');

let HttpClient = async (options = {}) => {
  let channelKey = Buffer.alloc(crypto_generichash_BYTES);

  crypto_generichash(channelKey, Buffer.from(options.serverKey));

  let channelKeyString = channelKey.toString('hex');

  let proxy = await hyproxy.outbound(
    channelKeyString,
    options.port,
    options.localHostname || 'localhost'
  );

  console.log('> Proxy ready on hyproxy://' + channelKeyString);

  try {
    return await axios.create({
      baseURL: `http://${proxy.host}:${proxy.port}`,
      timeout: options.timeout || 10000,
      keepAlive: true,
    });
  } catch (error) {
    proxy.server.close();
  }
};

let SocketClient = async (options = {}) => {
  let channelKey = Buffer.alloc(crypto_generichash_BYTES);

  crypto_generichash(channelKey, Buffer.from(options.serverKey));

  let channelKeyString = channelKey.toString('hex');

  console.log('> Socket proxy ready on hyproxy://' + channelKeyString);

  let proxy = await hyproxy.outbound(
    channelKeyString,
    options.port,
    options.localHostname || 'localhost'
  );

  try {
    let socket = socketClient(`http://${proxy.host}:${proxy.port}`);

    socket.on('disconnect', () => {
      proxy.server.close();
    });

    return socket;
  } catch (error) {
    proxy.server.close();
  }
};

module.exports = { HttpClient, SocketClient };
