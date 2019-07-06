'use strict'

var express = require('express');
var ProvController=require('../controllers/proveedor');

var api = express.Router();

api.get('/provhome',ProvController.provhome);
api.post('/regprov',ProvController.saveProv);
api.post('/logprov', ProvController.loginProv);



module.exports = api;
