const { Int32 } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const treatmentSchema = new Schema({
  treatmentNumber: {
    type: Number,
    required: true
  },
  treatmentInformation: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  workerEmail: {
    type: String,
    required: true
  },
  carNumber: {
    type: String,
    required: true
  }
});

const Treatment = mongoose.model('Treatment', treatmentSchema);
module.exports = Treatment;