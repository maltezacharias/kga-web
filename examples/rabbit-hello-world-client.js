"use strict";
/*
 * Require section, all required modules are listed here
 */
var amqp = require('amqplib');
var bunyan = require('bunyan');
var when = require('when');

/*
 * Set up global variables / settings
 */

var log = bunyan.createLogger({name: module.filename});
var options = {
  queueName: 'helloWorld',
  numberOfMessages: -1, // negative values for unlimited number of messages
  randomTimeout: 1000 // 0 = send as fast as possible, >0 wait up to n milliseconds
};
var unconfirmedCounter = 0;
var allMessagesSent = false;

function cleanUpAndExit(connection) {
  // all messages maybe sent
  log.info("Suspect we're done.. Shutting down");
    var okClose = connection.close()
    okClose.then(function(){
      log.info("Connection close returned");
      process.exit(0)
    });
};


var ok = amqp.connect();
ok.then(function(connection) {
  var ok = connection.createConfirmChannel();
  ok.then(function(channel){
    channel.assertQueue(options.queueName, {durable:false});
    sendMessages(0, connection, channel);
  });
});

function sendMessages(counter, connection, channel) {
  counter++;
  log.info("Send message number", counter);

  var messageJSON = JSON.stringify({ message: 'Hello World', counter: counter});

  channel.publish('',options.queueName,new Buffer(messageJSON),{}, ackHandler);
  unconfirmedCounter++;

  if(counter === options.numberOfMessages) {
    // exit loop, stop sending
    allMessagesSent = true;
    return;
  }

  // schedule next message to be sent
  if(options.randomTimeout === 0) {
    setImmediate(function () {sendMessages(counter, connection, channel);});
  } else {
    let randomTimeout = Math.floor(Math.random() * options.randomTimeout);
    log.info("Waiting", randomTimeout, "ms until next message");
    setTimeout(function() {sendMessages(counter, connection, channel);},randomTimeout);
  }

  // Handler function for message acknowledgements
  function ackHandler(err) {
    unconfirmedCounter--;
    log.info("Ack received", { err: err, unconfirmedCounter: unconfirmedCounter});
    if (unconfirmedCounter === 0 && allMessagesSent) {
      log.info("Last message sent and acked(?), quitting...");
      cleanUpAndExit(connection);
    }
  }

};
