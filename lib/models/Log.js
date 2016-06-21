'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const logSchema = new Schema({
  date: { type: Date, required: true, default: Date.now },
  text: { type: String, required: true }
});

module.exports = mongoose.model('Log', logSchema);
