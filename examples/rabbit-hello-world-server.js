"use strict";

var amqp = require('amqplib/callback_api');
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: module.filename});
var endpoint = "amqp://localhost";

amqp.connect(endpoint, function(err, connection){
    if(err) {
      log.error('Connection could not be created', { destination: endpoint, error: err });
      process.exit(1);
    }
    connection.createChannel(function(err, channel){
      if(err) {
        log.error('Channel could not be created', { error: err });
        process.exit(1);
      }
      var queueName = 'helloWorld';
      channel.assertQueue(queueName, { durable:false });
      channel.consume(queueName, messageReceived, { noAck:true });
      log.info('[x] Registered on queue', queueName);
    });
});

function messageReceived(message) {
  try {
    var messageData = JSON.parse(message.content.toString());
    log.info('Message received:',messageData);
  } catch (parseException) {
    log.error('Error during message parsing',{
      error: parseException,
      text:  message.content.toString(),
      message: message
    });
  }
}
