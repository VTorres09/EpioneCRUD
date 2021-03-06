'use strict';

const User = require('../models/employee.model');
const jwt = require('jsonwebtoken');
const SECRET = 'epionecrud'

exports.findAll = function(req, res) {
  User.findAll(function(err, user) {
    if (err) res.send(err);
    //Retorna todos os usuarios cadastrados e renderiza show.ejs
    res.render('../views/show.ejs', {data: user})
  });
};

exports.create = function(req, res) {
    //Cria um usuario pegando elementos de index.ejs
    const new_user = new User(req.body);

   if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        //Registra um usuario
        User.create(new_user, function(err, user) {
            if (err) return console.log(err)
            console.log('Usuário Cadastrado!')
            res.render('../views/login.ejs')
        });
    }
};

exports.findById = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) res.send(err);
        //Retorna um usuario especifico pelo id e passa para renderizar edit.ejs
        res.render('../views/edit.ejs', { data: user})
    });
};

exports.update = function(req, res) {
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        //Faz update de um user
        User.update(req.params.id, new User(req.body), function(err, user) {
            if (err) res.send(err);
            //Lista todos os usuarios e passa para renderizar show.ejs
            User.findAll(function(err, user) {
                if (err) res.send(err);
                res.render('../views/show.ejs', {data: user})
              });
        });
    }
  
};

exports.delete = function(req, res) {
    //Deleta um user
  User.delete( req.params.id, function(err, user) {
    if (err) res.send(err);
    //Lista todos os usuarios e passa para renderizar show.ejs
    User.findAll(function(err, user) {
        if (err) res.send(err);
        res.render('../views/show.ejs', {data: user})
      });
  });
};



exports.login = function(req, res) {
        User.findByEmail(req.body.email, req.body.password, function(err, user) {
            if (err || user.length==0){
                console.log('Email não cadastrado!')
                res.render('../views/login.ejs');
            }else{
                //Faz a assinatura passando o id do usuario e delimitando que o token expira em 5min
                const token = jwt.sign({userID: JSON.stringify(user[0].id)}, SECRET, {expiresIn: 300})
                //Lista os usuarios cadastrados e passa para renderizar show.ejs
                User.findAll(function(err, user) {
                    if (err) res.send(err);
                    //Envia o token que deve ser armazenado pelo cliente para fazer requisições
                    return res.render('../views/show.ejs', {data: user, auth: true, token: token});
                  });       
            }
            
        });
  };