'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TourSchema = ({
	name: String,
	descripcion: String,
	created_at: String,
	prov: {type: Schema.ObjectId, ref:'Prov'},
	place: {type: Schema.ObjectId, ref:'Place'},
	country: {type: Schema.ObjectId, ref:'Country'}
});

module.exports = mongoose.model('Tour',TourSchema);