module.exports = InMemory;

const uuid = require('uuid');

function InMemory(opts) {
  opts = opts || {};
  this.uris = opts.uris || {};
  this.subscribers = opts.subscribers || {};
}

InMemory.prototype.subscribe = function (channel, uri, client, callback) {
  //console.log('Subscriptions - Client subscribing to:', uri);
  const self = this;

  if (!this.subscribers[channel]) {
    this.subscribers[channel] = {};
  }

  if (!client.uuid) {
    client.uuid = uuid.v1();
  }

  this.subscribers[channel][client.uuid] = [client, uri];

  client.on('close', function () {
    delete self.subscribers[channel][client.uuid];
  });

  return callback(null, client.uuid);
};

InMemory.prototype.get = function (channel, callback) {
  return callback(null, this.subscribers[channel] || {});
};

InMemory.prototype.getAll = function (callback) {
  try {
    // Return all stored subscribers
    callback(null, this.subscribers);
  } catch (error) {
    callback(error);
  }
};