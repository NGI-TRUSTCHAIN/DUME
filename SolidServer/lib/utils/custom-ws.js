const debug = require('debug')('ldnode:custom-ws-app');
const CustomWsServer = require('./custom-ws-server');
const path = require('path');

module.exports = function attachToServer(server, app, opts) {
  const customWsServer = new CustomWsServer(server, opts);

  if (app) {
    const handleRequest = (req, res, operation) => {
      const webid = req.session ? req.session.userId : null; // User WebID from session
      const resource = req.originalUrl || null; //Resource being accessed
      const origin = req.headers.origin || req.ip; //Place of origin of the call
      const userAgent = req.headers['user-agent'] || null; //

      // Capture response status code and trigger WebSocket notifications after the response is sent
      res.on('finish', () => {
        const statusCode = res.statusCode || null;

        // Notify for the specific resource
        customWsServer.publish(resource, operation, statusCode, webid, origin, userAgent);

      });
    };

    /* Capture HTTP methods on success calls
     Not working for the get method, get method is being captured at the get handler
     bad requests are being captured at access logging
    */
    ['post', 'patch', 'put', 'delete', 'get'].forEach(method => {
      app[method]('/*', (req, res, next) => {
        debug(`pub ${req.originalUrl} after ${method}`);
        handleRequest(req, res, method.toUpperCase());
        next();
      });
    });
  }

  return customWsServer;
};