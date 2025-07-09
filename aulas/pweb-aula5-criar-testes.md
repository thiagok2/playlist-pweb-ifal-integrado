# Testes

0. Roteiro
  1. Instalar pacotes
  2. Criar configuração de banco e pasta
  3. Criar testes
  4. Executar testes

1. ## Instalar pacotes
  Comando a executar


    ```sh
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

  Mas para isso é necessária configuração no package.json

  Configurando *package.json*, para npm start, npm test. Lembrando que estamos utilizando o nodemon.
  Para automatizar a execução dos testes vamos atualizar o packege.json, na propriedade scripts

  ```json

        "scripts": {
          "start": "npx nodemon server.js",
          "test": "cross-env NODE_ENV=test mocha tests/**/*.test.js --exit"
        },
  ```

  Caso o cross-env não esteja no seu package.json, se faz necessário instalar com:
  
  ```sh
    npm install cross-env
  ```

  O cross-env faz funcionar as configurações de variáveis no ambiente windows.
  O trecho ```mocha tests/**/*.test.js**``` faz com que todos os arquivos terminados com test.js dentro da pasta tests sejam executados. Já o trecho ```NODE_ENV=test```, configura essa variável que será utilizada no ```config/database.js```.


  A próxima seção trata exatamente ads configurações necessárias. Desde a criação do banco, a escrita dos configurações da nova conexão ao banco de teste

2. ## Criar configuração de banco, criação pasta tests, configuração do package.json

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

    O arquivo **setup.js** configura para que o banco playlist_test seja limpo e recriado a cada teste. Isso ajuda a evitar que restrições como unicidadede login causem erro. O banco de exclusivo paratestes ajuda em isolar o ambiente com foco testes.
      
    ### tests/setup.js

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

      Repare a última linha que exporta a conexão sequelize e a referência de todos models dentro da variável db.

      ### **Novo arquivo setup.test.js** -  um teste simples apenas para verificar se o setup está OK
      
      ### Criar tests/setup.test.js

      Esse arquivo importa o **setup.js** para a configuração necessário do banco para testes. Todos os seus arquivos de testes importaram esse
      arquivo.

      Ele autentica e testa o nome do banco testes no primeiro test, sobre o comando **it**, no trecho:

        ```js
          it('Deve conectar ao banco PostgreSQL', async () => {
            await sequelize.authenticate();
            expect(sequelize.config.database).to.equal('playlist_test');
          });
        ```

      A seguir cria um usuário simples em uma operação com o await db.Usuario.create

      ### Arquivo completo

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

O cross-env é necessário para carregar variáveis do ambiente ao rodar o projeto no SO windows.

# 🧪 Estrutura dos Testes com Mocha, Chai e Sequelize

Este projeto utiliza **Mocha** como framework de testes e **Chai** como biblioteca de asserções. Os testes são aplicados diretamente sobre a conexão com o banco de dados PostgreSQL e sobre o funcionamento das operações via Sequelize ORM.

## `describe()`: Agrupamento Lógico dos Testes

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

## `it()`: Casos de Teste Individuais

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

## `expect()`: Asserções com Chai

Todos os exemplos postos tem dentro dos testes os comandos **expect** pois são eles quem de fatos testam algo. Testam um propriedade de um objeto/propriedade e testam se ela existe, ou se tem um determinado valor, e etc.

A função `expect()` é parte da biblioteca **Chai** e é usada para realizar **asserções**, ou seja, verificar se os valores obtidos no teste correspondem aos valores esperados.

### Exemplos comuns:

* `expect(valor).to.equal(esperado)` – Verifica igualdade estrita;
* `expect(objeto).to.have.property('nome')` – Verifica se a propriedade existe;
* `expect(lista).to.be.an('array')` – Verifica o tipo do valor.

**Exemplo no contexto do teste Usuario.test.js:**

```js
expect(usuario).to.have.property('id');
expect(usuario.login).to.equal('teste123');
expect(usuario.nome).to.equal('Usuário Teste');
```
Essas instruções garantem que:

* O objeto `usuario` retornado tem um identificador (`id`);
* O valor do campo `login` corresponde ao informado;
* O nome foi armazenado corretamente no banco de dados.


Testando relacionamentos

```js
const comentario = await db.Comentario.create({
  id_usuario: usuario.id,
  id_filme: filme.id,
  texto: 'Gostei muito!',
  avaliacao: 8.5,
});

expect(comentario).to.have.property('id_usuario', usuario.id);
expect(comentario).to.have.property('id_filme', filme.id);
expect(comentario.texto).to.be.a('string').and.to.have.length.above(5);
```

Testando tratamento de erros:

```js
try {
  await db.Usuario.create({ nome: 'Sem login' }); // login é obrigatório
  expect.fail('Erro esperado de validação não foi lançado');
} catch (error) {
  expect(error.name).to.equal('SequelizeValidationError');
  expect(error.errors[0].message).to.match(/login/);
}
```

🚫 Verificar negações
```js
expect(usuario).to.not.have.property('senha'); // campo não exposto
expect(comentario.texto).to.not.equal('');
```

Verificar listas de objetos

```js
const canais = await db.Canal.findAll();
expect(canais).to.be.an('array').and.to.have.length.greaterThan(0);

canais.forEach(canal => {
  expect(canal).to.have.property('nome');
  expect(canal.genero_tema).to.be.oneOf(['Educação', 'Entretenimento']);
});
```

Exceção Esperada:

```js
try {
  await db.Usuario.create({ nome: 'Sem login' });
  expect.fail('Erro de validação não foi lançado');
} catch (error) {
  expect(error.name).to.equal('SequelizeValidationError');
  expect(error.errors[0].message).to.match(/login/);
}
```
---

## Considerações Finais

* Os testes devem ser executados em um ambiente isolado, geralmente um banco específico de testes (ex: `playlist_test`);
* O uso de `async/await` nos testes é fundamental quando se trabalha com operações assíncronas como é o caso das operações de banco;
* O Sequelize deve estar devidamente configurado no `setup.js` para que os testes funcionem corretamente, conectando-se ao banco de testes e expondo os modelos via `db`.

> Esse padrão de testes é fundamental para garantir que sua aplicação esteja se comportando corretamente durante o desenvolvimento e antes de entrar em produção.

----------------------------------------


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