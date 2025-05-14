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