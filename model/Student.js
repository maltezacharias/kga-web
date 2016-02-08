"use strict";

function Student(id) {
  this.id = id;
};

Student.prototype.getId = function() {
  return this.id;
};

module.exports = Student;
