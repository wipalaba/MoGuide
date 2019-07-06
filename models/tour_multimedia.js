'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TourMultSchema = Schema({
	tip_cont: String,
	cont: String,
	princ: String,
	tour: {type: Schema.ObjectId, ref:'Tour'}
});

module.exports = mongoose.model('TourMult',TourMultSchema);