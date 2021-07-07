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

  let axios;

  try {
    let proxy = await hyproxy.outbound(
      channelKeyString,
      options.port,
      options.localHostname || 'localhost'
    );

    console.log('> Proxy ready on hyproxy://' + channelKeyString);

    axios = await axios.create({
      baseURL: `http://${proxy.host}:${proxy.port}`,
      timeout: options.timeout || 10000,
      keepAlive: true,
    });

    return axios;
  } catch (error) {
    return axios;
  }
};

let SocketClient = async (options = {}) => {
  let channelKey = Buffer.alloc(crypto_generichash_BYTES);

  crypto_generichash(channelKey, Buffer.from(options.serverKey));

  let channelKeyString = channelKey.toString('hex');

  console.log('> Socket proxy ready on hyproxy://' + channelKeyString);

  try {
    let socket;
    let proxy = await hyproxy.outbound(
      channelKeyString,
      options.port,
      options.localHostname || 'localhost'
    );

    socket = socketClient(`http://${proxy.host}:${proxy.port}`);

    return socket;
  } catch (error) {
    return socket;
  }
};

module.exports = { HttpClient, SocketClient };
