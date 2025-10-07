import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export default (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,
    },
    login: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      set(v) { this.setDataValue('login', String(v).trim()); }
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      set(v) { this.setDataValue('nome', String(v).trim()); }
    },
    apelido: {
      type: DataTypes.STRING(100),
      set(v) { this.setDataValue('apelido', String(v).trim()); }
    },
    senha: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '123456',
      validate: {
        len: {
          args: [4, 100],
          msg: 'Senha deve ter ao menos 4 caracteres.'
        }
      }
    },
    data_nascimento: { type: DataTypes.DATEONLY },
    email: {
      type: DataTypes.STRING(100),
      validate: { isEmail: { msg: 'E-mail inválido.' } },
      set(v) { this.setDataValue('email', v ? String(v).trim().toLowerCase() : null); }
    },
    avatarImage: {
      type: DataTypes.STRING(255)
    }
  }, {
    tableName: 'usuarios',
    timestamps: true,

    defaultScope: {
      attributes: { exclude: ['senha'] }
    },

    scopes: {
      withPassword: { attributes: { include: ['senha'] } }
    },

    hooks: {
      async beforeCreate(user) {
        if (user.senha) {
          user.senha = await bcrypt.hash(user.senha, SALT_ROUNDS);
        }
      },
      async beforeUpdate(user) {
        if (user.changed('senha')) {
          user.senha = await bcrypt.hash(user.senha, SALT_ROUNDS);
        }
      },

      // hash em bulkCreate (necessário individualHooks true no controller)
      async beforeBulkCreate(users) {
        for (const u of users) {
          if (u.senha) {
            u.senha = await bcrypt.hash(u.senha, SALT_ROUNDS);
          }
        }
      }
    }
  });

  Usuario.prototype.checkPassword = async function (plain) {
    if (!this.senha) return false;
    return bcrypt.compare(plain, this.senha);
  };

  const _toJSON = Usuario.prototype.toJSON;
  Usuario.prototype.toJSON = function () {
    const values = _toJSON ? _toJSON.call(this) : { ...this.get() };
    delete values.senha;
    return values;
  };

  return Usuario;
};
