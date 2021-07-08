let { DropZoneClient } = require('.');
let openports = require('openports');

openports(1, async (error, ports) => {
  let client = new DropZoneClient({ key: 'fe1c07ad89390d67f6eb199e2f89547d5d7ee7f894ca6b4f6b0b7b4fbb64a1f8', port: ports[0] });
});
