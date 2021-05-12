let HyProxy = require('hyproxy');
let hyproxy = new HyProxy();
let sodium = require('sodium-universal');
let { crypto_generichash, crypto_generichash_BYTES } = sodium;
let axios = require('axios');
let uuid = require('uuid');

let Client = async (options = { serverKey: 'dropzone' + uuid.v4() }) => {
  let channelKey = Buffer.alloc(crypto_generichash_BYTES);

  crypto_generichash(channelKey, Buffer.from(options.serverKey));

  let channelKeyString = channelKey.toString('hex');

  let proxy = await hyproxy.outbound(
    channelKeyString,
    options.localPort || 8081,
    options.localHostname || 'localhost'
  );

  console.log('> Proxy ready on hyproxy://' + channelKeyString);

  return await axios.create({
    baseURL: `http://${proxy.host}:${proxy.port}`,
    timeout: options.timeout || 10000,
  });
};

module.exports = Client;
