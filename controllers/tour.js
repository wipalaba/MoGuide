'use strict'

var mongoosePaginate=require('mongoose-paginate');
var Tour=require('../models/tour');
var jwt=require('../services/jwt');
var fs = require('fs');
var path = require('path');
var Tour_Mult=require('../models/tour_multimedia');

function llegadatour(req,res){
	res.status(200).send({
		message:'Llegada de Tour'
	});
};

function createTour(req,res){
	var params=req.body;
	var tour= new Tour();
	tour.name=params.name;
	tour.descripcion=params.descripcion;
	tour.created_at= Date();
	tour.prov=req.user.sub;
	if(params.name && params.descripcion){
		tour.save((err,tourStored)=>{
			if(err) return res.status(500).send({message:'Error en la peticion'});
			if(tourStored){
				return res.status(200).send({tour:tourStored});
			}else{
				return res.status(200).send({message:'Error al agregar el tour'});
			}
		})

	}else{
		return res.status(200).send({message: 'Faltan parametros Obligatorios'});
	}	
};

function listarTour(req,res){
	var limit=2;
	var offset=0;
	Tour.find({},{},function(err,tours){
		return res.status(200).send({
			tours
		})
	});
};

function uploadImageTour(req,res){
	var tourId=req.params.id;
	if(req.files){
		var file_path=req.files.image.path;
		var file_split=file_path.split('/');
		var file_name=file_split[2];
		console.log(file_name);
		var file_ext=file_name.split('\.');
		var ext_name= file_ext[1];
		var tour_multi= new Tour_Mult();
		tour_multi.tip_cont=ext_name;
		tour_multi.cont=file_name;
		tour_multi.princ=null;
		tour_multi.tour=req.user.sub;
		Tour.findById(tourId,(err,tour)=>{
			if(err) return res.status(500).send({message:'Error al hacer la peticion'});
			//Comprobacion de Usuario
			if(tour.prov!=req.user.sub) return res.status(200).send({message:'No tiene autorizacion para realizar esta solicitud'});
			//Comprobacion de Extension
			if(ext_name == 'jpg' || ext_name == 'png' || ext_name == 'jpeg' || ext_name == 'gif'){
				//Guarda la imagen multimedia
				tour_multi.save((err,tour_multiStored)=>{
					if(err) return res.status(500).send({message:err});
					if(tour_multiStored){
						return res.status(200).send({tour_multi: tour_multiStored});
					}else{
						return res.status(200).send({message:'Error al ingresar la imagen'});
					}
				})
			}else{
			return res.status(200).send({message:'Extension no valida'});
			}
		});
	}		
}

function getImageFile(req,res){
	var image_file = req.params.imageFile;
	var path_file = './uploads/tours/' +image_file;
	fs.exists(path_file,(exists)=>{
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message:'No existe la imagen'});
		}
	});
}

function removeFilesofUploads(res,file_path,message){
	fs.unlink(file_path,(err)=>{
				return res.status(200).send({message:message});
			});}

function getImageIdPrinc(req,res){
	var tour_id=req.params.id;
	Tour_Mult.find({tour: tour_id, princ:"yes"},(err,tour)=>{
		if(err) return res.status(500).send({message:err});

		if(tour) return res.status(200).send({tour});

	});
}

function getTour(req,res){
	var tourId=req.params.id;
	Tour.findById(tourId,(err,tour)=>{
		if(err) return res.status(500).send({message:err});
		if(tour) return res.status(200).send({tour:tour});
	})
}


module.exports={
	llegadatour,
	createTour,
	listarTour,
	uploadImageTour,
	getImageFile,
	getImageIdPrinc,
	getTour
}