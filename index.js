'use strict';

const API = require('./lib/ApiRequest');
const Order = require('./lib/Order');

class RelayClient {
  constructor(options) {
    if (!options.api_key) throw new Error("api_key must be provided");
    Object.assign(this, options);

    this.API = new API(options);

    if (options.debug) {
      console.log('Initializing Relay SDK with API key ' + options.api_key);
    }
  }

  createOrder(options) {
    const o = new Order(this);
    return o.create(options);
  }
}

RelayClient.createClient = function(options) {
  return new RelayClient(options);
};

module.exports = RelayClient;
