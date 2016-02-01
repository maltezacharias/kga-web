var amqp = require('amqplib/callback_api');
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'kga-web/hello-world-client'});
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
      channel.consume(queueName, function(message){
        log.info('[x] Message received',{ message: message.content.toString()});
      }, { noAck:true });
      log.info('[x] Registered on queue', queueName);
    });
});
