const redis = require('redis');
const client = redis.createClient({
  port: 6379,
  host: '127.0.0.1',
});

client.on('connect', () => {
  console.log('redis connect');
});

client.on('ready', () => {
  console.log('ready');
});

client.on('error', (err) => {
  console.log('error ', err.message);
});

client.on('end', () => {
  console.log('redis ended');
});

process.on('SIGNIN', async () => {
  await client.quit();
});

module.exports = client;
