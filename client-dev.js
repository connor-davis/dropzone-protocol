let { DropZoneClient } = require('.');
let openports = require('openports');

openports(1, async (error, ports) => {
  let client = new DropZoneClient({ key: 'test', port: ports[0] });
});
