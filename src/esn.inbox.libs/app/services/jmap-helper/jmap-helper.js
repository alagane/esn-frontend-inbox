'use strict';

const _ = require('lodash');

require('../jmap-client-wrapper/jmap-client-wrapper.service.js');
require('../email-body/email-body.js');
require('../with-jmap-client/with-jmap-client.js');
require('../identities/inbox-identities.service.js');
require('../../app.constants');

angular.module('esn.inbox.libs')

  .factory('inboxJmapHelper', function($q, jmapDraft, emailBodyService, withJmapClient, inboxIdentitiesService, JMAP_GET_MESSAGES_VIEW) {
    return {
      getMessageById,
      toOutboundMessage
    };

    /////

    function getMessageById(id) {
      return withJmapClient(function(client) {
        return client.getMessages({ ids: [id], properties: JMAP_GET_MESSAGES_VIEW }).then(_.head);
      });
    }

    function toOutboundMessage(jmapClient, emailState) {
      return $q.when(emailState.identity || inboxIdentitiesService.getDefaultIdentity())
        .then(function(identity) {
          const message = {
            from: new jmapDraft.EMailer({
              email: identity.email,
              name: identity.name
            }),
            replyTo: identity.replyTo ? [new jmapDraft.EMailer({ email: identity.replyTo })] : null,
            subject: emailState.subject,
            to: _mapToEMailer(emailState.to),
            cc: _mapToEMailer(emailState.cc),
            bcc: _mapToEMailer(emailState.bcc),
            headers: emailState.headers
          };
          const bodyProperty = emailState.htmlBody ? 'htmlBody' : emailBodyService.bodyProperty;

          message[bodyProperty] = emailState[bodyProperty];

          if (emailState.attachments) {
            message.attachments = (emailState.attachments || []).filter(function(attachment) {
              return attachment.blobId;
            });
          }

          return new jmapDraft.OutboundMessage(jmapClient, message);
        });
    }

    function _mapToEMailer(recipients) {
      return (recipients || []).map(function(recipient) {
        return new jmapDraft.EMailer({
          name: recipient.name,
          email: recipient.email
        });
      });
    }
  });
