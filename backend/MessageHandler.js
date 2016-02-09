"use strict";
var _ = require("underscore");
var Commands = require("./MessageHandlerCommands");

var MessageHandler = function(globalMemory) {
  this.commands.globalMemory = globalMemory;
};

MessageHandler.prototype.commands = new Commands();
MessageHandler.prototype.process = function(message, callback) {
  if(!message.command) {
    throw new Error("invalid message received, command argument missing");
  }

  if(!_.has(this.commands, message.command)) {
    var exception = new Error('Command ' + message.command + ' unknown');
    exception.command = message.command;
    throw exception;
  }

  this.executeCommand(message.command, message, callback);

}

MessageHandler.prototype.executeCommand = function(commandName, message, callback) {
  var command = this.commands[commandName];
  var suppliedParameters = _.without(_.keys(message),'command');
  var requiredParameters = Array.from(command.requiredParameters);
  var optionalParameters = Array.from(command.optionalParameters);

  var missingParameters = _.difference(requiredParameters,suppliedParameters);
  var unknownParameters = _.difference(suppliedParameters,requiredParameters,optionalParameters);

  if(missingParameters.length > 0 || unknownParameters.length > 0) {
    throw new Error('Command Invocation Error, required Arguments for command '
                      + commandName
                      + ' missing: ['
                      + missingParameters.join()
                      + '], unknown Arguments supplied: ['
                      + unknownParameters.join()
                      + ']');
  }
  command.call(this.commands, message, callback);
}


module.exports = MessageHandler;
