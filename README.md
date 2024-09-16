# FutOne  
<div align='center'>
<img width='150' src="https://i.imgur.com/ikAzHFv.png" alt="icon" border="0">
</div>
<p>Este é um site de notícias com mais destaque para notícias no mundo dos jogos, o usuário pode criar uma conta e criar as postagens (Que seriam as notícias), pode dar like e dar deslikes nos posts, o criador antes de começar criar postagens deverá preencher um formulário  para criar uma conta de criador onde ele terá acesso a páginas de criação de conteúdo.</p>
<h3>Tecnologias</h3>
<hr>
<p><strong>Front-End:</strong></p>
<p>HTML, CSS, JavaScript, AJAX</p>
<p><strong>Back-End:</strong></p>
<p>Node.JS, Express.JS</p>
<h3>Instalação</h3>
<hr>
<p>Baixe o repositório <a href='https://github.com/Guilherme0112/FutOne/archive/refs/heads/main.zip'>clicando aqui</a></p>
<p>Tenha o <a href='https://nodejs.org/pt/download/package-manager'>Node.JS</a> instalado</p>
<h3>Dependências:</h3>
<hr>
<code>npm install mysql</code>
<br>
<code>npm install express-session</code>
<br>
<code>npm install bcryptjs</code>
<br>
<code>npm install multer</code>
<br>
<code>npm install cpf-cnpj-validator</code>
<br>
<code>npm install moment</code>
<br>
<code>npm install dotenv</code>
<br>
<code>npm install nodemailer</code>
<br>
<code>npm install jsonwebtoken</code>
<hr>
<h3>Banco de dados</h3>
<br>
<p><strong>Banco de dados: </strong> Importe o arquivo que está no diretório "database/db.sql" para ter a estrutura do banco de dados</p>
<p><strong>Credenciais: </strong> Crie o arquivo <code>.env</code> e crie as credenciais <code>HOST</code>, <code>USER</code>, <code>PASSWORD</code>, <code>DATABASE</code> e coloque as credenciais do banco de dados</p>
<p><strong>Envio de E-mails: </strong> No arquivo <code>.env</code> e crie as credenciais <code>MAIL_MAILER</code>, <code>MAIL_HOST</code>, <code>MAIL_PORT</code>, <code>EMAIL</code>, <code>MAIL_PASS</code> e coloque as credenciais da API de envio de e-mails a partir do gmail.</p>
<p><strong>JWT: </strong> No arquivo <code>.env</code>, crie a credencial <code>JWT_KEY</code> e coloque sua chave que será usada para criptografar os tokens.</p>