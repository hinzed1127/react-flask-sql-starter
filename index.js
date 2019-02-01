const bodyParser = require('body-parser');
const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const proxy = httpProxy.createProxyServer();

app.all('*', (req, res) => {
  proxy.web(req, res, { target: `http://localhost:3002` }, (e) => {
    res.end('Try again');
  });
});

// app.all('*', (req, res) => {
//   proxy.web(req, res, { target: `http://localhost:3001` }, (e) => {
//     res.end('Try again');
//   });
// });

const listener = app.listen(process.env.PORT, function () {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
