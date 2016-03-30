'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Outreach = require('./outreach/outreach.model');
var Intervention = require('./intervention/intervention.model');
var StudentNote = require('./note/note.model');

var StudentSchema = new Schema({
  studentId: {type: String, required: true, index: true},
  lastName: {type: String, required: true, trim: true},
  firstName: {type: String, required: true, trim: true},
  currentSchool: {type: Schema.Types.ObjectId, ref: 'School'},
  iep: {type: Boolean, default: false},
  cfa: {type: Boolean, default: false},
  active: {type: Boolean, default: true}
});

StudentSchema.pre('remove', function(next) {
  var promises = [
    Outreach.find({student: this._id}).remove().exec(),
    Intervention.find({student: this._id}).remove().exec(),
    StudentNote.find({student: this._id}).remove().exec()
  ];
  Promise.all(promises).then(function() {
    return next();
  }).catch(function(err) {
    return next(new Error(err));
  });
});

module.exports = mongoose.model('Student', StudentSchema);
