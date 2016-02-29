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

    var ticketPayload = {
      roles: ['administrator','student']
    };

    if (user === 'error') {
      return callback('Authentication not sucessful');
    }
    jwt.sign(ticketPayload, 'secret', ticketOptions, function (newTicket){ return callback(null, newTicket); });
  }
}
