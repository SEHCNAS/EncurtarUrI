const express = require('express');
const shortenUrlRoute = require('./Routes/shorten-url-route.js');
const path = require('path'); // Biblioteca para lidar com caminhos de arquivos
const app = express();
const port = 3000;

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Usando as rotas para encurtar URLs
// Rota principal que captura o ID encurtado diretamente na URL
app.get('/:id?', async (req, res) => {
  const { id } = req.params;

  // Se o ID não for fornecido, serve o arquivo 'index.html'
  if (!id) {
      return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }

  try {
      // Chamada para a API que busca a URL original
      const response = await fetch(`http://10.10.0.18:3000/shorten-url/getOriginalUrl/${id}`);

      if (response.ok) {
          const data = await response.json();
          return res.redirect(data.originalUrl); // Redireciona para a URL original
      } else {
          console.log(response.text);
          return res.status(404).send('URL não encontrada');
          
      }
  } catch (error) {
      console.error('Erro ao buscar a URL original:', error);
      return res.status(500).send('Erro interno do servidor');
  }
});

// Middleware para permitir que o servidor parseie JSON no body das requisições
app.use(express.json());

// Usar as rotas
app.use('/shorten-url', shortenUrlRoute);


app.listen(port, '10.10.0.18',() => {
    console.log(`Servidor rodando em http://10.10.0.18:${port}`);
  });