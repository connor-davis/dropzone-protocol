let crypto = require('hypercore-crypto');

class DropZoneClient {
  constructor(options = {}) {
    /**
     * Set variables from options
     */
    this.key = options.key;
    this.port = options.port;

    let tunnel = require('./relay.js')();

    tunnel.client(Buffer.from(this.key, 'hex'), this.port);

    console.log(`> Tunnel forwarding to http://localhost:${this.port}`);
  }
}

module.exports = { DropZoneClient };
