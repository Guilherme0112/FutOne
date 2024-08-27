var http = require('http');
var con = require('./database/db_connection');
var formidable = require('formidable');
const queryString = require('querystring');
const url = require('url');

http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});

    // Configurações para PUT e DELETE

    const edit = /^\/editar\/([0-9]+)$/;
    const delet = /^\/delete\/([0-9]+)$/;

    // Selecionar os dados do banco de dados

    if(req.url === '/lista' && req.method === 'GET'){
		try{
			con.query("SELECT * FROM produtos", (err, results) => {
				if(err){
					res.write(JSON.stringify({"Erro": "Erro ao buscar os dados."}));
				}
			//   console.log(typeof results, Object.keys(results).length);

				if(Object.keys(results).length === 0){
					res.write(JSON.stringify({"dados": "Sem dados"}));
					res.end();
					return false;
				}

				res.write(JSON.stringify(results));

				// console.log(JSON.stringify(results));
				res.end();
			});
		} catch (err) {
			res.end(err)
		}

    // Adicionar dados ao banco de dados

    } else if (req.url === '/add' && req.method === 'POST'){
        try{    
            const form = new formidable.IncomingForm();
            form.parse(req, (err, dados, files) => {
                if(err){
                    res.write(JSON.stringify({"Erro: ": err}))
                }
                if(dados.hasOwnProperty('estoque') && dados.hasOwnProperty('preco') && dados.hasOwnProperty('produto')){

                    // Converção dos dados

                    dados.produto = dados.produto.toString();
                    dados.preco = parseFloat(dados.preco);
                    dados.estoque = parseInt(dados.estoque);

                    // Validação dos dados

                    if(isNaN(dados.preco)){

                        res.write(JSON.stringify({"Erro": "O valor do preço é inválido"}));
                        res.end();
                        return false;
                    }
                    if(isNaN(dados.estoque)){

                        res.write(JSON.stringify({"Erro": "O valor do estoque é inválido."}));
                        res.end();
                        return false;
                    }
                    if(dados.produto.length > 50){

                        res.write(JSON.stringify({"Erro": "O nome do produto deve ter menos que 50 caracteres."}));
                        res.end();
                        return false;
                    }

                    // Inserção de dados

                   const sql = "INSERT INTO produtos (produto, estoque, valor) values (?, ?, ?)";
                   const values = [dados.produto, dados.estoque, dados.preco];

                   con.query(sql, values, (err, result) => {
                        if(err) throw err;
                        res.write(JSON.stringify({"Sucesso": "Dados inseridos com sucesso."}));
                    });

                } else {
                    res.write(JSON.stringify({"Erro": "Os campos estão incompletos"}));
                }
                res.end();
            });
        } catch (err){
            console.log(err);
        }

        // Editar dados no banco de dados

    } else if (edit.test(req.url) && req.method === 'PUT') {
        try{
            const parseUrl = url.parse(req.url, true);
            const parametros = parseUrl.query;
            var id = parametros.id || parseUrl.pathname.match(regex)[1];
            var idNum = Number(id);
            if(idNum){
                console.log(typeof idNum)
                if(typeof idNum === 'number'){
                    const form = new formidable.IncomingForm();
                    form.parse(req, (err, dados, files) => {
                        if(err){
                            res.write(JSON.stringify({"Erro: ": err}))
                        }
                        console.log(dados, err);
                    });
                    res.end();
                }
            } else {
                res.write(JSON.stringify({"Erro": "O valor tem que ser um número"}))
                res.end();
            }
        } catch (err) {
            res.write(JSON.stringify({"Erro: ": err}));
            res.end();
        }
    } else if (delet.test(req.url) && req.method === 'DELETE'){
		res.write(JSON.stringify({"Chegou": "Chegou legal"}));
	} else {
        res.write(JSON.stringify({"Erro": "Este método não existe"}));
        res.end();
    }
    res.end();
}).listen(8080);
