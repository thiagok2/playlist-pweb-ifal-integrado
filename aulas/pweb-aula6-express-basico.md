# Roteamento

Instalação da biblioca
```
	npm install express
```

Criar arquivo server.js na pasta raiz do projeto

Criar pasta routes. Na pasta, criar arquivos
├── routes/
│   ├── UsuariosRouters.js
│   ├── FilmesRouters.js
│   ├── CanaisRouters.js
│   ├── PlaylistsRouters.js 

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
	node server.js
```

Testar no postman

http://localhost:3000/version

E tudo deve estar ok. Se não estiver... corrigir!


## Criando primeira rota
Criar um arquivo routes/UsuariosRouters.js

```js

import express from 'express';
import { Usuario } from '../models/index.js';
const router = express.Router();

//Rotas vão aqui!

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

Testar no Postman

```
GET http://localhost:3000/usuarios
```

2. Criando as primeiras rotas adicionado o conteúdo das rotas:

```js
router.post('/', async (_req, res) => {
  const usuario = await Usuario.create(_req.bodyß);
  res.json(usuario);
});
```
TESTAR

POST http://localhost:3000/usuarios
{
  "login": "jose.paulo",
  "nome": "José Paulo",
}

