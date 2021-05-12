let { Client } = require('.');

(async () => {
  let client = await Client({
    serverKey: 'connordavis',
  });

  setTimeout(() => {
    client.get('/').then((response) => {
      console.log(response);
    });
  }, 100);
})();
