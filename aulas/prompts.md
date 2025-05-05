1. Testar conexão:
```
Dado um projeto node, usando sequelize, pg, dotenv.
Já tendo eu configurado meu banco com o arquivo config/database.js com:
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

Meu .env já está configurado.

Vamos criar um arquivo server.js, na raiz do projeto para testar a conexao com o banco. Quero apenas verificar a conexao com o banco se está ok, com o código atual.
```

2. Criando models
```
Tendo eu uma pasta models, analise o arquivo sql anexao e vamos criar todos os arquivos model de mapeamento. Sugiro que haja um arquivo Index.js que ele defina todos os relacionamentos e exporte os Models definitivos.

Eu já tenho o arquivo config/database.js
//const { Sequelize } = require('sequelize');//arquivos que vc instalou dependencias
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'//arquivos que vc instalou dependencias

dotenv.config(); // Carrega as variáveis de ambiente

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres', // ou 'mysql'
    port: process.env.DB_PORT
  }
);

export default sequelize;

Me mostre os arquivos de cada model e o index.js
```