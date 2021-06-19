const express = require('express');
const bodyParser = require('body-parser');

// Cria um app express
const app = express();

// Define tipo de template engine
app.set('view engine', 'ejs')

// Configura porta do servidor
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//Verificar erro de diretorio
const userController = require('D://EpioneCRUD//EpioneCRUD/src/controllers/employee.controller.js');

app.get('/', function(req, res) {
  res.render('index.ejs')
});

// Cria um novo usuário
app.post('/', userController.create);

// Retorna todos os usuarios
app.get('/show', userController.findAll);

// Retorna um usuario especifico dado o id
app.get('/edit/:id', userController.findById);

// Edita um usuario dado o id
app.post('/edit/:id', userController.update);

// Deleta um usuario dado o id
app.get('/delete/:id', userController.delete);

// Escuta requisicoes
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});