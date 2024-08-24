var http = require('http');
var mo = require('./demo.js');
var fs = require('fs');


http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('demo.html', function(err, data){
        res.write(data);
    });
    fs.appendFile('cursoNode.txt', 'Curso de Noje JS', function(err){
        if(err) throw err;
        console.log('Salvo!');    
    });
    fs.writeFile('cursoNode.txt', 'Este é um arquivo de texto adicionado com Node.JS', function(err){
        if(err) throw err;
        console.log('Atualizado com sucesso!')
    });
    res.end('O horário atual é ' + mo.myDateTime());
}).listen(8080);
