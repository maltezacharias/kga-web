"use strict";

var _ = require("underscore");
var Studygroup = require("../model/Studygroup");
var Student = require("../model/Student");

module.exports = function Commands(aPrototype){
  this.globalMemory = null;

  var _this = this;

  function addCommand(name, requiredParameters, optionalParameters, commandFunction){
    _this[name] = commandFunction;
    _this[name].requiredParameters = requiredParameters === null ? [] : requiredParameters;
    _this[name].optionalParameters = optionalParameters === null ? [] : optionalParameters;
  }

  addCommand('help', null, null, help);
  addCommand('listGroups',null, null ,listGroups);
  addCommand('addGroup',['number','identifier'],['sizeLimit','uuid'],addGroup);
  addCommand('addStudentToGroup',['studentId','groupId'],null,addStudentToGroup);


  function help(message, callback) {
    var availableCommands = {};
    _.each(this,function(property, propertyName) {
      if(_.isFunction(property)) {
        availableCommands[propertyName] = {
            requiredParameters: Array.from(property.requiredParameters),
            optionalParameters: Array.from(property.optionalParameters)
        };
      }
    });
    callback(null,{ availableCommands: availableCommands });
  }

  function listGroups(message, callback) {
    callback(null,{groups: this.globalMemory.studygroups.asArray()});
  }

  function addGroup(message, callback) {
    var newStudygroup = new Studygroup(message.number, message.identifier);
    if(message.sizeLimit) {
      newStudygroup.sizeLimit = message.sizeLimit;
    };
    if(message.uuid) {
      newStudygroup.uuid = message.uuid;
    }
    this.globalMemory.studygroups.add(newStudygroup);
    return callback(null,{});
  }

  function addStudentToGroup(message,callback) {
    if (!this.globalMemory.studygroups.has(message.groupId)) {
      return callback('Group ID '+ message.groupId +' unknown');
    }

    var group = this.globalMemory.studygroups.get(message.groupId);
    if(group.isFull()) {
      return callback('Group ID '+ message.groupId +' is already full');
    }
    group.addMember(new Student(message.studentId));
    return callback(null,{});
  }
};
