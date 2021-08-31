const sodium = require('sodium-native');
const crypto = require('hypercore-crypto');

let keyPair = crypto.keyPair(crypto.data(Buffer.from('Connor Davis')));
let signature = crypto.sign(
  Buffer.from('Hello World'),
  Buffer.from(keyPair.secretKey.toString('hex'), 'hex')
);

console.log(keyPair.publicKey.toString('hex'));
console.log(keyPair.secretKey.toString('hex'));

console.log(signature.length);
console.log(signature.toString('hex'));

console.log(crypto.validateKeyPair(keyPair));

const sig1 = Buffer.from(signature.toString('hex'), 'hex');
const pub1 = Buffer.from(keyPair.publicKey.toString('hex'), 'hex');
const msg1 = Buffer.from('Hello World');

console.log(sodium.crypto_sign_verify_detached(sig1, msg1, pub1));

const sig = Buffer.from(
  'b51792ee156cfbe8f76f0974acaa2f16d7fb1928c241c9af569a1f4d5f56fd34488d208f3f1cbcd369e58c43f13b72141414c008e5b0a34ca92294c3331f000e',
  'hex'
);
const pub = Buffer.from(
  '6D67BB7194E5485E9AE21C20D5B8A01A94CBE3576BEA00881D595CB8E2464DA2',
  'hex'
);
const msg = Buffer.from('Hello World');

console.log(sodium.crypto_sign_verify_detached(sig, msg, pub));
