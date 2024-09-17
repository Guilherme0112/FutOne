-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 17/09/2024 às 13:24
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `futone`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `autenticacao`
--

CREATE TABLE `autenticacao` (
  `id` int(11) NOT NULL,
  `token` varchar(10000) NOT NULL,
  `codigo` varchar(6) NOT NULL,
  `criado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `autenticacao`
--

INSERT INTO `autenticacao` (`id`, `token`, `codigo`, `criado`) VALUES
(24, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21lVG9rZW4iOiJGdWxhbm8iLCJlbWFpbFRva2VuIjoiY2FuYWxndWltZW5kc0BnbWFpbC5jb20iLCJzZW5oYVRva2VuIjoiJDJhJDEwJGhRU0VhRldVZ2NWclpEeWg3WTRIY2VwR3BkcDd0V3FZOFY2akpoZVpoYXlKdzZ4ZlQ1V0RXIiwiYmlvVG9rZW4iOiIiLCJpYXQiOjE3MjY1MDE0NTcsImV4cCI6MTcyNjUwMTc1N30.MOMSFEj8O1orrDiMUgyWShMfPB3aHzGjsBI0j6taNuI', 'c9835a', '2024-09-16 15:44:17');

-- --------------------------------------------------------

--
-- Estrutura para tabela `comentarios`
--

CREATE TABLE `comentarios` (
  `id` int(11) NOT NULL,
  `comentario` text NOT NULL,
  `idUser` int(11) NOT NULL,
  `idPost` int(11) NOT NULL,
  `criado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `criador`
--

CREATE TABLE `criador` (
  `id` int(11) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `nascimento` date NOT NULL,
  `sexo` enum('M','F','O','PND') NOT NULL DEFAULT 'PND',
  `idUser` int(11) NOT NULL,
  `criado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `criador`
--

INSERT INTO `criador` (`id`, `cpf`, `nascimento`, `sexo`, `idUser`, `criado`) VALUES
(8, '70600412148', '2005-12-01', 'M', 15, '2024-09-08 15:49:48');

-- --------------------------------------------------------

--
-- Estrutura para tabela `dislikes`
--

CREATE TABLE `dislikes` (
  `id` int(11) NOT NULL,
  `idPost` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `criado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `idPost` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `criado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `likes`
--

INSERT INTO `likes` (`id`, `idPost`, `idUser`, `criado`) VALUES
(49, 3, 15, '2024-09-15 20:59:37');

-- --------------------------------------------------------

--
-- Estrutura para tabela `postagens`
--

CREATE TABLE `postagens` (
  `id` int(11) NOT NULL,
  `foto` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `postagem` text NOT NULL,
  `tags` text DEFAULT NULL,
  `idUsuario` int(11) NOT NULL,
  `criado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `postagens`
--

INSERT INTO `postagens` (`id`, `foto`, `titulo`, `postagem`, `tags`, `idUsuario`, `criado`) VALUES
(3, 'uploads/2aa72621e5ca4e583b04dff3719827b3.jpg', 'GTA San Andreas: The Definitive Edition - Uma Análise Sincera', 'A remasterização de Grand Theft Auto: San Andreas, sem dúvida, representa um marco para os fãs da série. A Rockstar Games, com sua expertise em criar mundos abertos imensos e envolventes, prometeu uma experiência visualmente aprimorada e fiel ao clássico original. No entanto, a recepção da comunidade foi bastante dividida.\r\n\r\nO que deu certo?\r\n\r\nMundo aberto revitalizado: San Andreas nunca pareceu tão vivo. As texturas de alta resolução, a iluminação aprimorada e os modelos de personagens mais detalhados proporcionam uma imersão ainda maior nesse vasto mundo.\r\nJogabilidade aprimorada: A jogabilidade clássica do San Andreas foi mantida, mas com algumas melhorias como controles mais precisos e uma interface de usuário mais intuitiva.\r\nTrilha sonora icônica: A trilha sonora que marcou uma geração está de volta, com todas as suas músicas e sons característicos, transportando os jogadores de volta aos anos 90.\r\nO que poderia ter sido melhor?\r\n\r\nProblemas técnicos: Infelizmente, a Definitive Edition foi lançada com uma série de problemas técnicos, como bugs gráficos, quedas de frame rate e inconsistências visuais. Esses problemas, em alguns casos, prejudicaram a experiência de jogo e frustraram muitos fãs.\r\nEstilo artístico: A mudança no estilo artístico, com modelos de personagens mais arredondados e texturas mais lisas, desagradou alguns jogadores que preferiam o visual mais \"quadradinho\" do jogo original.', 'gta, gtasa, gtaremasterizado', 15, '2024-09-08 20:05:14'),
(4, 'uploads/d1ecc39c7c0b8b4a0dbb3ecfa1770132.jpg', 'Red Dead Redemption 2: Uma Obra-Prima do Oeste Selvagem', 'Red Dead Redemption 2 é, sem sombra de dúvidas, um dos jogos mais aclamados e completos da última década. A Rockstar Games conseguiu criar um mundo aberto imersivo e detalhado, com uma história épica e personagens complexos que marcaram a indústria dos videogames.\r\n\r\nO que torna Red Dead Redemption 2 tão especial?\r\n\r\nUm mundo vivo e pulsante: O mundo do jogo é rico em detalhes, com ciclos diários e climáticos que afetam a jogabilidade e a interação com o ambiente. Cada canto do mapa esconde segredos, missões secundárias e personagens únicos.\r\nHistória profunda e emocionante: A narrativa de Red Dead Redemption 2 é envolvente e emocionante, explorando temas como lealdade, redenção e as consequências das nossas ações. Os personagens são complexos e multifacetados, com arcos narrativos bem desenvolvidos.\r\nJogabilidade imersiva: O jogo oferece uma variedade de atividades, desde missões principais e secundárias até caça, pesca, acampamentos e muito mais. Cada detalhe, desde a forma como você interage com o seu cavalo até a maneira como você atira, foi cuidadosamente trabalhado para proporcionar uma experiência imersiva.\r\nGráficos e som de tirar o fôlego: O visual do jogo é simplesmente deslumbrante, com paisagens exuberantes, efeitos visuais impressionantes e uma atenção aos detalhes que é de tirar o fôlego. A trilha sonora, composta por Hans Zimmer e outros talentosos músicos, completa a experiência, criando uma atmosfera épica e emocionante.', 'readdead2, readdead, rockstar, ps4, ps5', 15, '2024-09-08 20:15:40');

-- --------------------------------------------------------

--
-- Estrutura para tabela `seguidores`
--

CREATE TABLE `seguidores` (
  `id` int(11) NOT NULL,
  `idSeguidor` int(11) NOT NULL,
  `idSeguindo` int(11) NOT NULL,
  `quando` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `foto` text NOT NULL DEFAULT '../images/user.jpg',
  `email` varchar(150) NOT NULL,
  `senha` text NOT NULL,
  `bio` text NOT NULL DEFAULT '',
  `criado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `nome`, `foto`, `email`, `senha`, `bio`, `criado`) VALUES
(15, 'Guilherme', '../images/user.jpg', 'guimendesmen124@gmail.com', '$2a$10$mltElpDDj7FJ/QQOl3J33OkVsgB07WEd2Tb.atbN9NUn7xpvo08ii', '', '2024-09-04 15:47:47'),
(16, 'Fulano', '../images/user.jpg', 'exemplo@gmail.com', '$2a$10$kTJmynBvE2ekd7sicnLm1uusGJhfVGQW8aMPHS/OUSz1dCBRPjQbW', 'ffsdf', '2024-09-08 13:25:30');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `autenticacao`
--
ALTER TABLE `autenticacao`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `criador`
--
ALTER TABLE `criador`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `dislikes`
--
ALTER TABLE `dislikes`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `postagens`
--
ALTER TABLE `postagens`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `seguidores`
--
ALTER TABLE `seguidores`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `autenticacao`
--
ALTER TABLE `autenticacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de tabela `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT de tabela `criador`
--
ALTER TABLE `criador`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de tabela `dislikes`
--
ALTER TABLE `dislikes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de tabela `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de tabela `postagens`
--
ALTER TABLE `postagens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `seguidores`
--
ALTER TABLE `seguidores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
