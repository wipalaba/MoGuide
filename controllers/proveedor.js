'use strict'
var bcrypt = require('bcrypt-nodejs');
var Proveedor = require('../models/proveedor');
var jwt= require('../services/jwt');

function provhome(req,res){
	res.status(200).send({
		message:'Prueba de Proveedor'
	});
}

function saveProv(req,res){
	var params = req.body;
	var prov = new Proveedor();
	if(params.razon_social && params.rut && params.email && params.pass){
		prov.razon_social= params.razon_social;
		prov.rut=params.rut;
		prov.email=params.email;
		prov.pass=params.pass;
		prov.created_at=Date();
		prov.giro=params.giro;
		//Comprobamos que el Proveedor no exista
		Proveedor.findOne({email:prov.email.toLowerCase()}).exec((err,provs) => {
			if(err) return res.status(500).send({message:'Error al realizar la consulta'});
			if(provs){
				return res.status(200).send({message:'El usuario ya existe o es invalido'});
			}else{
				//Fin Comprobacion y Registro de Proveedor
				//Cifrado de Clave
				bcrypt.hash(params.pass,null,null,(err,hash) =>{
					prov.pass=hash;
					prov.save((err,provStored) => {
			if(err) return res.status(500).send({
				message: 'Error al registrar al proveedor'
			});
			if(provStored){
				return res.status(200).send({
					prov:provStored
				});
			}else{
				res.status(404).send({
					message:'El proveedor no ha sido registrado'
				});
			}

			})
				})
			
			}
		});


		}else{
			res.status(200).send({
				message:'Ingresa todos los campos'
			});
		}
	}

 function loginProv(req,res){
 	var params = req.body;
 	var email = params.email;
 	var password = params.pass;
 	//Comprobacion de que los parametros existen
 	if(params.email && params.pass){

 	Proveedor.findOne({email:email},(err,prov)=>{
 		if(err) return res.status(500).send({message:'Error en la consulta'});
 		if(prov){
 			//Compara claves
 			bcrypt.compare(password , prov.pass,(err,check)=>{
 				if(check){
 					//devuelve token
 					if(params.gettoken){
 						return res.status(200).send({
 							token: jwt.createToken(prov)
 						});
 					}else{
 						return res.status(200).send({
 							prov
 						});
 					}
 				}else{
 					return res.status(404).send({message:'El usuario no se ha podido identificar'})
 				}
 			});
 		}else{
 			return res.status(404).send({message:'El usuario no se ha podido identificar'});
 		}
 	});
	}else{
		return res.status(200).send({message:'Ingrese todos los valores'});
	}
 	
 }

module.exports = {
	provhome,
	saveProv,
	loginProv
};
