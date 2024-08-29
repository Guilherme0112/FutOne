var express = require('express');
var app = express();

app.use(express.static('public'));
var path = require('path');

app.all('/', function(req, res){
    res.sendFile(__dirname + '/public/pages/index.html');
})
app.listen(8080, () => {
    console.log('Executando')
})