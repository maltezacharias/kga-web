"use strict";
var chai = require('chai');
var expect = chai.expect;
var Student = require('../model/Student');
var Studygroup = require('../model/Studygroup');
var MessageHandler = require('../backend/MessageHandler');

describe('MessageHandler',function() {
  it('MessageHandler should not process messages without a command property',function() {
    var messageHandler = new MessageHandler();
    var message = {};
    expect(function(){messageHandler.process(message);}).to.throw(/invalid/);
  });

  it('MessageHandler should throw an exception if the command is unknown',function() {
    var messageHandler = new MessageHandler();
    var message = { command: 'randomUnknownCommand345235'};
    expect(function(){messageHandler.process(message);}).to.throw(/unknown/);
  });

  it('MessageHandler should return an array for command listGroups',function(done) {
    var messageHandler = new MessageHandler();
    var message = { command: 'listGroups' };
    messageHandler.process(message, function(err, reply) {
      expect(err).to.equal(null);
      expect(reply).to.have.property("groups");
      expect(reply.groups).to.be.an.instanceof(Array).and.to.be.empty;
      done();
    });
  });

  it('MessageHandler should understand { command: "addGroup", number: aNumber, identifier: "aString"}',function(done) {
    var messageHandler = new MessageHandler();
    var message = {
      command: 'addGroup',
      number: 1,
      identifier: 'Kleingruppe 1'
    };
    messageHandler.process(message, function(err, reply) {
      expect(err).to.equal(null);
      expect(reply).to.be.empty;
      done();
    });
  });

  it('After addGroup listGroups should contain the new group',function(done) {
    var studygroup = new Studygroup(1,"Kleingruppe 1");
    var messageHandler = new MessageHandler();
    var message = {
      command: 'addGroup',
      number: studygroup.number,
      identifier: studygroup.identifier
    };
    messageHandler.process(message, function(err, reply) {
      expect(err).to.equal(null);
      expect(reply).to.be.empty;
      message = { command: 'listGroups' };
      messageHandler.process(message, function(err, reply) {
        expect(err).to.equal(null);
        expect(reply).to.have.property("groups");
        expect(reply.groups).to.be.an.instanceof(Array).and.to.contain(studygroup);
        done();
      });
    });
  });

  it('MessageHandler should understand { command: "addStudentToGroup", studentId: "aStudentId", groupId: "aGroupId"}',function(done) {
    var messageHandler = new MessageHandler();
    var message = {
      command: 'addStudentToGroup',
      studentId: 1,
      groupId: 'Kleingruppe 1'
    };
    messageHandler.process(message, function(err, reply) {
      expect(err).to.equal(null);
      expect(reply).to.be.empty;
      done();
    });
  });


});
