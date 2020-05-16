
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(createProxyMiddleware('/ws', { target: 'http://localhost:55555', ws: true }));
};