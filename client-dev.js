let { DropZoneClient } = require('.');
let openports = require('openports');

openports(1, async (error, ports) => {
  let client = new DropZoneClient({
    key: 'df9844b69d5d5957826f6bea936b64e4ef7408879bb92a1204437c9940fa9a1a',
    port: ports[0],
  });
});
