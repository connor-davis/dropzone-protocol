#!/usr/bin/env node

let DropZoneProtocol = require('.');

let dropzone = new DropZoneProtocol();

let api = require('./api');

dropzone.use('/api', api);

dropzone.listen();
