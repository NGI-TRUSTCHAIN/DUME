module.exports = createServer

const express = require('express')
const fs = require('fs')
const https = require('https')
const http = require('http')
//const SolidWs = require('solid-ws')
const debug = require('./debug')
const createApp = require('./create-app')
const globalTunnel = require('global-tunnel-ng')
const CustomWebSocket = require('./utils/custom-ws');

function createServer (argv, app) {
  argv = argv || {}
  app = app || express()
  const ldpApp = createApp(argv)
  const ldp = ldpApp.locals.ldp || {}
  let mount = argv.mount || '/'
  // Removing ending '/'
  if (mount.length > 1 &&
    mount[mount.length - 1] === '/') {
    mount = mount.slice(0, -1)
  }
  app.use(mount, ldpApp)
  debug.settings('Base URL (--mount): ' + mount)

  if (argv.idp) {
    console.warn('The idp configuration option has been renamed to multiuser.')
    argv.multiuser = argv.idp
    delete argv.idp
  }

  if (argv.httpProxy) {
    globalTunnel.initialize(argv.httpProxy)
  }

  let server
  const needsTLS = argv.sslKey || argv.sslCert
  if (!needsTLS) {
    server = http.createServer(app)
  } else {
    debug.settings('SSL Private Key path: ' + argv.sslKey)
    debug.settings('SSL Certificate path: ' + argv.sslCert)

    if (!argv.sslCert && !argv.sslKey) {
      throw new Error('Missing SSL cert and SSL key to enable WebIDs')
    }

    if (!argv.sslKey && argv.sslCert) {
      throw new Error('Missing path for SSL key')
    }

    if (!argv.sslCert && argv.sslKey) {
      throw new Error('Missing path for SSL cert')
    }

    let key
    try {
      key = fs.readFileSync(argv.sslKey)
    } catch (e) {
      throw new Error('Can\'t find SSL key in ' + argv.sslKey)
    }

    let cert
    try {
      cert = fs.readFileSync(argv.sslCert)
    } catch (e) {
      throw new Error('Can\'t find SSL cert in ' + argv.sslCert)
    }

    const credentials = Object.assign({
      key: key,
      cert: cert
    }, argv)

    if (ldp.webid && ldp.auth === 'tls') {
      credentials.requestCert = true
    }

    server = https.createServer(credentials, app)
  }

  // Look for port or list of ports to redirect to argv.port
  if ('redirectHttpFrom' in argv) {
    const redirectHttpFroms = argv.redirectHttpFrom.constructor === Array
      ? argv.redirectHttpFrom
      : [argv.redirectHttpFrom]
    const portStr = argv.port === 443 ? '' : ':' + argv.port
    redirectHttpFroms.forEach(redirectHttpFrom => {
      debug.settings('will redirect from port ' + redirectHttpFrom + ' to port ' + argv.port)
      const redirectingServer = express()
      redirectingServer.get('*', function (req, res) {
        const host = req.headers.host.split(':') // ignore port
        debug.server(host, '=> https://' + host + portStr + req.url)
        res.redirect('https://' + host + portStr + req.url)
      })
      redirectingServer.listen(redirectHttpFrom)
    })
  }

  // Setup Express app
   /*if (ldp.live) {
    const solidWs = SolidWs(server, ldpApp)
    ldpApp.locals.ldp.live = solidWs.publish.bind(solidWs)
  }*/

  /**
   * @api {wss} wss://userpod.dume-arditi.com/ Subscribe to WebSocket
   * @apiName SubscribeWebSocket
   * @apiGroup WebSocket
   * @apiVersion 1.0.0
   * @apiHeader {String} [Authorization] Bearer [token] Optional user access token for private folders
   * @apiDescription Establish a WebSocket connection with the server and subscribe to a folder.
   *
   * You can subscribe to public folders without an authorization token. If you attempt to subscribe to private folders without a token, you will receive an error message.
   *
   * @apiExample {js} Example usage for public folder:
   *     const ws = new WebSocket('wss://userpod.dume-arditi.com/');
   *
   *     ws.onopen = function() {
   *         // Subscribe to a public folder
   *         ws.send('sub /public/');
   *     };
   *
   *     ws.onmessage = function(event) {
   *         console.log('Message from server ', event.data);
   *     };
   *
   * @apiExample {js} Example usage for private folder:
   *     const ws = new WebSocket('wss://userpod.dume-arditi.com/', {
   *         headers: {
   *             'Authorization': 'Bearer [token]'
   *         }
   *     });
   *
   *     ws.onopen = function() {
   *         // Subscribe to a private folder
   *         //ws.send('sub /private-folder/');
   *         ws.send('sub /theia-vision/');
   *     };
   *
   *     ws.onmessage = function(event) {
   *         console.log('Message from server ', event.data);
   *     };
   *
   * @apiSuccess {String} ack [folder] Acknowledgement message indicating a successful subscription.
   * @apiSuccess {String} pub [resource] Notification message indicating a change or operation on the subscribed resource.
   * @apiSuccessExample {String} Successful Subscription Acknowledgement:
   *     ack /theia-vision/
   *
   * @apiSuccessExample {String} Notification Example:
   *     pub /theia-vision/ operation=GET statusCode=200 webid=https://userpod.dume-arditi.com/profile/card#me origin=::ffff:10.3.9.46 resource=/theia-vision/1/test.txt userAgent=PostmanRuntime/7.41.2
   *
   * @apiError MissingToken Attempting to subscribe to a private folder without a token results in an "error Missing token".
   * @apiError Unauthorized If an invalid token is provided, you receive an "error Unauthorized".
   */
  if (ldp.live) {
    const customWs = CustomWebSocket(server, ldpApp);
    ldpApp.locals.ldp.live = customWs.publish.bind(customWs);
  }

  return server
}
