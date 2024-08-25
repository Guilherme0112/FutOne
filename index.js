var http = require('http');
var con = require('./database/db_connection');

http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        con.query('SELECT * FROM produtos', (err, results) => {
            if(err) throw err;
            if(Object.keys(results).length === 0){
                res.write('Sem dados por agora');
                return false;
            }
            results.forEach(result => {
                valor = result.valor;
                valorString = valor.toString().replace('.', ',');
                valor = parseFloat(valorString);
                
                var html = `<p>Id: ${result.id}</p>
                            <p>Produto: ${result.produto}</p>
                            <p>Estoque: ${result.estoque}</p>
                            <p>Preço: ${valor}</p>`;
                        
                res.write(html);
            });
            res.end()
    });
}).listen(8080);