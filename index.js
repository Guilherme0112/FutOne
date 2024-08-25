var http = require('http');
var con = require('./database/db_connection');
var formidable = require('formidable');
const { Console } = require('console');

http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});

    // Selecionar os dados do banco de dados

    if(req.url === '/lista'){
        con.query("SELECT * FROM produtos", (err, results) => {
            if(err){
                res.write(JSON.stringify({"Erro": "Erro ao buscar os dados."}));
            }
            if(Object.keys(results).length === 0){
                res.write(JSON.stringify({"dados": "Sem dados"}));
                return false;
            }
            res.write(JSON.stringify(results));
            res.end();
        });

    // Adicionar dados ao banco de dados

    } else if(req.url === '/add' && req.method === 'POST'){
        try{    
            const form = new formidable.IncomingForm();
            form.parse(req, (err, dados, files) => {
                if(err){
                    res.write(JSON.stringify({"Erro: ": err}))
                }
                if(dados.hasOwnProperty('produto', 'valor', 'preco')){

                    // Converção dos dados

                    dados.produto = dados.produto.toString();
                    dados.preco = parseFloat(dados.preco);
                    dados.estoque = parseInt(dados.estoque);

                    // Validação dos dados

                    if(isNaN(dados.preco)){
                        res.write(JSON.stringify({"Erro": "O valor do preço é inválido"}))
                    }
                    if(isNaN(dados.estoque)){
                        res.write(JSON.stringify({"Erro": "O valor do estoque é inválido."}))
                    }
                    if(dados.produto.length > 50){

                        res.write(JSON.stringify({"Erro": "O nome do produto deve ter menos que 50 caracteres."}));
                    }
                }
                res.end();
            });
        } catch (err){
            console.log(err);
        }
    }
}).listen(8080);
