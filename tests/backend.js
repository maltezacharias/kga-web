"use strict";
var chai = require('chai');
var expect = chai.expect;
var Student = require('../model/Student');
var Studygroup = require('../model/Studygroup');
var globalMemory = require('../backend/globalMemory');
var MessageHandler = require('../backend/MessageHandler');

function createRandomStudent() {
  return new Student(Math.floor(Math.random()*10000));
}

function createRandomGroup(sizeLimit) {
  var number = Math.floor(Math.random()*10000);
  var studygroup = new Studygroup(number, 'Kleingruppe '+ number);
  if (sizeLimit) {
    studygroup.setSizeLimit(1);
  }
  return studygroup;
}

function createAddStudentToGroupMessage(student,group){
  return {
    command: 'addStudentToGroup',
    studentId: student.id,
    groupId: group.uuid
  }
}

function createAddGroupMessage(group) {
  return {
    command: 'addGroup',
    uuid: group.uuid,
    number: group.number,
    identifier: group.identifier,
    sizeLimit: group.sizeLimit
  }
}

describe('MessageHandler',function() {
  it('MessageHandler should not process messages without a command property',function() {
    var messageHandler = new MessageHandler(globalMemory);
    var message = {};
    expect(function(){messageHandler.process(message);}).to.throw(/invalid/);
  });

  it('MessageHandler should throw an exception if the command is unknown',function() {
    var messageHandler = new MessageHandler(globalMemory);
    var message = { command: 'randomUnknownCommand345235'};
    expect(function(){messageHandler.process(message);}).to.throw(/unknown/);
  });

  it('MessageHandler should return an array for command listGroups',function(done) {
    var messageHandler = new MessageHandler(globalMemory);
    var message = { command: 'listGroups' };
    messageHandler.process(message, function(err, reply) {
      expect(err).to.equal(null);
      expect(reply).to.have.property("groups");
      expect(reply.groups).to.be.an.instanceof(Array).and.to.be.empty;
      done();
    });
  });

  it('MessageHandler should understand { command: "addGroup", number: aNumber, identifier: "aString"}',function(done) {
    var messageHandler = new MessageHandler(globalMemory);
    var studygroup = createRandomGroup(1);

    messageHandler.process(createAddGroupMessage(studygroup), function(err, reply) {
      expect(err).to.equal(null);
      expect(reply).to.be.empty;
      done();
    });
  });

  it('MessageHandler should complain about missing arguments for command: "addGroup"',function() {
    var messageHandler = new MessageHandler(globalMemory);
    var message = {command: 'addGroup'};
    expect(sendMessage).to.throw(/required/);
    message.number = '1';
    expect(sendMessage).to.throw(/required/);
    delete(message.number);
    message.identifier = '1';
    expect(sendMessage).to.throw(/required/);

    function sendMessage(){
      messageHandler.process(message, function(err, reply) {});
    };
  });

  it('After addGroup listGroups should contain the new group',function(done) {
    var studygroup = createRandomGroup();
    var messageHandler = new MessageHandler(globalMemory);

    messageHandler.process(createAddGroupMessage(studygroup), function(err, reply) {
      expect(err).to.equal(null);
      expect(reply).to.be.empty;
      var message = { command: 'listGroups' };
      messageHandler.process(message, function(err, reply) {
        expect(err).to.equal(null);
        expect(reply).to.have.property("groups");
        expect(reply.groups).to.be.an.instanceof(Array).and.to.contain(studygroup);
        done();
      });
    });
  });

  it('MessageHandler should complain about missing arguments for command: "addStudentToGroup"',function() {
    var messageHandler = new MessageHandler(globalMemory);
    var message = {command: 'addStudentToGroup'};
    expect(sendMessage).to.throw(/required/);
    message.groupId = '1';
    expect(sendMessage).to.throw(/required/);
    delete(message.groupId);
    message.studentId = '1';
    expect(sendMessage).to.throw(/required/);

    function sendMessage(){
      messageHandler.process(message, function(err, reply) {});
    };
  });

  it('MessageHandler should add a student to a group { command: "addStudentToGroup", studentId: "aStudentId", groupId: "aGroupId"}',function(done) {
    var messageHandler = new MessageHandler(globalMemory);
    var student = createRandomStudent();
    var studygroup = createRandomGroup();

    messageHandler.process(createAddStudentToGroupMessage(student,studygroup),function(err,reply){
      expect(err).not.to.be.empty;
      expect(reply).to.be.undefined;
      messageHandler.process(createAddGroupMessage(studygroup), function(err, reply) {
        expect(err).to.equal(null);
        expect(reply).to.be.empty;
        messageHandler.process(createAddStudentToGroupMessage(student,studygroup), function(err, reply){
          expect(err).to.equal(null);
          expect(reply).to.be.empty;
          done();
        });
      });
    });
  });

  it('MessageHandler should deny adding two students to a group with sizeLimit 1',function(done) {
    var messageHandler = new MessageHandler(globalMemory);
    var student = createRandomStudent();
    var student2 = new Student(student.id + 1);
    var studygroup = createRandomGroup(1);

    messageHandler.process(createAddGroupMessage(studygroup), function(err, reply) {
      expect(err).to.equal(null);
      expect(reply).to.be.empty;
      messageHandler.process(createAddStudentToGroupMessage(student,studygroup), function(err, reply){
        expect(err).to.equal(null);
        expect(reply).to.be.empty;
        messageHandler.process(createAddStudentToGroupMessage(student2,studygroup), function(err, reply){
          expect(err).not.to.equal(null);
          expect(reply).to.be.undefined;
          done();
        });
      });
    });
  });

  it('MessageHandler should provide a list of commands for the command help',function(done) {
    var messageHandler = new MessageHandler(globalMemory);

    messageHandler.process({command: "help"}, function(err, reply) {
      expect(err).to.equal(null);
      expect(reply).to.have.property("availableCommands");
      expect(reply.availableCommands).to.contain.key("help");
      expect(reply.availableCommands.help).to.contain.all.keys("requiredParameters","optionalParameters");
      done();
    });
  });

});
