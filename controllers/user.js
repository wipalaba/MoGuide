'use strict'
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate=require('mongoose-paginate');
var User = require('../models/user');
var jwt= require('../services/jwt');
var fs = require('fs');
var path=require('path');

function home(req,res){
	res.status(200).send({
		message: 'Controller UserJS'
	});
};

function pruebas(req,res){
	res.status(200).send({
		message: 'Pruebas'
	});
};

//Registro de Usuario
function saveUser(req,res){
	var params = req.body;
	var user= new User();

	if(params.name && params.surname && params.email && params.password){
		user.name=params.name;
		user.surname = params.surname;
		user.email=params.email;
		user.image=null;
		user.created_at=Date();
		//Comprobar si existe el usuario
		User.findOne({email:user.email.toLowerCase()}).exec((err, users) =>{
			if(err) return res.status(500).send({message: 'Error en la peticion de usuario'});
			if(users){
				return res.status(200).send({message: 'El usuario ya existe o es invalido'});
			}else{
				//Cifrar contrasena
				bcrypt.hash(params.password, null, null, (err,hash) => {
			user.password=hash;
			user.save((err, userStored) => {
				if(err) return res.status(500).send({message: 'Error al guardar el usuario'});
				if(userStored){
					res.status(200).send({user: userStored});
				}else{
					res.status(404).send({message: 'No se ha registrado el usuario'});
				}
			});
		});
			}
		});
		
	}else{
		res.status(200).send({
			message: 'Envia todos los campos obligatorios!'
		});
	}
};

//Login

function loginUser(req,res){
	var params = req.body;
	var email=params.email;
	var password=params.password;
	User.findOne({email:email},(err,user)=>{
		if(err) return res.status(500).send({message:'Error en la peticion'});
		if(user){
			bcrypt.compare(password, user.password,(err,check)=>{
				if(check){

					if(params.gettoken){
						//generar y devolver datos de usuario
					return res.status(200).send({
						token: jwt.createToken(user)
					});
					}else{
						//devolver datos usuario
						return res.status(200).send({user});
					}
					
				}else{
					return res.status(404).send({message:'El usuario no se ha podido identificar'});
				}
			});
		}else{
			return res.status(404).send({message:'El usuario no se ha podido identificar'});
		}
	});
}

//Conseguir datos de un Usuario
function getUser(req,res){
	var userId = req.params.id;

	User.findById(userId, (err,user) =>{
		if(err) return res.status(500).send({
			message: 'Error en la peticion'
		});
		if(!user) return res.status(404).send({message:'El usuario no existe'});

		return res.status(200).send({user});
	})
}

//Devolver un listado de usuarios paginanos
function getUsers(req,res){
	var identity_user_id=req.user.sub;
	var limit = 2;
	var offset=0;
	if(req.params.page){
		offset=(req.params.page-1) *limit;
	}
	//Paginacion
	User.paginate({},{offset, limit, sort:'created_at'}, function(err,users){
		return res.status(200).send({
			users
		})
	});
}

//Actualizacion de Usuario
function updateUser(req,res){
	var userId=req.params.id;
	var update=req.body;
	//Borrar la propiedad password
		delete update.password;
	

	if(userId != req.user.sub){
		res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'});
	}

	User.findByIdAndUpdate(userId,update,{ new:true },(err,userUpdated)=>{
		if(err) res.status(500).send({message:'Error en la peticion'});
		if(!userUpdated) return status(400).send({message: 'No se ha podido actualizar el ususario'});
		
		return res.status(200).send({user: userUpdated});
	});
}

//Subir archivos de imagen/avatar de usuario
function uploadImage(req,res){
	var userId=req.params.id;
	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		console.log(file_split);
		var file_name = file_split[2];
console.log(file_name);
		var ext_split=file_name.split('\.');
		var file_ext = ext_split[1];
		console.log(file_ext);
		
	//Comprueba Login con Usuario
	if(userId != req.user.sub){
		removeFilesofUploads(res,file_path,'No tienes permiso para subir la imagen');	
	}
		//Comprobacion de Extensiones a Subir
		if(file_ext == 'png' || file_ext=='jpg' || file_ext=='jpeg' || file_ext=='gif'){
			User.findByIdAndUpdate(userId,{image:file_name},{new:true},(err,userUpdated)=>{
				if(err) return res.status(500).send({message:'Error en la peticion'});
				if(!userUpdated) return res.status(200).send({message:'No se ha podido actualizar el usuario'});
				return res.status(200).send({user:userUpdated});
			});
		}else{

			removeFilesofUploads(res, file_path,'Extension no valida');
		}
	}else{
		return res.status(200).send({message:'No se han enviado imagenes'});
	}
};

function getImageFile(req,res){
	var image_file = req.params.imageFile;
	var path_file = './uploads/users/' +image_file;
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

module.exports = {
	home,
	pruebas,
	saveUser,
	loginUser,
	getUser,
	getUsers,
	updateUser,
	uploadImage,
	getImageFile
}