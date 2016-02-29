"use strict";

var jwt = require('jsonwebtoken');

//module.exports.PasswordAuthenticator = PasswordAuthenticator;
module.exports.DummyAuthenticator = DummyAuthenticator;

function DummyAuthenticator() {
  this.authenticate = authenticate;

  function authenticate(user, callback) {
    var userTicket;
    var ticketOptions = {
      expiresIn: 3600,
      subject: user,
    };

    var ticketPayload;

    if (user === 'error') {
      return callback(new Error('Forced error for user error: Authentication not sucessful'));
    } else if (user === 'admin') {
      ticketPayload = {
        roles: ['administrator','student']
      };
    } else {
      ticketPayload = {
        roles: ['student']
      };
    }
    jwt.sign(ticketPayload, 'secret', ticketOptions, function (newTicket){ return callback(null, newTicket); });
  }
}
