# Rotas de Usuários com Express e Sequelize

O objetivo é explicar cada rota do arquivo `UsuariosRouters.js`, destacando o uso do Sequelize e o tratamento de no Express.

---

## Pré-requisitos

1. **Express** está instalado:
   ```bash
   npm install express
   ```

2. A pasta `routes` contém o arquivo `UsuariosRouters.js`.

---

## Estrutura do Projeto

A estrutura do projeto segue a organização abaixo:

```
├── routes/
│   ├── UsuariosRouters.js
│   ├── FilmesRouters.js
│   ├── CanaisRouters.js
│   ├── PlaylistsRouters.js
....
├── config/
│   ├── database.js
├── server.js
```

Este guia foca no arquivo `routes/UsuariosRouters.js`.

---


## Configurar arquivo server.js

No arquivo server.js acrescentar novos imports:
```js
import usuarioRoutes from './routes/UsuariosRouters.js';
import filmeRoutes from './routes/FilmesRouters.js';
...
const app = express();
...
app.use('/usuarios', usuarioRoutes);
app.use('/filmes', filmeRoutes);
...



```

## Implementação das Rotas

As rotas implementadas no arquivo `UsuariosRouters.js` são:

1. `GET /` - Listar todos os usuários.
2. `GET /:id` - Obter um usuário por ID.
3. `POST /` - Criar um novo usuário.
4. `PUT /:id` - Atualizar um usuário existente.
5. `DELETE /:id` - Deletar um usuário.
6. `GET /search` - Buscar usuários por nome, login ou email.
7. `GET /buscar-por-email-ou-login` - Buscar um usuário por email ou login.

---

### 0. Definir imports

No topo do arquivo definir os imports

```js
import express from 'express';
import { Usuario } from '../models/Index.js';
import { Op }  from 'sequelize';
```

No topo final do arquivo, escrever
```js
export default router;
```

### 2. Instanciar objeto router
``` js

const router = express.Router();

```

### 1. Listar Todos os Usuários (`GET /`)

**Objetivo**: Retornar uma lista de todos os usuários cadastrados no banco de dados.

**Código**:
```js
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (err) {
    return res.status(500).json({ error: 'Erro recuperar usuários', details: err });
  }
});
```

**Explicação**:
- **Método HTTP**: `GET`
- **Rota**: `/usuarios`
- **Função do Sequelize**:
  - `Usuario.findAll()`: Método do Sequelize que retorna todas as entradas da tabela `Usuario`. Ele executa uma query SQL equivalente a `SELECT * FROM Usuarios`.
- **Express**:
  - `req`: Não utiliza parâmetros de consulta ou corpo, pois a rota simplesmente retorna todos os registros.
  - `res.json(usuarios)`: Envia a lista de usuários como resposta no formato JSON.
- **Tratamento de Erros**:
  - O bloco `try/catch` captura erros que possam ocorrer durante a consulta ao banco (e.g., falha de conexão).
  - Em caso de erro, retorna status HTTP 500 (Internal Server Error) com uma mensagem de erro e detalhes.
- **Teste no Postman**:
  - Envie uma requisição `GET` para `http://localhost:3000/usuarios`.
  - Esperado: Lista de usuários em JSON (e.g., `[{ id: 1, nome: "José Paulo", login: "jose.paulo", email: "jose@example.com" }, ...]`).

---

### 2. Obter Usuário por ID (`GET /:id`)

**Objetivo**: Retornar os dados de um usuário específico com base no ID fornecido.

**Código**:
```js
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    
    if (usuario)
      res.json(usuario);
    else
      res.status(404).json({ error: 'Nenhum usuário encontrado' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro recuperar usuários', details: err });
  }
});
```

**Explicação**:
- **Método HTTP**: `GET`
- **Rota**: `/usuarios/:id` (e.g., `/usuarios/1`)
- **Função do Sequelize**:
  - `Usuario.findByPk(id)`: Busca um registro na tabela `Usuario` pelo campo `id` (chave primária). Equivale a `SELECT * FROM Usuarios WHERE id = ?`.
- **Express**:
  - `req.params.id`: Extrai o parâmetro `id` da URL (e.g., `1` em `/usuarios/1`).
  - `res.json(usuario)`: Retorna o usuário encontrado em formato JSON.
  - Se o usuário não for encontrado (`usuario` é `null`), retorna status 404 com mensagem de erro.
- **Tratamento de Erros**:
  - Captura erros de consulta ao banco (e.g., ID inválido ou falha de conexão) e retorna status 500.
- **Teste no Postman**:
  - Envie `GET http://localhost:3000/usuarios/1`.
  - Esperado: Dados do usuário com ID 1 ou erro 404 se não existir.

---

### 3. Criar Novo Usuário (`POST /`)

**Objetivo**: Criar um novo usuário com base nos dados enviados no corpo da requisição.

