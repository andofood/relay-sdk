'use strict';

const rest = require('restling');
const API_URI = 'https://dev-api.relay.delivery/v1';

let log = console.log; //function () {};

function getUrl(path) {
  return API_URI + '/' + path;
}

class ApiInstance {
  constructor(options) {
    this.api_key = options.api_key;
  }

  _addParams(options) {
    if (!this.api_key) throw new Error("API key missing");
    Object.assign(options.headers, {'x-relay-auth': this.api_key});
  }

  call(path, options) {
    if (options.method == 'GET') {
      if (!options.query) options.query = {};
    } else {
      if (!options.data) options.data = {};
    }
    this._addParams(options);

    log('API ' + options.method + ' ' +  getUrl(path), (options||''));
    return rest.request(getUrl(path), options)
    .then((result) => {
      log('API ' + options.method + ' ' +  getUrl(path), 'returned');
      try {
        if (typeof result.data == 'string') result.data = JSON.parse(result.data);
      }
      catch (e) {
      }

      console.log('RESULT', result.data);

      if (options.method == 'GET' && result.response.statusCode == 200) {
        return result.data;
      }
      if (options.method == 'POST' && result.response.statusCode == 200) {
        return result.data;
      }

      return result;
    }, (error) => {
      if (error.response.statusCode == 422) {
        console.error('Invalid request', error.data);
        if (typeof error.data == 'string') error.data = JSON.parse(error.data);
        return Promise.reject(error.data);
      }

      console.error('RESULT', error);
      return Promise.reject(error);
    });
  }

  post(path, data) {
    const options = Object.assign({}, defaultOptions, {
      method: 'POST',
      data: JSON.stringify(data)
    });

    return this.call(path, options);
  }

  get(path, data) {
    const options = Object.assign({}, defaultOptions, {
      method: 'GET'
    });
    if (data) options.query = data;
    return this.call(path, options);
  }
}

const defaultOptions = {
  headers: {'Content-Type': 'application/json'}
};

module.exports = ApiInstance;
