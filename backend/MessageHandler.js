"use strict";
var _ = require("underscore");
var globalMemory = require("./globalMemory");
var Studygroup = require("../model/Studygroup");
var Student = require("../model/Student");

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
  if(message.sizeLimit) {
    newStudygroup.sizeLimit = message.sizeLimit;
  };
  globalMemory.add(newStudygroup);
  callback(null,{});
}

MessageHandler.prototype.commands.addStudentToGroup = function(message,callback) {
  if(!message.studentId || !message.groupId) {
    throw new Error("student and group ID are required to add a student to a group");
  }
  if (!_.has(globalMemory.studygroups,message.groupId)) {
    callback('Group ID '+ message.groupId +' unknown');
    return;
  }

  var group = globalMemory.studygroups[message.groupId];
  if(group.isFull()) {
    callback('Group ID '+ message.groupId +' is already full');
    return;
  }
  group.addMember(new Student(message.studentId));
  callback(null,{});
}

module.exports = MessageHandler;
