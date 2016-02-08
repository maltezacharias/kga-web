"use strict";

var zmq = require("zmq");
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: module.filename});
var endpoint = process.env.ENDPOINTS_DBUPDATER;

var requester = zmq.socket('req');

var requestCounter = 0;
var replyCounter = 0;
var allSent = false;

process.on('SIGINT', function() {
  log.info('Received SIGINT, closing shop');
  requester.close();
  process.exit(0);
})

requester.on("message", function(reply) {
  replyCounter++;
  //log.info("Reply received", { reply: JSON.parse(reply.toString()), counter: replyCounter });
  if (replyCounter === requestCounter && allSent) {
    log.info("All requests have been responded to, closing shop");
    requester.close();
    process.exit(0);
  }
});

log.info("Opening req socket to",endpoint);
requester.connect(endpoint);

function sendMessage() {
    var message = { text: "Hello", counter: requestCounter++, pid: process.pid };
    //log.info("Sending request", requestCounter, message);
    requester.send(JSON.stringify(message));
    if(requestCounter < 10000 ) {
      setTimeout(sendMessage,0); // give the event loop a chance, nextTick would be wrong here
    } else {
      log.info("Finished sending");
      allSent = true;
    }
}

sendMessage();
