'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

//cargar rutas
var user_routes = require('./routes/user');
var prov_routes = require('./routes/proveedor');
var tour_routes = require('./routes/tour');

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cores
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});

//rutas

app.use('/api',user_routes);
app.use('/api',prov_routes);
app.use('/api',tour_routes);
app.use('/',express.static('client', {redirect:false}));

app.get('*',function(req,res,next){
	res.sendFile(path.resolve('client/index.html'));
});

//exportar
module.exports = app;