**Código**:
```js
router.post('/', async (req, res) => {
  try {
    const usuario = Usuario.build(req.body);
    await usuario.validate();
    await usuario.save();
    
    res.json(usuario);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao salvar usuário', details: err });
  }
});
```

**Explicação**:
- **Método HTTP**: `POST`
- **Rota**: `/usuarios`
- **Função do Sequelize**:
  - `Usuario.build(req.body)`: Cria uma instância do modelo `Usuario` com os dados do corpo da requisição (e.g., `{ "nome": "José Paulo", "login": "jose.paulo", "email": "jose@example.com" }`).
  - `usuario.validate()`: Valida os dados com base nas regras definidas no modelo (e.g., campos obrigatórios, formatos).
  - `usuario.save()`: Persiste o usuário no banco de dados (equivalente a `INSERT INTO Usuarios ...`).
- **Express**:
  - `req.body`: Contém os dados enviados no corpo da requisição (formato JSON).
  - `res.json(usuario)`: Retorna o usuário criado como resposta.
- **Tratamento de Erros**:
  - Erros de validação (e.g., email inválido) ou falhas no banco são capturados no bloco `try/catch`.
  - Retorna status 500 com detalhes do erro.
- **Teste no Postman**:
  - Envie `POST http://localhost:3000/usuarios` com corpo:
    ```json
    {
      "login": "jose.paulo",
      "nome": "José Paulo",
      "email": "jose@example.com"
    }
    ```
  - Esperado: Dados do usuário criado em JSON.

---

### 4. Atualizar Usuário (`PUT /:id`)

**Objetivo**: Atualizar os dados de um usuário existente com base no ID.

**Código**:
```js
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Usuario.update(req.body, {
      where: { id },
    });

    if (updated) {
      const updatedUser = await Usuario.findByPk(id);
      return res.json(updatedUser);
    }

    return res.status(404).json({ error: 'Usuário não encontrado' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar usuário', details: err });
  }
});
```

**Explicação**:
- **Método HTTP**: `PUT`
- **Rota**: `/usuarios/:id` (e.g., `/usuarios/1`)
- **Função do Sequelize**:
  - `Usuario.update(req.body, { where: { id } })`: Atualiza os campos do usuário com o ID especificado com base nos dados de `req.body`. Retorna um array onde o primeiro elemento (`updated`) indica o número de linhas afetadas.
  - `Usuario.findByPk(id)`: Busca o usuário atualizado para retornar seus dados.
- **Express**:
  - `req.params.id`: Extrai o ID da URL.
  - `req.body`: Contém os dados a serem atualizados (e.g., `{ "nome": "José Paulo Atualizado" }`).
  - `res.json(updatedUser)`: Retorna o usuário atualizado.
  - Se nenhum usuário for encontrado (`updated` é 0), retorna status 404.
- **Tratamento de Erros**:
  - Captura erros de validação ou banco e retorna status 500.
- **Teste no Postman**:
  - Envie `PUT http://localhost:3000/usuarios/1` com corpo:
    ```json
    {
      "nome": "José Paulo Atualizado",
      "email": "jose.novo@example.com"
    }
    ```
  - Esperado: Dados do usuário atualizado ou erro 404.

---

### 5. Deletar Usuário (`DELETE /:id`)

**Objetivo**: Remover um usuário do banco de dados com base no ID.

**Código**:
```js
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Usuario.destroy({
      where: { id },
    });

    if (deleted) {
      return res.json({ message: 'Usuário deletado com sucesso' });
    }

    return res.status(404).json({ error: 'Usuário não encontrado' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao deletar usuário', details: err });
  }
});
```

**Explicação**:
- **Método HTTP**: `DELETE`
- **Rota**: `/usuarios/:id` (e.g., `/usuarios/1`)
- **Função do Sequelize**:
  - `Usuario.destroy({ where: { id } })`: Deleta o usuário com o ID especificado. Retorna o número de linhas deletadas.
- **Express**:
  - `req.params.id`: Extrai o ID da URL.
  - `res.json({ message: 'Usuário deletado com sucesso' })`: Confirma a exclusão.
  - Se nenhum usuário for encontrado (`deleted` é 0), retorna status 404.
- **Tratamento de Erros**:
  - Captura erros de banco e retorna status 500.
- **Teste no Postman**:
  - Envie `DELETE http://localhost:3000/usuarios/1`.
  - Esperado: Mensagem de sucesso ou erro 404.

---

### 6. Buscar Usuários por Nome, Login ou Email (`GET /search`)

**Objetivo**: Realizar uma busca flexível por usuários com base em um termo de pesquisa que pode corresponder ao `nome`, `login` ou `email`.


#### Importante: Onde colocar nos métodos novos
  Obs.: As próximas rotas devem ser criadas no topo do arquivo para que as elas não fiquem escondidas e sejam interpretadas
  no get/:id. 


