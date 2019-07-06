'use strict'

var mongoose = require('mongoose');
var mongoosePaginate=require('mongoose-paginate');
var Schema = mongoose.Schema;

var UserSchema = Schema({
	name: String,
	surname: String,
	email: String,
	password: String,
	image: String,
	created_at: String
	//Referencias a otras tablas
	//user: {type: Schema.ObjectId, ref:'User'}
});
UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', UserSchema);