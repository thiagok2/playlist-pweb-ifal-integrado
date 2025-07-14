# Roteamento

Instalação da biblioteca:

```sh
	npm install express
```

Ela já foi instalada anteriormente, e já consta no package.json

Criar arquivo server.js na pasta raiz do projeto

Criar pasta routes. Na pasta, essas arquivos serão criados.


```
├── routes/
│   ├── UsuariosRouters.js
│   ├── FilmesRouters.js
│   ├── CanaisRouters.js
│   ├── PlaylistsRouters.js 
```
## Criar arquivo principal das rotas

No arquivo server.js

```js
import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './config/database.js';


//import usuarioRoutes from './routes/UsuariosRouters.js';
//import filmeRoutes from './routes/FilmesRouters.js';
//import canalRoutes from './routes/CanaisRouters.js';
//import playlistRoutes from './routes/PlaylistsRouters.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/version', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

//app.use('/usuarios', usuarioRoutes);
//app.use('/filmes', filmeRoutes);
//app.use('/canais', canalRoutes);
//app.use('/playlists', playlistRoutes);

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database ok');
    app.listen(port, () => {
      console.log(`Server ok port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar:', error);
  });
```

## Testar server no terminal:
```js
	npm start
```

Testar no postman

http://localhost:3000/version

E tudo deve estar OK. Se não estiver... corrigir!


## Criando primeira rota
Criar um arquivo routes/UsuariosRouters.js
Obs.: Lembre-se de descomentar os trechos no server.js que se referem as rotas de usuário.

```js
import usuarioRoutes from './routes/UsuariosRouters.js';
...

app.use('/usuarios', usuarioRoutes);
```

### UsuariosRouters
Agora vamos editar o UsuariosRouters.js:


```js

import express from 'express';
import { Usuario } from '../models/Index.js';
const router = express.Router();

//Rotas vão aqui! Vamos implementar daqui a pouco

export default router;

```

1. Criando as primeiras rotas adicionado o conteúdo das rotas:

```js
router.get('/', async (_req, res) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
});
```

Lembrar de descomentar os trechos referentes a lógica das rotas do UsuarioRouter.js

TESTAR no navegador ou no Postman

```
GET http://localhost:3000/usuarios
```

1. Criando a primeira rota que salva no banco usando sequelize:
Adicionar naquele trecho onde está o comentário //Rotas vão aqui!

```js
router.post('/', async (req, res) => {
  const usuario = await Usuario.create(req.body);
  res.json(usuario);
});
```
TESTAR no navegador ou no Postman

POST http://localhost:3000/usuarios
{
  "login": "jose.paulo",
  "nome": "José Paulo",
}

