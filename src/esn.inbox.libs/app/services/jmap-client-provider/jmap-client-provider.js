"use strict";

require("../config/config.js");
require("../jmap-client-wrapper/jmap-client-wrapper.service.js");
require("../generate-jwt-token/generate-jwt-token.js");
require("../custom-role-mailbox/custom-role-mailbox.service.js");
const { Client } = require("jmap-client-ts/lib");

angular
  .module("esn.inbox.libs")
  .service("jmapClientProvider2", function ($q, inboxConfig, generateJwtToken) {
    let client;
    let clientFecthingSession;

    return {
      get,
    };

    function _initializeJmapClientWithSession() {
      return $q(function (resolve, reject) {
        $q.all([generateJwtToken(), inboxConfig("api")]).then(
          function (data) {
            if (!client) {
              client = new Client({
                sessionUrl: "unknown",
                accessToken: data[0],
                overriddenApiUrl: data[1],
                sessionUrl: `${data[1]}/session`,
              });
            }

            if (!clientFecthingSession) {
              clientFecthingSession = client.fetchSession();
              clientFecthingSession.then(function () {
                resolve(client);
              });
            }
          },
          function (reason) {
            reject(reason);
          }
        );
      });
    }

    function get() {
      return client ? $q.when(client) : _initializeJmapClientWithSession();
    }
  })

angular.module('esn.inbox.libs')
  .service('jmapClientProvider', function($q, inboxConfig, jmapDraft, dollarHttpTransport, dollarQPromiseProvider, generateJwtToken, inboxCustomRoleMailboxService) {
    let jmapClient;

    return {
      get
    };

    /////

    function _initializeJmapClient() {
      return $q.all([
        generateJwtToken(),
        inboxConfig('api'),
        inboxConfig('downloadUrl')
      ]).then(function(data) {
        jmapClient = new jmapDraft.Client(dollarHttpTransport, dollarQPromiseProvider)
          .withAPIUrl(data[1])
          .withDownloadUrl(data[2])
          .withAuthenticationToken('Bearer ' + data[0])
          .withCustomMailboxRoles(inboxCustomRoleMailboxService.getAllRoles());

        return jmapClient;
      });
    }

    function get() {
      return jmapClient ? $q.when(jmapClient) : _initializeJmapClient();
    }
  });
