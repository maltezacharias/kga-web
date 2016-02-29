#!/usr/bin/env node
var argv = require('yargs')
    .usage('Usage: $0 [options]')
    .demand(['user'])
    .alias('u','user')
    .nargs('u',1)
    .describe('u', 'User ID to create in ticket')
    .nargs('v',1)
    .alias('v','verify')
    .describe('verify','Secret used to verify token')
    .epilog('for testing purposes only')
    .argv;

var jwt = require('jsonwebtoken');
var authenticator = require('./authenticator');
var dummyAuthenticator = new authenticator.DummyAuthenticator();
dummyAuthenticator.authenticate(argv.user, authenticationCallback);

function authenticationCallback(error, token) {
  if (error) {
    console.log("Error: "+ error);
    return process.exit(1);
  }
  console.log('New token for user '+ argv.user + ': '+ token);
  var decoded = jwt.decode(token, {complete: true});
  console.log(decoded.header);
  console.log(decoded.payload);

  if(argv.verify) {
    try{
      jwt.verify(token, argv.verify, { subject: argv.user });
      console.log("Verification sucessful");
    } catch (error) {
      console.log("Verification failed: "+ error);
    }
  } else {
    console.log("Token not verifed, specify hash secret to verify the new token");
  }
}
