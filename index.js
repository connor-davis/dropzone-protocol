'use strict';
let dotenv = require('dotenv');
let express = require('express');
let http = require('http');
let uuid = require('uuid');
let { json, urlencoded } = require('body-parser');
let HyProxy = require('hyproxy');
let hyproxy = new HyProxy();
let sodium = require('sodium-universal');
let { crypto_generichash, crypto_generichash_BYTES } = sodium;

dotenv.config();

class DropZoneProtocol {
  constructor(options = {}) {
    /**
     * Set variables from options
     */
    this.serverKey = options.serverKey || 'dropzone-' + uuid.v4();

    /**
     * Instance of express
     * or use expressApp from options
     */
    this.expressApp = options.expressApp || express();

    /**
     * Make expressApp use libraries
     */
    this.expressApp.use(json());
    this.expressApp.use(urlencoded({ extended: false }));

    /**
     * Instance of httpServer
     * or use httpServer from options
     */
    this.httpServer = options.httpServer || http.createServer(this.expressApp);

    /**
     * Environment port or port from
     * options or default port 8080
     */
    this.port = options.port || process.env.port || 8080;
  }

  use(...handlers) {
    this.expressApp.use(handlers);
  }

  use(route, ...handlers) {
    this.expressApp.use(route, handlers);
  }

  async listen() {
    /**
     * Make server listen on the
     * port but hookup the proxy to
     * listen on the port.
     */
    this.httpServer.listen(this.port, async () => {
      console.log(`> Listening on http://localhost:${this.port}`);

      let channelKey = Buffer.alloc(crypto_generichash_BYTES);

      crypto_generichash(channelKey, Buffer.from(this.serverKey));

      let channelKeyString = channelKey.toString('hex');

      await hyproxy.inbound(channelKeyString, this.port, 'localhost');

      console.log('> Proxy ready on hyper://' + channelKeyString);
    });
  }
}

module.exports = DropZoneProtocol;
