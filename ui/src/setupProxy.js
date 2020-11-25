
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(createProxyMiddleware('/_s', { target: 'http://localhost:10101', ws: true }));
};