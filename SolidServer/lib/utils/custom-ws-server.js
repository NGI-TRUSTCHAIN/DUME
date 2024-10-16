const WebSocketServer = require('ws').Server;
const debug = require('debug')('ldnode:custom-ws-server');
const InMemory = require('./custom-ws-in-memory');
const parallel = require('run-parallel');
const url = require('url');
const { rssValidateToken } = require('../jwtoken');

module.exports = CustomWsServer;

function defaultToChannel(iri) {
  return url.parse(iri).path;
}

function CustomWsServer(server, opts) {
  const self = this;

  opts = opts || {};
  this.suffix = opts.suffix || '.changes';
  this.store = opts.store || new InMemory(opts);
  const toChannel = opts.toChannel || defaultToChannel;

  const wss = new WebSocketServer({
    server: server,
    clientTracking: false,
    path: opts.path
  });

  wss.on('connection', function (client, req) {
    debug('New connection established');
    console.log('New connection established');

    client.on('message', async function (message) {
      try {
        debug('Received new message: ' + message);
        console.log('Received new message: ' + message);

        message = String(message);
        message = message.trim();

        const tuple = message.split(' ');
        const command = tuple[0];
        const iri = tuple[1];

        if (tuple.length !== 2 || command !== 'sub') {
          debug('Invalid subscription command or URI');
          console.log('Invalid subscription command or URI');
          return;
        }

        // Extract the JWT token from headers or the message
        const token = req.headers.authorization
          ? req.headers.authorization.split(' ')[1]
          : null;

        if (!token && iri !== '/public/') {
          client.send('Error Missing Token');
          return;
        }

        if (iri !== '/public/') {
          /*
          const mockReq = { headers: { authorization: `Bearer ${token}` } };
          const mockRes = { status: () => ({ send: () => {} }) };


          let isValidToken = false;

          rssValidateToken(mockReq, mockRes, () => {
            isValidToken = true;
          }, () => {
            isValidToken = false;
          });

          if (!isValidToken) {
            client.send('error Unauthorized');
            return;
          }
        }*/

        let isValidToken = false;
          rssValidateToken(req, () => {
            isValidToken = true;
          }, (errorMessage) => {
            client.send(`error ${errorMessage}`);
          });

          if (!isValidToken) {
            return; // Exit if the token is invalid
          }
        }

        const channel = toChannel ? toChannel(iri) : iri;
        self.store.subscribe(channel, iri, client, function (err, uuid) {
          if (err) {
            debug('Subscription error: ' + err);
            console.log('Subscription error: ' + err);
            return;
          }

          client.send('ack ' + tuple[1]);
          debug('Subscription acknowledged: ' + tuple[1]);
          console.log('Subscription acknowledged: ' + tuple[1]);
        });

      } catch (error) {
        console.error('Error handling message:', error);
        debug('Error handling message: ' + error.message);
      }
    });

    client.on('ping', function () {
      try {
        client.pong();
        debug('Responded to ping');
        console.log('Responded to ping');
      } catch (error) {
        console.error('Error responding to ping:', error);
        debug('Error responding to ping: ' + error.message);
      }
    });

    client.on('error', function (error) {
      console.error('WebSocket error:', error);
      debug('WebSocket error: ' + error.message);
    });
  });

  wss.on('error', function (error) {
    console.error('WebSocket Server error:', error);
    debug('WebSocket Server error: ' + error.message);
  });
}

CustomWsServer.prototype.publish = function (iri, operation, statusCode, webid, origin, userAgent, callback) {
  const notifiedClients = new Set(); // Track notified clients to avoid duplicates

  // Notify subscribers for exact matches
  this.store.get(iri, (err, subscribers) => {
    if (err) {
      debug('Error retrieving subscribers: ' + err);
      console.log('Error retrieving subscribers: ' + err);
      if (callback) return callback(err);
      else return;
    }

    if (!subscribers) {
      subscribers = {};
    }

    const tasks = [];

    Object.keys(subscribers).forEach(uuid => {
      const client = subscribers[uuid][0];
      const channel = subscribers[uuid][1];
      const message = `pub ${channel} operation=${operation} statusCode=${statusCode} webid=${webid} origin=${origin} resource=${iri} userAgent=${userAgent}`;

      if (!notifiedClients.has(uuid)) {
        debug('Publishing to channel: ' + channel + ' for client: ' + client.uuid);
        console.log('Publishing to channel: ' + channel + ' for client: ' + client.uuid);
        notifiedClients.add(uuid); // Mark client as notified

        tasks.push(cb => {
          try {
            client.send(message);
            cb(); // Mark task as complete
          } catch (error) {
            console.error('Error publishing to client:', error);
            debug('Error publishing to client: ' + error.message);
            cb(error);
          }
        });
      }
    });

    // Notify subscribers of parent folders only if there hasn't been a more specific match
    this.store.getAll((err, allSubscribers) => {
      if (err) {
        console.error('Error retrieving all subscribers:', err);
        return;
      }

      Object.keys(allSubscribers).forEach(parentIri => {
        if (iri.startsWith(parentIri) && parentIri !== iri) {
          const parentSubscribers = allSubscribers[parentIri];

          Object.keys(parentSubscribers).forEach(uuid => {
            const client = parentSubscribers[uuid][0];
            const channel = parentSubscribers[uuid][1];
            const message = `pub ${channel} operation=${operation} statusCode=${statusCode} webid=${webid} origin=${origin} resource=${iri} userAgent=${userAgent}`;

            if (!notifiedClients.has(uuid)) {
              debug('Publishing to parent channel: ' + channel + ' for client: ' + client.uuid);
              console.log('Publishing to parent channel: ' + channel + ' for client: ' + client.uuid);
              notifiedClients.add(uuid); // Mark client as notified

              tasks.push(cb => {
                try {
                  client.send(message);
                  cb(); // Mark task as complete
                } catch (error) {
                  console.error('Error publishing to client:', error);
                  debug('Error publishing to client: ' + error.message);
                  cb(error);
                }
              });
            }
          });
        }
      });

      parallel(tasks, callback);
    });
  });
};
