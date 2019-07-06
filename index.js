'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

//Conexion BD
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/moguide', { useNewUrlParser: true })
		.then(() =>{
			console.log("La conexion a la base de datos se realizo correctamente");

			//Crear Servidor
			app.listen(port, ()=> {
				console.log("Servidor Corriendo en http://localhost:3800");
			})

		})
		.catch(err => console.log(err));