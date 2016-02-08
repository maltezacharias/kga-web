"use strict";

var _ = require('underscore');

function Studygroup(number, identifier, members) {
  var _this = this;
  this.number = number;
  this.identifier = identifier;
  this.members = {};
  if (_.isArray(members)) {
    _.each(members, function(element) {
      _this.addMember(element);
    });
  }
};

Studygroup.prototype.addMember = function(aStudent) {
  if(this.isFull()) {
    throw new Error('Group is already full, adding new student not possible');
  }
  this.members[aStudent.getId()] = aStudent;
}

Studygroup.prototype.size = function() {
  return _.size(this.members);
};


Studygroup.prototype.getIdentifier = function() {
  return this.identifier;
}

Studygroup.prototype.getNumber = function() {
  return this.number;
}

Studygroup.prototype.setSizeLimit = function(sizeLimit) {
  this.sizeLimit = sizeLimit;
}

Studygroup.prototype.isFull = function() {
  if(!this.sizeLimit) {
    return false;
  }
  return this.size() >= this.sizeLimit;
}


module.exports = Studygroup;
