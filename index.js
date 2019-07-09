'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var PORT = 3800;
const fs = require('fs');
const https = require('https');

//Conexion BD
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/moguide', { useNewUrlParser: true })
		.then(() =>{
			console.log("La conexion a la base de datos se realizo correctamente");

			//Crear Servidor
		//app.listen(port, ()=> {
		//		console.log("Servidor Corriendo en http://localhost:3800");
		//	})

		})
		.catch(err => console.log(err));


    
var app = express();
https.createServer({
   key: fs.readFileSync('/etc/letsencrypt/live/wp.larasys.cl/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/wp.larasys.cl/cert.pem')
}, app).listen(PORT, function(){
    console.log("My https server listening on port " + PORT + "...");
});
app.get('/foo', function(req, res){
    console.log('Hello, I am foo.');
});
