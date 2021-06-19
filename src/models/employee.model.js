'user strict';
var dbConn = require('./../../config/db.config');

// Cria um objeto user
var User = function(employee){
    this.first_name     = employee.first_name;
    this.last_name      = employee.last_name;
    this.email          = employee.email;
    this.password       = employee.password;
    this.status         = employee.status ? employee.status : 1;
    this.created_at     = new Date();
    this.updated_at     = new Date();
};

/* ------ Comandos do Banco de Dados ------ */

// Cadastra um usuário no banco
User.create = function (newEmp, result) {    
    dbConn.query("INSERT INTO users set ?", newEmp, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });           
};

// Procura um usuário no banco pelo id
User.findById = function (id, result) {
    dbConn.query("Select * from users where id = ? ", id, function (err, res) {             
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });   
};

// Retorna todos os usuarios
User.findAll = function (result) {
    dbConn.query("Select * from users", function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{
            console.log('employees : ', res);  
            result(null, res);
        }
    });   
};

// Modifica campos de um usuario especificado pelo id
User.update = function(id, employee, result){
  dbConn.query("UPDATE users SET first_name=?, last_name=?,email=?,password=? WHERE id = ?", [employee.first_name,employee.last_name,employee.email,employee.password,id], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }else{   
            result(null, res);
        }
    }); 
};

// Deleta um usuario do banco
User.delete = function(id, result){
     dbConn.query("DELETE FROM users WHERE id = ?", [id], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(null, err);
        }
        else{
            result(null, res);
        }
    }); 
};

module.exports= User;