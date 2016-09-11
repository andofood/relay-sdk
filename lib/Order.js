'use strict';

class Order {
  constructor(options) {
    this.id = options.id;
    this.API = options.API;
  }

  create(opts) {
    return this.API.post('orders', opts);
  }
}

module.exports = Order;
