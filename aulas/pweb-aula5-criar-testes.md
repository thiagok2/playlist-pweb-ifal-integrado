# Testes

0. Roteiro
  1. Instalar pacotes
  2. Criar configuração de banco e pasta
  3. Criar testes
  4. Executar testes

1. ## Instalar pacotes
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

     Lembrando que os testes serão executados com o comando:
      ```
        npm test
      ```

    A próxima seção trata exatamente ads configurações necessárias. Desde a criação do banco, a escrita dos configurações da nova conexão oa banco de teste, até 
    configuração no package.json para execução dos testes com **npm install**.

2. ## Criar configuração de banco e pasta

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

    O arquivo setup.js configura para que o banco playlist_test seja limpo e recriado a cada teste. Isso ajuda a evitar que restrições como unicidade
    de login causem error. O banco de testes ajuda em isolar e tem um ambiente propício para testes.
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

        **Novo arquivo setup.test.js -  um teste simples apenas para verificar se o setup está OK**

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

    Obs.: O trecho de código acima:

# 🧪 Estrutura dos Testes com Mocha, Chai e Sequelize

Este projeto utiliza **Mocha** como framework de testes e **Chai** como biblioteca de asserções. Os testes são aplicados diretamente sobre a conexão com o banco de dados PostgreSQL e sobre o funcionamento das operações via Sequelize ORM.

## 🔍 `describe()`: Agrupamento Lógico dos Testes

A função `describe()` é usada para **organizar e agrupar casos de teste relacionados** sob um mesmo contexto ou funcionalidade. Ela recebe dois argumentos:

- Uma string descritiva, que explica o que está sendo testado;
- Uma função contendo os blocos de teste `it()` relacionados.

**Exemplo:**

```js
describe('Configuração do Ambiente de Testes', () => {
  // blocos de teste aqui
});
```

O grupo de testes será descrito como “Configuração do Ambiente de Testes”, e todos os testes definidos dentro desse escopo estão relacionados à verificação do ambiente e conexão com o banco.

---

## ✅ `it()`: Casos de Teste Individuais

A função `it()` define um **caso de teste específico**, ou seja, um cenário que será executado e validado.

Ela também recebe dois argumentos:

* Uma string que descreve o que o teste deve validar;
* Uma função assíncrona (ou síncrona) que executa o teste.

**Exemplo:**

```js
it('Deve conectar ao banco PostgreSQL', async () => {
  await sequelize.authenticate();
  expect(sequelize.config.database).to.equal('playlist_test');
});
```

Este teste verifica se a conexão com o banco de dados foi estabelecida com sucesso.

Outro exemplo:

```js
it('Deve criar um usuário no banco PostgreSQL', async () => {
  const usuario = await db.Usuario.create({
    login: 'teste123',
    nome: 'Usuário Teste',
  });

  expect(usuario).to.have.property('id');
  expect(usuario.login).to.equal('teste123');
  expect(usuario.nome).to.equal('Usuário Teste');
});
```

Este teste garante que o Sequelize consegue inserir um novo usuário na tabela e que os campos essenciais foram persistidos corretamente.

---

## 🧾 `expect()`: Asserções com Chai

A função `expect()` é parte da biblioteca **Chai** e é usada para realizar **asserções**, ou seja, verificar se os valores obtidos no teste correspondem aos valores esperados.

### Exemplos comuns:

* `expect(valor).to.equal(esperado)` – Verifica igualdade estrita;
* `expect(objeto).to.have.property('nome')` – Verifica se a propriedade existe;
* `expect(lista).to.be.an('array')` – Verifica o tipo do valor.

**Exemplo no contexto do teste:**

```js
expect(usuario).to.have.property('id');
expect(usuario.login).to.equal('teste123');
expect(usuario.nome).to.equal('Usuário Teste');
```

Essas instruções garantem que:

* O objeto `usuario` retornado tem um identificador (`id`);
* O valor do campo `login` corresponde ao informado;
* O nome foi armazenado corretamente no banco de dados.

---

## 🧰 Considerações Finais

* Os testes devem ser executados em um ambiente isolado, geralmente um banco específico de testes (ex: `playlist_test`);
* O uso de `async/await` nos testes é fundamental quando se trabalha com operações assíncronas como é o caso das operações de banco;
* O Sequelize deve estar devidamente configurado no `setup.js` para que os testes funcionem corretamente, conectando-se ao banco de testes e expondo os modelos via `db`.

> Esse padrão de testes é fundamental para garantir que sua aplicação esteja se comportando corretamente durante o desenvolvimento e antes de entrar em produção.

----------------------------------------


    5. Configurando *package.json*, para npm start, npm test. Lembrando que estamos utilizando o nodemon.
      Para automatizar a execução dos testes vamos atualizar o packege.json, na propriedade scripts

        ```json

              "scripts": {
                "start": "npx nodemon server.js",
                "test": "cross-env NODE_ENV=test mocha tests/**/*.test.js --exit"
              },
        ```

  Caso o cross-env não esteja no seu package.json, se faz necessário instalar com:
    
    ```
      npm install cross-env
    ```
  O cross-env é necessário para carregar variáveis do ambiente ao rodar o projeto no SO windows.

  3. ## Criando dos testes para os models

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

 
4. ## Testar ao final, executar
  
  Executar uma inserção simples mas que ao ser repetida temos um erro
  ```
    npm start
  ```

  Comando para executar testes livres
  ```
    npm test
  ```