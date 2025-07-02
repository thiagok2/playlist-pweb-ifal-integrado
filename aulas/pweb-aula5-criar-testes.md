# Testes

1. Instalar pacotes
  Comando a executar

    ```
        npm install chai mocha sequelize-test-helpers sinon

    ```

    Essas linhas seram inseridas no seu package.json
     ```json
        "chai": "^5.2.0",
        "mocha": "^11.1.0",
        "sequelize-test-helpers": "^1.4.3",
        "sinon": "^20.0.0"
     ```

2. Criar configuração de banco e pasta

    1. Criar banco playlist_test no postgresql/pgadmin

    2. Atualizar config/database.js criando variaveis para os ambientes

    ```js
      import { Sequelize } from 'sequelize';
      import dotenv from 'dotenv';

      dotenv.config(); // Carrega as variáveis de ambiente

      const env = process.env.NODE_ENV || 'development';
      const config = {
        development: {
          database: process.env.DB_NAME,
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          dialect: 'postgres',
        },
        test: {
          database: 'playlist_test',
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          dialect: 'postgres',
          logging: false,
        },
        production: {
          database: process.env.DB_NAME,
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          dialect: 'postgres',
        },
      };

      const sequelize = new Sequelize(config[env]);

      export default sequelize;
    ```

    3. Criar a pasta tests

    4. Criar arquivos de configuração e tests simples

        tests/setup.js

        ```js
        import * as models from '../models/Index.js';
        import sequelize from '../config/database.js';

        const db = { ...models }; // Copia os modelos diretamente

        // Sincroniza o banco antes dos testes
        before(async () => {
          await sequelize.sync({ force: true }); // Recria as tabelas
        });

        // Limpa todas as tabelas após cada teste
        afterEach(async () => {
          await sequelize.truncate({ cascade: true, restartIdentity: true });
        });

        // Fecha a conexão após todos os testes
        after(async () => {
          await sequelize.close();
        });

        export { sequelize, db };
        ```

        **Novo arquivo setup -  um teste simples apenas para verificar**

        Criar tests/setup.test.js

        ```js
          import { expect } from 'chai';
          import { sequelize, db } from './setup.js';

          describe('Configuração do Ambiente de Testes', () => {
            it('Deve conectar ao banco PostgreSQL', async () => {
              await sequelize.authenticate();
              expect(sequelize.config.database).to.equal('playlist_test');
            });

            it('Deve criar um usuário no banco PostgreSQL', async () => {
              const usuario = await db.Usuario.create({
                login: 'teste123',
                nome: 'Usuário Teste',
              });

              expect(usuario).to.have.property('id');
              expect(usuario.login).to.equal('teste123');
              expect(usuario.nome).to.equal('Usuário Teste');
            });
          });
        ```

    5. Configurando *package.json*, para npm start, npm test

        ```json

              "scripts": {
                "start": "npx nodemon server.js",
                "test": "cross-env NODE_ENV=test mocha tests/**/*.test.js --exit"
              },
        ```

  Caso o cross-env não esteja no seu package.jso, se faz necessário instalar com:
    
    ```
      npm install cross-env
    ```
  O cross-env é necessário para carregar variáveis do ambiente ao rodar o projeto no SO windows.
    6. Criar arquivos testes, por exemplo Canal.test.js
   
  ```js
    import { expect } from 'chai';
    import { sequelize, db } from './setup.js';

    describe('Canal Model', () => {
      it('Deve criar um canal com dados válidos', async () => {
        const canal = await db.Canal.create({
          nome: 'Canal Teste',
          data_criacao: '2023-01-01',
          genero_tema: 'Entretenimento',
        });

        expect(canal).to.have.property('id');
        expect(canal.nome).to.equal('Canal Teste');
        expect(canal.genero_tema).to.equal('Entretenimento');
      });

      it('Não deve criar um canal sem nome', async () => {
        try {
          await db.Canal.create({
            data_criacao: '2023-01-01',
            genero_tema: 'Entretenimento',
          });
          expect.fail('Deveria ter lançado um erro de validação');
        } catch (error) {
          expect(error.name).to.equal('SequelizeValidationError');
        }
      });

      it('Não deve criar um canal sem data_criacao', async () => {
        try {
          await db.Canal.create({
            nome: 'Canal Sem Data',
            genero_tema: 'Entretenimento',
          });
          expect.fail('Deveria ter lançado um erro de validação');
        } catch (error) {
          expect(error.name).to.equal('SequelizeValidationError');
        }
      });

      it('Não deve criar um canal sem genero_tema', async () => {
        try {
          await db.Canal.create({
            nome: 'Canal Sem Tema',
            data_criacao: '2023-01-01',
          });
          expect.fail('Deveria ter lançado um erro de validação');
        } catch (error) {
          expect(error.name).to.equal('SequelizeValidationError');
        }
      });
    });
  ```

  **Comentario.test.js**



  ```js
  import { expect } from 'chai';
  import { sequelize, db } from './setup.js';

  describe('Comentario Model', () => {
    it('Deve criar um comentário com dados válidos', async () => {
      const usuario = await db.Usuario.create({
        login: 'teste123',
        nome: 'Usuário Teste',
      });

      const filme = await db.Filme.create({
        titulo: 'Filme Teste',
        genero: 'Ação',
        duracao: 120,
        ano_lancamento: 2023,
        nota_avaliacao: 8.5,
      });

      const comentario = await db.Comentario.create({
        id_usuario: usuario.id,
        id_filme: filme.id,
        texto: 'Ótimo filme!',
        avaliacao: 9.0,
      });

      expect(comentario).to.have.property('id');
      expect(comentario.id_usuario).to.equal(usuario.id);
      expect(comentario.id_filme).to.equal(filme.id);
      expect(comentario.texto).to.equal('Ótimo filme!');
      expect(parseFloat(comentario.avaliacao)).to.equal(9);
    });

    it('Não deve criar um comentário sem texto', async () => {
      const usuario = await db.Usuario.create({
        login: 'teste123',
        nome: 'Usuário Teste',
      });

      const filme = await db.Filme.create({
        titulo: 'Filme Teste',
        genero: 'Ação',
        duracao: 120,
        ano_lancamento: 2023,
        nota_avaliacao: 8.5,
      });

      try {
        await db.Comentario.create({
          id_usuario: usuario.id,
          id_filme: filme.id,
          avaliacao: 9.0,
        });
        expect.fail('Deveria ter lançado um erro de validação');
      } catch (error) {
        expect(error.name).to.equal('SequelizeValidationError');
      }
    });

    it('Não deve criar um comentário com avaliacao fora do intervalo', async () => {
      const usuario = await db.Usuario.create({
        login: 'teste123',
        nome: 'Usuário Teste',
      });

      const filme = await db.Filme.create({
        titulo: 'Filme Teste',
        genero: 'Ação',
        duracao: 120,
        ano_lancamento: 2023,
        nota_avaliacao: 8.5,
      });

      try {
        await db.Comentario.create({
          id_usuario: usuario.id,
          id_filme: filme.id,
          texto: 'Comentário Inválido',
          avaliacao: 11,
        });
        expect.fail('Deveria ter lançado um erro de validação');
      } catch (error) {
        expect(error.name).to.equal('SequelizeValidationError');
      }
    });
  });
  ```

 
3. Testar ao final, executar
  
  Executar uma inserção simples mas que ao ser repetida temos um erro
  ```
    npm start
  ```

  Comando para executar testes livres
  ```
    npm test
  ```