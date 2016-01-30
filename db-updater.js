var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'kga-web/db-updater'});
var endpoint = process.env.ENDPOINTS_DBUPDATER_SOCKET;
var maximum_message_size = process.env.ENDPOINTS_DBUPDATER_MAXMESSAGESIZE;
var zmq = require('zmq');
log.info('ZMQ', zmq.version);
log.info('Starting db-updater configured to provide endpoint',endpoint);
log.info('Maximum message size', maximum_message_size);
var responder = zmq.socket('rep', { ZMQ_MAXMSGSIZE: maximum_message_size });
responder.on('message', function(request) {
  try {
    var messageData = JSON.parse(request.toString());
    log.info("Message received", messageData);
    //responder.send("{}");
    responder.send(JSON.stringify({text: 'World', counter: messageData.counter }));
  } catch (syntaxError){
    log.error("Parsing of message failed", { message: request.toString(), error: syntaxError });
    responder.send(JSON.stringify({
      status: "Error",
      message: syntaxError.toString()
    }));
  }
});

responder.bind(endpoint, function(err){
  if (err) {
    log.error("Failed initializing message receiver", { error: err });
    process.exit(1);
  } else {
    log.info("Listening on", endpoint);
  }
});

process.on('SIGINT', function() {
  log.info('Received SIGINT, closing socket', endpoint);
  responder.close();
  process.exit(0);
})
