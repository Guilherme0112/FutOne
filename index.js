var express = require('express');
var app = express();
var path = require('path')
app.use(express.static('public'));

app.all('/', function(req, res){
    res.sendFile(__dirname + '/public/pages/index.html');
})

// Login

app.get('/login', function(req, res){
    res.sendFile(__dirname + '/public/pages/login.html');
});

app.listen(8080, () => {
    console.log('Executando')
})