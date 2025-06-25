https://dontpad.com/ifal-20250430

# Tutorial playlist


# Criar banco de dados no postgresql com o nome playlist
## Configuração do projeto
1. Criar pasta localmente pweb2-playlist
2. Abrir pasta dentro VSC;
3. Abrir o terminal e executar o comando:
   
    ```
      npm init -y
    ```

  obs.: Atenção a estar na pasta do projeto!
1. Instalar dependências
   
    ```
      npm install pg dotenv sequelize express
    ```

1. (NOVO) Atualizar package.json inserindo "type": "module". Conteúdo:
```json
  {
    "name": "pweb",
    "version": "1.0.0",
    "main": "index.js",
    "type": "module",
    "scripts": {
      "test": "node server.js"
    },
    "author": "",
    "license": "ISC",
    "description": "",
    "dependencies": {
      "dotenv": "^16.4.7",
      "express": "^4.21.2",
      "pg": "^8.14.1",
      "sequelize": "^6.37.6"
    }
  }

```

2. Criar arquivos na raiz do projeto
   1. Criar .env, conteúdo em uma máquina pessoal
    ```
      DB_HOST=localhost
      DB_USER=postgres
      DB_PASSWORD=postgres
      DB_NAME=playlist
      DB_PORT=5432
    ```

    Caso esteja no *laboratório*, abaixo a provável configuração do .env

    ```
      DB_HOST=localhost
      DB_USER=aluno
      DB_PASSWORD=aluno
      DB_NAME=playlist
      DB_PORT=5432
    ```


   2. Criar .gitignore conteúdo:

   ```
    node_modules
   ```
   Obs.: Pasta pode ser recriada por meio do comando:
    ```
      npm install
    ```

## Criar pastas para organização na raiz do projeto
  * aulas
  * config
  * models
  * tests
  * data
  * routes
  

## Criar config/database.js para configurar o acesso ao banco
  1. Dentro da pasta config criar *database.js*
    
    ```js

    import { Sequelize } from 'sequelize';
    import dotenv from 'dotenv'

    dotenv.config(); // Carrega as variáveis de ambiente

    const sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT
      }
    );

    export default sequelize;

    ```

## Criar um arquivo server.js na raiz do projeto
  Por hora, esse arquivo vai testar noss configuração com o banco.
  Obs.: Caso exista um index.js, renomei-o.

  ```js
  import sequelize from './config/database.js';

  (async () => {
    try {
      await sequelize.authenticate();
      console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
    } catch (error) {
      console.error('❌ Não foi possível conectar ao banco de dados:', error);
    } finally {
      await sequelize.close();
    }
  })();

  ```

  ## Testar no terminal
  ```
    node server.js
  ```

  Deve-se receber a mensagem de conexão ok. Caso não verificar a mansagem de erro e as configurações de banco.