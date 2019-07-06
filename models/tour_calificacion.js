'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProvCalSchema = Schema({
	tour_cal_value: String,
	tour_cal_cant: String,
	tour_cal_perc: String,
	tour: {type: Schema.ObjectId, ref:'Tour'}
});

module.exports = mongoose.model('ProvCal', ProvCalSchema);