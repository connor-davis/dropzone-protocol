'use strict';
let dotenv = require('dotenv');
let express = require('express');
let http = require('http');
let { json, urlencoded } = require('body-parser');
let compression = require('compression');
let cors = require('cors');
let relay = require('./relay')();

dotenv.config();

class DropZoneServer {
  constructor(options = {}) {
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
    this.expressApp.use(compression());
    this.expressApp.use(cors());

    /**
     * Instance of httpServer
     * or use httpServer from options
     */
    this.httpServer = options.httpServer || http.createServer(this.expressApp);

    /**
     * Set variables from options
     */
    this.key = options.key;
    this.port = options.port;
    this.address = 'localhost';
  }

  use(...handlers) {
    this.expressApp.use(handlers);
  }

  use(route, ...handlers) {
    this.expressApp.use(route, handlers);
  }

  async listen(callback) {
    /**
     * Make server listen on the
     * port but hookup the proxy to
     * listen on the port.
     */
    this.httpServer.listen(this.port, async () => {
      console.log(`> Http listening on http://${this.address}:${this.port}`);

      this.publicKey = relay.serve(this.key, this.port, false, this.address);

      console.log(`> Relay listening on ${this.publicKey.toString('hex')}`);

      callback(this.publicKey);
    });
  }
}

module.exports = { DropZoneServer };
