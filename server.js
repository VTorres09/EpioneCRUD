const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const SECRET = 'epionecrud'

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
  res.render('login.ejs')
});

// Loga um usuário
app.post('/', userController.login);

app.get('/register', function(req, res) {
  res.render('register.ejs')
});

// Registra um usuário
app.post('/register', userController.create);

// Retorna todos os usuarios
app.get('/show', verifyJWT, userController.findAll);

// Retorna um usuario especifico dado o id
app.get('/edit/:id', verifyJWT, userController.findById);

// Edita um usuario dado o id
app.post('/edit/:id', verifyJWT, userController.update);

// Deleta um usuario dado o id
app.get('/delete/:id', verifyJWT, userController.delete);

// Escuta requisicoes
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Função para checar se o token continua válido
function verifyJWT(req, res, next){
  try{
    const token = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(token, SECRET);
    req.user = decode;
    next();
  } catch(error){
    return res.status(401).send({mensagem: 'Falha na autenticação'});
  }

}
