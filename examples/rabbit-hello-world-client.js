var amqp = require('amqplib');
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'kga-web/hello-world-client'});
var when = require('when');

var queueName = 'helloWorld';

function cleanUpAndExit(connection) {
  // all messages maybe sent
  log.info("Suspect we're done.. Shutting down");
  setTimeout(function(){
    var okClose = connection.close()
    log.info(okClose);
    okClose.then(function(){
      log.info("Connection close returned");
      process.exit(0)
    });
  },500);
};


var ok = amqp.connect();
ok.then(function(connection) {
  var ok = connection.createChannel();
  ok.then(function(channel){
    connection.createChannel().then(function(channel){
      channel.assertQueue(queueName, {durable:false});
      var lastReturn = false;
      for( var counter = 1; counter <= 10000; counter++) {
        lastReturn = channel.publish('',queueName,new Buffer('Hello World!' + counter));
      };

      log.info("Sent all messages", { lastReturn: lastReturn });
      if (lastReturn) {
        cleanUpAndExit(connection);
      } else {
        channel.on('drain', function() { cleanUpAndExit(connection) });
      }
    });
  });
});


/*



      function(err, channel){
      if(err) {
        log.error('Channel could not be created', { error: err });
        process.exit(1);
      }

      channel.assertQueue(queueName, { durable:false });
      var lastPublishReturn;
      for( var counter = 0; counter < 10000; counter++) {
        lastPublishReturn = sendMessage(channel, 'Hello World!' + counter);
      };

      var cleanUpAndExit = function() {
        log.info("Suspect we're done.. Shutting down");
        log.info(connection.close());
      };

      if (lastPublishReturn) {
        // immediately exit, all Sent
        cleanUpAndExit();
      } else {
        // register exit for when the channel has been flushed

      }



  });
}


*/
/*
process.on('SIGINT', function() {
  log.info('Received SIGINT, closing shop');
  _connection.close();
  setTimeout(function () {process.exit(0)},1000);
})
*//*
var connectPromise = amqp.connect();
connectPromise.then(function(err, connection){
    _connection = connection;
    if(err) {
      log.error('Connection could not be created', { destination: endpoint, error: err });
      process.exit(1);
    }
    connection.createChannel(function(err, channel){
      if(err) {
        log.error('Channel could not be created', { error: err });
        process.exit(1);
      }

      channel.assertQueue(queueName, { durable:false });
      var lastPublishReturn;
      for( var counter = 0; counter < 10000; counter++) {
        lastPublishReturn = sendMessage(channel, 'Hello World!' + counter);
      };

      var cleanUpAndExit = function() {
        log.info("Suspect we're done.. Shutting down");
        log.info(connection.close());
      };

      if (lastPublishReturn) {
        // immediately exit, all Sent
        cleanUpAndExit();
      } else {
        // register exit for when the channel has been flushed
        channel.on('drain', cleanUpAndExit);
      }
    });
});

function sendMessage(channel, text) {
  return channel.sendToQueue(queueName, new Buffer(text));
  //log.info('[x] Sent Message:', text);
};
*/
