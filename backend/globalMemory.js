module.exports = {
  studygroups: {},
  add: function(aStudygroup){
    this.studygroups[aStudygroup.identifier] = aStudygroup;
  }
};