**Código**:
```js
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Parâmetro "q" é obrigatório' });
  }

  try {
    const usuarios = await Usuario.findAll({
      where: {
        [Op.or]: [
          { nome: { [Op.iLike]: `%${q}%` } },
          { login: { [Op.iLike]: `%${q}%` } },
          { email: { [Op.iLike]: `%${q}%` } },
        ],
      },
    });

    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Error na busca', details: err });
  }
});
```

**Explicação**:
- **Método HTTP**: `GET`
- **Rota**: `/usuarios/search?q=termo` (e.g., `/usuarios/search?q=jose`)
- **Função do Sequelize**:
  - `Usuario.findAll({ where: { [Op.or]: [...] } })`: Realiza uma consulta com a condição `OR`, combinando múltiplos critérios.
  - `Op.iLike`: Operador do Sequelize para busca case-insensitive com correspondência parcial (equivalente a `LIKE` no SQL com `%` para qualquer sequência de caracteres).
  - Exemplo: `{ nome: { [Op.iLike]: `%${q}%` } }` busca nomes que contenham o termo `q`.
- **Express**:
  - `req.query.q`: Extrai o parâmetro de consulta `q` da URL (e.g., `jose` em `/search?q=jose`).
  - Valida se `q` foi fornecido; se não, retorna status 400 (Bad Request).
  - `res.json(usuarios)`: Retorna a lista de usuários correspondentes.
- **Tratamento de Erros**:
  - Captura erros de consulta e retorna status 500.
- **Teste no Postman**:
  - Envie `GET http://localhost:3000/usuarios/search?q=jose`.
  - Esperado: Lista de usuários com `nome`, `login` ou `email` contendo "jose".

---

### 7. Buscar Usuário por Email ou Login (`GET /buscar-por-email-ou-login`)

**Objetivo**: Encontrar um único usuário com base no email ou login fornecido.

**Código**:
```js
router.get('/buscar-por-email-ou-login', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Parâmetro "valor" é obrigatório' });
  }

  try {
    const usuario = await Usuario.findOne({
      where: {
        [Op.or]: [
          { email: q },
          { login: q },
        ],
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Erro na busca', details: err });
  }
});
```

**Explicação**:
- **Método HTTP**: `GET`
- **Rota**: `/usuarios/buscar-por-email-ou-login?q=valor` (e.g., `/usuarios/buscar-por-email-ou-login?q=jose.paulo`)
- **Função do Sequelize**:
  - `Usuario.findOne({ where: { [Op.or]: [...] } })`: Busca o primeiro usuário que corresponda ao critério `email = q` ou `login = q`.
  - `Op.or`: Combina condições para buscar por email ou login.
- **Express**:
  - `req.query.q`: Extrai o parâmetro `q` da URL.
  - Valida a presença de `q`; se ausente, retorna status 400.
  - `res.json(usuario)`: Retorna o usuário encontrado.
  - Se nenhum usuário for encontrado, retorna status 404.
- **Tratamento de Erros**:
  - Captura erros de consulta e retorna status 500.
- **Teste no Postman**:
  - Envie `GET http://localhost:3000/usuarios/buscar-por-email-ou-login?q=jose.paulo`.
  - Esperado: Dados do usuário com o login ou email correspondente ou erro 404.

---

## Configuração do Servidor

No arquivo `server.js`, descomente as linhas referentes às rotas de usuários:

```js
import usuarioRoutes from './routes/UsuariosRouters.js';
app.use('/usuarios', usuarioRoutes);
```

Isso associa todas as rotas definidas em `UsuariosRouters.js` ao prefixo `/usuarios`.

---

## Testando a API

1. **Iniciar o servidor**:
   ```bash
   node server.js
   ```
   Verifique no console: `Database ok` e `Server ok port 3000`.

2. **Testar a versão da API**:
   - Envie `GET http://localhost:3000/version` no Postman.
   - Esperado: `{"status":"ok","version":"1.0.0"}`.

3. **Testar as rotas de usuários**:
   - Use os exemplos de requisições fornecidos acima para cada rota.
   - Certifique-se de que o banco de dados está sincronizado e os modelos estão corretamente definidos.

---

## Considerações Finais

- **Sequelize**:
  - Simplifica operações no banco de dados com métodos como `findAll`, `findByPk`, `create`, `update` e `destroy`.
  - Suporta operadores avançados (`Op.iLike`, `Op.or`) para buscas complexas.
  - Validações no modelo garantem consistência dos dados.

- **Express**:
  - Gerencia requisições (`req.params`, `req.query`, `req.body`) e respostas (`res.json`, `res.status`).
  - Estrutura modular com `Router` facilita a organização das rotas.

- **Tratamento de Erros**:
  - Todas as rotas usam `try/catch` para capturar erros do banco.
  - Retornam códigos HTTP apropriados (200, 400, 404, 500) com mensagens claras.

Este guia pode ser usado em sala de aula para ensinar conceitos de APIs REST, integração com banco de dados e boas práticas de desenvolvimento com Node.js, Express e Sequelize.