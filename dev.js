#!/usr/bin/env node

let { Server } = require('.');

let dropzone = new Server();

let api = require('./api');

dropzone.use('/api', api);

dropzone.listen();
