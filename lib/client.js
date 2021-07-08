let crypto = require('hypercore-crypto');

class DropZoneClient {
  constructor(options = {}) {
    /**
     * Set variables from options
     */
    this.key = options.key;
    this.port = options.port;

    let tunnel = require('./relay.js')();
    let keyPair = crypto.keyPair(crypto.data(Buffer.from(this.key)));
    let pubKey = keyPair.publicKey;

    tunnel.client(pubKey, this.port);

    console.log(`> Tunnel forwarding on http://localhost:${this.port}`);
  }
}

module.exports = { DropZoneClient };
