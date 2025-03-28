# Encurtador de Links

Este projeto é um encurtador de links simples desenvolvido em Node.js. Ele permite encurtar URLs longas e redirecionar para o link original.

## 🚀 Tecnologias Utilizadas

- Node.js
- Express.js
- SQLite

## ⚙️ Como Usar

1. Inicie o servidor:
   ```sh
   npm start
   ```
2. Acesse `http://localhost:3000` no navegador.

### Criar um link encurtado via api
- Faça uma requisição `POST` para `http://localhost:3000/shorten-url` com um JSON:
  ```json
  {
    "url": "https://www.exemplo.com"
  }
  ```
- Resposta esperada:
  ```json
  {
    "shortUrl": "http://localhost:3000/abc123"
  }
  ```

### Redirecionar para o link original
- Acesse `http://localhost:3000/abc123` e você será redirecionado para `https://www.exemplo.com`.

