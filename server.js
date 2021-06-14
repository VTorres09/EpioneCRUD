const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient
const uri = "mmongodb+srv://admin:admin@cluster0.63h1t.mongodb.net/Cluster0?";

app.use(bodyParser.urlencoded({ extended: true }))

//Tipo de template engine
app.set('view engine', 'ejs')

// Conexão com o mongo
MongoClient.connect(uri, (err, client) => {
  if (err) return console.log(err)
  db = client.db('Cluster0') // coloque o nome do seu DB

  app.listen(3000, () => {
    console.log('Server running on port 3000')
  })
})

// Rota da pagina principal para cadastrar clientes
app.route('/') 
.get(function(req, res) {
  const cursor = db.collection('data').find()
  res.render('index.ejs')
})

.post((req, res) => {
  db.collection('data').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('Salvo no Banco de Dados')
    res.redirect('/show')
  })
})

// Rota para mostrar clientes cadastrados
app.route('/show')
.get((req, res) => {
    // Acessa o db e retorna um array results com todos os usuários armazenados
  db.collection('data').find().toArray((err, results) => {
    if (err) return console.log(err)
    // Passa para o front a lista e renderiza a pagina
    res.render('show.ejs', { data: results })
  })
})

// Rota para editar clientes
app.route('/edit/:id')
.get((req, res) => {
  var id = req.params.id
  // Acessa o db e retorna um array results com todos os usuários armazenados
  db.collection('data').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    // Passa para o front a lista e renderiza a pagina
    res.render('edit.ejs', { data: result })
  })
})
.post((req, res) => {
  var id = req.params.id
  var name = req.body.name
  var surname = req.body.surname
    // Faz o update no banco de dados
  db.collection('data').updateOne({_id: ObjectId(id)}, {
    $set: {
      name: name,
      surname: surname
    }
  }, (err, result) => {
    if (err) return res.send(err)
    res.redirect('/show')
    console.log('Atualizado no Banco de Dados')
  })
})

// Rota para deletar clientes
app.route('/delete/:id')
.get((req, res) => {
  var id = req.params.id
    // Deleta no banco de dados
  db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log('Deletado do Banco de Dados!')
    res.redirect('/show')
  })
})