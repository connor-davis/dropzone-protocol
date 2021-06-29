let HyProxy = require('hyproxy');
let hyproxy = new HyProxy();
let sodium = require('sodium-universal');
let { crypto_generichash, crypto_generichash_BYTES } = sodium;
let axios = require('axios');
let uuid = require('uuid');
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

  return await axios.create({
    baseURL: `http://${proxy.host}:${proxy.port}`,
    timeout: options.timeout || 10000,
  });
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

  return socketClient(`http://${proxy.host}:${proxy.port}`);
};

module.exports = { HttpClient, SocketClient };
