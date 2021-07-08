let HyProxy = require('hyproxy');
let hyproxy = new HyProxy();
let sodium = require('sodium-universal');
let { crypto_generichash, crypto_generichash_BYTES } = sodium;
let axios = require('axios');
let socketClient = require('socket.io-client');

class HttpClient {
  constructor(options = {}) {
    this.channelKey = Buffer.alloc(crypto_generichash_BYTES);

    crypto_generichash(this.channelKey, Buffer.from(options.serverKey));

    this.channelKeyString = this.channelKey.toString('hex');

    console.log('> Http proxy ready on hyproxy://' + this.channelKeyString);

    return new Promise(async (resolve, reject) => {
      this.proxy = await hyproxy.outbound(
        this.channelKeyString,
        options.port,
        options.localHostname || 'localhost'
      );

      this.axios = await axios.create({
        baseURL: `http://${this.proxy.host}:${this.proxy.port}`,
        timeout: options.timeout || 10000,
        keepAlive: true,
      });

      resolve(this);
    });
  }

  destroy() {
    this.proxy.server.close();
    this.proxy.peers.clear();
    this.proxy = undefined;

    this.channelKey = undefined;
    this.channelKeyString = undefined;

    this.axios = undefined;
  }
}

class SocketClient {
  constructor(options = {}) {
    this.channelKey = Buffer.alloc(crypto_generichash_BYTES);

    crypto_generichash(this.channelKey, Buffer.from(options.serverKey));

    this.channelKeyString = this.channelKey.toString('hex');

    console.log('> Socket proxy ready on hyproxy://' + this.channelKeyString);

    (async () => {})();

    return new Promise(async (resolve, reject) => {
      this.proxy = await hyproxy.outbound(
        this.channelKeyString,
        options.port,
        options.localHostname || 'localhost'
      );

      this.socket = socketClient(
        `http://${this.proxy.host}:${this.proxy.port}`
      );

      resolve(this);
    });
  }

  destroy() {
    this.proxy.server.close();
    this.proxy.peers.clear();
    this.proxy = undefined;

    this.channelKey = undefined;
    this.channelKeyString = undefined;

    this.socket = undefined;
  }
}

module.exports = { HttpClient, SocketClient };
