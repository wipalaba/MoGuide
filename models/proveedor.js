'user strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProvSchema = Schema({
	razon_social: String,
	giro: String,
	rut: String,
	email: String,
	pass: String,
	prov_created_at: String
})

module.exports = mongoose.model('Proveedor',ProvSchema);