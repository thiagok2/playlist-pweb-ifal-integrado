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

Usuario.hasMany(Playlist, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });
Playlist.belongsTo(Usuario, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });

Usuario.hasMany(Canal, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });
Canal.belongsTo(Usuario, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });

Usuario.hasMany(Comentario, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });
Comentario.belongsTo(Usuario, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });

Filme.hasMany(Comentario, { foreignKey: 'id_filme', onDelete: 'CASCADE' });
Comentario.belongsTo(Filme, { foreignKey: 'id_filme', onDelete: 'CASCADE' });

Usuario.hasMany(Mensalidade, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });
Mensalidade.belongsTo(Usuario, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });


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