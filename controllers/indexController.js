const con = require('../database/db_connection');
const session = require('express-session');

// Função principal

const index = async (req, res) => {
    const sessao = req.session.user;

    // Query para buscar a postagem principal
    
    con.query('SELECT id, foto, titulo FROM postagens ORDER BY RAND() LIMIT 1', (err, mains) => {
      if(err) throw err;

    // Query para buscar as outras postagens

      con.query('SELECT * FROM postagens ORDER BY RAND() LIMIT 10', (err, posts) => {

        res.render('index', {sessao, mains, posts, session})
      })
    })
  };
  
module.exports = { index };