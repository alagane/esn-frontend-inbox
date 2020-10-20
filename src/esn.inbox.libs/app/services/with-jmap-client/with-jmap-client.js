'use strict';

const { call } = require('file-loader');

require('../jmap-client-provider/jmap-client-provider');

angular.module('esn.inbox.libs')
  .factory('withJmapClient2', function(jmapClientProvider2) {
    return function(callback) {
      return jmapClientProvider2.get().then(callback);
    };
  })
  .factory('withJmapClient', function(jmapClientProvider) {
    return function(callback) {
      return jmapClientProvider.get().then(callback);
    };
  });
