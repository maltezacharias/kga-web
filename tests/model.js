"use strict";
var chai = require('chai');
var expect = chai.expect;
var Student = require('../model/Student');
var Studygroup = require('../model/Studygroup');

describe('Student',function() {
  it('new Student should have an id',function() {
    var student = new Student('1');
    expect(student.getId()).to.equal('1');
  });
});

describe('Studygroup',function() {
  it('new empty studygroup should have zero members',function() {
    var studygroup = new Studygroup();
    expect(studygroup.size()).to.equal(0);
  });
  it('new studygroup with one member should have one member',function() {
    var studygroup = new Studygroup(null,null,[new Student()]);
    expect(studygroup.size()).to.equal(1);
  });
  it('Studygroup should return its number and name',function() {
    var studygroup = new Studygroup(1,'Studygroup 1');
    expect(studygroup.getIdentifier()).to.equal('Studygroup 1');
    expect(studygroup.getNumber()).to.equal(1);
  });
  it('Adding members to Studygroup should increase member size',function() {
    var studygroup = new Studygroup(1,"Gruppe 1");
    expect(studygroup.size()).to.equal(0);
    studygroup.addMember(new Student());
    expect(studygroup.size()).to.equal(1);
  });

  it('Adding two students with same ID to Studygroup should not increase member size',function() {
    var studygroup = new Studygroup(1,"Gruppe 1");
    expect(studygroup.size()).to.equal(0);
    studygroup.addMember(new Student());
    expect(studygroup.size()).to.equal(1);
    studygroup.addMember(new Student());
    expect(studygroup.size()).to.equal(1);
  });

  it('Adding two students with different IDs to Studygroup should not increase member size',function() {
    var studygroup = new Studygroup(1,"Gruppe 1");
    expect(studygroup.size()).to.equal(0);
    studygroup.addMember(new Student('1542402'));
    expect(studygroup.size()).to.equal(1);
    studygroup.addMember(new Student('1542403'));
    expect(studygroup.size()).to.equal(2);
  });

  it('A studygroup with a size limit should have a size limit property',function() {
    var studygroup = new Studygroup(1,"Gruppe 1");
    studygroup.setSizeLimit(2);
    expect(studygroup.sizeLimit).to.equal(2);
  });

  it('A studygroup with a size limit of two should return isFull after adding two students',function() {
    var studygroup = new Studygroup(1,"Gruppe 1");
    studygroup.setSizeLimit(2);
    studygroup.addMember(new Student('1'));
    studygroup.addMember(new Student('2'));
    expect(studygroup.isFull()).to.be.true;
  });

  it('Adding three students to a studygroup with sizelimit 2 should throw an exception',function() {
    var studygroup = new Studygroup(1,"Gruppe 1");
    studygroup.setSizeLimit(2);
    studygroup.addMember(new Student('1'));
    studygroup.addMember(new Student('2'));
    expect(function(){
      studygroup.addMember(new Student('3'));
    }).to.throw(Error);
  });

});
