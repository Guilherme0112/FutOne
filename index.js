var http = require('http');
var mo = require('./demo.js');
var fs = require('fs');


http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});

    // Criando arquivo

    fs.readFile('demo.html', function(err, data){
        res.write(data);
    });

    // Adicionando texto no arquivo

    fs.appendFile('cursoNode.txt', 'Curso de Noje JS', function(err){
        if(err) throw err;
        console.log('Salvo!');    
    });


    // Atualizando o texto do arquivi 

    fs.writeFile('cursoNode.txt', 'Este é um arquivo de texto adicionado com Node.JS', function(err){
        if(err) throw err;
        console.log('Atualizado com sucesso!')
    });


    // Deletado o arquivo

    // fs.unlink('cursoNode.txt', function(err){
    //     if(err) throw err;
    //     console.log('Apagado!');
    // })


    // Renomeando o arquivo

    fs.rename('cursoNode.txt', 'CursoNodeJS.txt', function(err){
        if(err) throw err;
        console.log('Renomeado!')
    })
    res.end('O horário atual é ' + mo.myDateTime());
}).listen(8080);
