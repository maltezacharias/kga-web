"use strict";
var _ = require("underscore");
var globalMemory = require("./globalMemory");
var Studygroup = require("../model/Studygroup");

var MessageHandler = function() {

};

MessageHandler.prototype.commands = {};
MessageHandler.prototype.process = function(message, callback) {
  if(!message.command) {
    throw new Error("invalid message received, command argument missing");
  }

  if(!_.has(this.commands, message.command)) {
    var exception = new Error("Command unknown");
    exception.command = message.command;
    throw exception;
  }

  this.commands[message.command](message, callback);
}

MessageHandler.prototype.commands.listGroups = function(message, callback) {
  callback(null,{groups: _.toArray(globalMemory.studygroups)});
}

MessageHandler.prototype.commands.addGroup = function(message, callback) {
  if(!message.number || !message.identifier) {
    throw new Error("number and identifier are required to create a group");
  }
  var newStudygroup = new Studygroup(message.number, message.identifier);
  globalMemory.add(newStudygroup);
  callback(null,{});
}


module.exports = MessageHandler;
