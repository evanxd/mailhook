'use strict';

var MailListener = require('mail-listener2');

function Mailhook(user, password, host, options = {}) {
  this._hookedMailAddresses = [];
  this._mailListener = new MailListener({
    username: user,
    password: password,
    host: host,
    port: options.port || 993,
    tls: options.tls || true,
    tlsOptions: options.tlsOptions || { rejectUnauthorized: false },
    mailbox: options.mailbox || 'inbox',
    searchFilter: options.searchFilter || ['unseen'],
    markSeen: options.markSeen || true,
    fetchUnreadOnStart: options.fetchUnreadOnStart || true,
    mailParserOptions: options.mailParserOptions || { streamAttachments: true },
    attachments: options.attachments || true,
    attachmentOptions: options.attachmentOptions || { directory: 'attachments/' },
    debug: options.debug ? console.log : undefined,
  });
  this._mailListener.start();

  this._mailListener.on('mail', mail => {
    console.log(`Received a new mail "${mail.subject}" from ${mail.from[0].address}`);
    if (((this._hookedMailAddresses.length &&
          this._hookedMailAddresses.includes(mail.from[0].address)) ||
          this._hookedMailAddresses.length === 0) &&
          typeof this._triggerCallback === 'function') {
      this._triggerCallback(mail);
    }
  });

  this._mailListener.on("server:connected", function(){
    console.log('IMAP server is connected.');
  });

  this._mailListener.on('server:disconnected', () => {
    this._mailListener.start();
  });

  this._mailListener.on('error', error => {
    console.log(error);
  });
}

Mailhook.prototype = {
  _mailListener: null,
  _hookedMailAddresses: null,
  _triggerCallback: null,

  hook: function(mailAddress) {
    var that = this;
    if (!Array.isArray(mailAddress) && mailAddress) {
      mailAddress = [mailAddress];
      this._hookedMailAddresses = this._hookedMailAddresses.concat(mailAddress);
    }
    return {
      trigger: that._trigger.bind(that),
    };
  },

  _trigger: function(callback) {
    this._triggerCallback = callback;
  },
};

module.exports = Mailhook;
