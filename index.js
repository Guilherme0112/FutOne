var express = require('express');
var app = express();
var path = require('path')
var con = require('./database/db_connection');
app.use(express.static('public'));

app.all('/', function(req, res){
    res.sendFile(__dirname + '/public/pages/index.html');

})

// Login

app.get('/login', function(req, res){
    res.sendFile(__dirname + '/public/pages/login.html');
    con.query("SELECT * FROM postagens LIMIT 10", (err, result) => {
        if(err){
            console.log(err)
            res.status(500).send("Erro ao buscar dados");
        } else {
            console.log(typeof result)
        }
    });
});

app.get('/register', function(req, res){
    res.sendFile(__dirname + '/public/pages/register.html');
});

app.listen(8080, () => {
    console.log('Executando')
})