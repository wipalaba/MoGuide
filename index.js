'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;
const fs = require('fs');
const https = require('https');
const app = express();

//Conexion BD
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/moguide', { useNewUrlParser: true })
		.then(() =>{
			console.log("La conexion a la base de datos se realizo correctamente");

			//Crear Servidor
		//app.listen(port, ()=> {
		//		console.log("Servidor Corriendo en http://localhost:3800");
		//	})

		//})
		//.catch(err => console.log(err));



app.get('/', (req, res) => {
  res.send('Hello HTTPS!')
})

https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/wp.larasys.cl/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/wp.larasys.cl/cert.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/live/wp.larasys.cl/chain.pem')
}, app).listen(3800, () => {
  console.log('Listening...')
})
