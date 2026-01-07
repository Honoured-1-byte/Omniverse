// test.js
const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.send('OK');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
