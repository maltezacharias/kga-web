"use strict";
var _ = require('underscore');

function UUIDContainer() {
  this.items = {};
};

UUIDContainer.prototype.add = function(item) {
  if(!_.has(item,'uuid')) {
    var exception = new Error('Added item has no uuid');
    exception.item = item;
    throw exception;
  }
  this.items[item.uuid] = item;
}

UUIDContainer.prototype.asArray = function() {
  return _.toArray(this.items);
}

UUIDContainer.prototype.has = function(uuid) {
  return _.has(this.items, uuid);
}

UUIDContainer.prototype.get = function(uuid) {
  if (!this.has(uuid)) {
    throw new Error('Element with uuid '+ uuid +' unknown');
  }
  return this.items[uuid];
}

module.exports = {
  UUIDContainer: UUIDContainer,
  studygroups: new UUIDContainer(),
  students: new UUIDContainer()
};
