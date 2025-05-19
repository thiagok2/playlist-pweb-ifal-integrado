1. Recriar o projeto seguindo os roteiros. Usar como REFERÊNCIA o código do github(https://github.com/thiagok2/playlist-pweb-ifal-integrado/);
2. Atenção as conexões, as configurações no .env para o seu banco.
   1. Criar banco de testes postgresql. No código, a referência está como playlist_test
   2. Atualizar o arquivo database.js para ter a configuração do ambiente de testes.
3. Atenção a definição dos models para ficar em conformidade com o arquivo Index.js
   1. Nomeclatura (Ex.: Playlist.js). Observar caixa alta no nome do arquivo
   2. Garantir os models sendo criado no mesmo padrão. Consultar o projeto no github
   3. Na criação nos testes, verificar as configurações 
      1. Atenção a definir a tag script no package.json
        ```
          "scripts": {
            "start": "node server.js",
            "test": "NODE_ENV=test mocha tests/**/*.test.js --exit"
          }
        ```
      2. Atenção a ter também a configuração "type": "module", no package.json 