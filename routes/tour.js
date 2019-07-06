'use strict'

var express=require('express');
var TourController=require('../controllers/tour');

var api = express.Router();
var md_auth= require('../middlewares/authenticated');
var fs = require('fs');
var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'./uploads/tours'});

api.get('/tourllegada',TourController.llegadatour);
api.post('/registrotour',md_auth.ensureAuth,TourController.createTour);
api.get('/tours',TourController.listarTour);
api.post('/upload-image-tour/:id',[md_auth.ensureAuth,md_upload],TourController.uploadImageTour);
api.get('/image-tour/:imageFile',TourController.getImageFile);
api.get('/tour-image-princ/:id',TourController.getImageIdPrinc);
api.get('/tour/:id',TourController.getTour);

module.exports=api;