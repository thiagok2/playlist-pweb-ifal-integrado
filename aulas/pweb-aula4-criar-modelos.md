1. Criar models da playlist
Vejam o código no github

Em um projeto JS, usando node, banco postgresql, com a lib sequelize. Estou usando, no package.json a propriedade "type": "module".

Tendo eu uma pasta models, analise o arquivo sql anexado e vamos criar todos os arquivos model de mapeamento usando sequelize. Sugiro que haja um arquivo Index.js que ele defina todos os relacionamentos e exporte os Models definitivos.


---------

Veja como ele vai ficar a organização.

seu-projeto-playlist/
├── config/
│   └── database.js
├── models/
│   ├── Usuario.js
│   ├── Filme.js  /*Criar depois*/
│   ├── Canal.js /*Criar depois*/
│   ├── CanalFilme.js /*Criar depois*/
│   ├── Playlist.js /*Criar depois*/
│   └── Comentario.js /*Criar depois*/
│   └── Mensalidade.js /*Criar depois*/
├── .env
├── index.js
└── package.json


Um exemplo de model:

models/Usuario.js

```js
	import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    login: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    data_nascimento: {
      type: DataTypes.DATEONLY
    },
    email: {
      type: DataTypes.STRING(100)
    }
  }, {
    tableName: 'usuarios',
    timestamps: false,
  });

  return Usuario;
};
```


Vamos ao exemplo de filme a seguir. Observe que além dos novos tipo, como o DECIMAL(10,2), novos atributos como defaultValue e validade(min, max). O sequelize tem uma série de recursos e vale muito a pena se apronfundar sobre os recursos sequelize.

```js
import { DataTypes, Sequelize } from 'sequelize';

export default (sequelize) => {
  const Filme = sequelize.define('Filme', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    genero: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    duracao: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ano_lancamento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nota_avaliacao: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        min: 0,
        max: 10,
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
    }
    
  }, {
    tableName: 'filmes',
    timestamps: false,
  });

  return Filme;
};

```

O próximo model é o Playlist. No nosso modelo de dados, um indivíduo pode possuir várias playlist 

```js
```
Veja o arquivo Index.js

```js Index.js
import sequelize from './../config/database.js';
import UsuarioModel from './Usuario.js';
import FilmeModel from './Filme.js';
import CanalModel from './Canal.js';
import CanalFilmeModel from './CanalFilme.js';
import PlaylistModel from './Playlist.js';
import PlaylistFilmeModel from './PlaylistFilme.js';
import ComentarioModel from './Comentario.js';
import MensalidadeModel from './Mensalidade.js';

const Mensalidade = MensalidadeModel(sequelize);
const Usuario = UsuarioModel(sequelize);
const Filme = FilmeModel(sequelize);
const Canal = CanalModel(sequelize);
const CanalFilme = CanalFilmeModel(sequelize);
const Playlist = PlaylistModel(sequelize);
const PlaylistFilme = PlaylistFilmeModel(sequelize);
const Comentario = ComentarioModel(sequelize);

// RELACIONAMENTOS
Canal.belongsToMany(Filme, {
  through: CanalFilme,
  foreignKey: 'id_canal',
});
Filme.belongsToMany(Canal, {
  through: CanalFilme,
  foreignKey: 'id_filme',
});

Usuario.hasMany(Playlist, { foreignKey: 'id_usuario' });
Playlist.belongsTo(Usuario, { foreignKey: 'id_usuario' });

Usuario.hasMany(Comentario, { foreignKey: 'id_usuario' });
Comentario.belongsTo(Usuario, { foreignKey: 'id_usuario' });

Filme.hasMany(Comentario, { foreignKey: 'id_filme' });
Comentario.belongsTo(Filme, { foreignKey: 'id_filme' });

Usuario.hasMany(Mensalidade, { foreignKey: 'id_usuario' });
Mensalidade.belongsTo(Usuario, { foreignKey: 'id_usuario' });


Playlist.belongsToMany(Filme, {
  through: PlaylistFilme,
  foreignKey: 'id_playlist',
  otherKey: 'id_filme',
  as: 'filmes',
});

Filme.belongsToMany(Playlist, {
  through: PlaylistFilme,
  foreignKey: 'id_filme',
  otherKey: 'id_playlist',
  as: 'playlists',
});


Playlist.hasMany(PlaylistFilme, { foreignKey: 'id_playlist' });
PlaylistFilme.belongsTo(Playlist, { foreignKey: 'id_playlist' });

Filme.hasMany(PlaylistFilme, { foreignKey: 'id_filme' });
PlaylistFilme.belongsTo(Filme, { foreignKey: 'id_filme' });


export {
  sequelize,
  Usuario,
  Filme,
  Canal,
  CanalFilme,
  Playlist,
  Comentario,
  Mensalidade,
  PlaylistFilme
};
```


O arquivo server.js

```js
// server.js (ou outro nome que você preferir)
import { sequelize, Usuario, Filme, Canal, CanalFilme, Playlist, Comentario } from './models/Index.js';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');

    await sequelize.sync({ alter: true }); // Isso agora criará TODAS as tabelas com base em todos os modelos importados e relacionados
    console.log('✅ Tabelas sincronizadas com sucesso.');

    // Exemplo de uso:
    const novoUsuario = await Usuario.create({
      login: 'gabriel4.ribeiro',
      nome: 'Gabriel3 Ribeiro',
    });

    const usuarios = await Usuario.findAll();
    console.log(`Total de usuários: ${usuarios.length}`);
  } catch (error) {
    console.error('❌ Erro ao conectar ou sincronizar o banco de dados:', error);
  } finally {
    await sequelize.close();
  }
})();

```