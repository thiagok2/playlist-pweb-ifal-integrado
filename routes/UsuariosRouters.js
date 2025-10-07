// src/routes/usuariosRoutes.js
import express from 'express';
import { Usuario } from '../models/Index.js';
import { Op } from 'sequelize';
// import { requireAuth } from '../middlewares/requireAuth.js'; // opcional

const router = express.Router();

// router.use(requireAuth); // <- descomente se quiser exigir auth em tudo

/** GET /usuarios/search?q=...&limit=20&offset=0 */
router.get('/search', async (req, res) => {
  const q = String(req.query.q || '').trim();
  const limit = Math.min(parseInt(req.query.limit ?? '20', 10), 100);
  const offset = parseInt(req.query.offset ?? '0', 10);

  if (!q) {
    return res.status(400).json({ error: 'Parâmetro "q" é obrigatório' });
  }

  try {
    const usuarios = await Usuario.findAll({
      where: {
        [Op.or]: [
          { nome:  { [Op.iLike]: `%${q}%` } },
          { login: { [Op.iLike]: `%${q}%` } },
          { email: { [Op.iLike]: `%${q}%` } },
        ],
      },
      attributes: { exclude: ['senha'] },   // reforço
      limit,
      offset,
      order: [['id', 'ASC']],
    });

    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Erro na busca' });
  }
});

/** GET /usuarios/buscar-por-email-ou-login?q=... */
router.get('/buscar-por-email-ou-login', async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) {
    return res.status(400).json({ error: 'Parâmetro "q" é obrigatório' });
  }

  try {
    const usuario = await Usuario.findOne({
      where: { [Op.or]: [ { email: q.toLowerCase() }, { login: q } ] },
      attributes: { exclude: ['senha'] },   // reforço
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Erro na busca' });
  }
});

/** GET /usuarios?limit=20&offset=0 */
router.get('/', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit ?? '50', 10), 200);
  const offset = parseInt(req.query.offset ?? '0', 10);

  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['senha'] },   // reforço
      limit,
      offset,
      order: [['id', 'ASC']],
    });
    res.json(usuarios);
  } catch (err){
    return res.status(500).json({ error: 'Erro ao recuperar usuários' });
  }
});

/** GET /usuarios/:id */
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido' });

    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['senha'] },   // reforço
    });

    if (!usuario) return res.status(404).json({ error: 'Nenhum usuário encontrado' });
    res.json(usuario);
  } catch (err){
    return res.status(500).json({ error: 'Erro ao recuperar usuário' });
  }
});

/** POST /usuarios */
router.post('/', async (req, res) => {
  try {
    // hooks do model farão o hash da senha
    const usuario = await Usuario.create(req.body);
    // defaultScope + toJSON já não expõem 'senha'
    res.status(201).json(usuario);
  } catch (err) {
    // pode adicionar tratamento para unique violation (login/email)
    return res.status(500).json({ error: 'Erro ao salvar usuário' });
  }
});

/** POST /usuarios/batch  (lista de usuários) */
router.post('/batch', async (req, res) => {
  try {
    // importantíssimo: individualHooks para hashear cada senha
    const result = await Usuario.bulkCreate(req.body, { individualHooks: true });
    res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao salvar usuários' });
  }
});

/** PUT /usuarios/:id */
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    // whitelist de campos atualizáveis — evita setar colunas sensíveis
    const {
      login, nome, apelido, senha, data_nascimento, email
    } = req.body;

    const payload = { };
    if (login !== undefined) payload.login = login;
    if (nome !== undefined) payload.nome = nome;
    if (apelido !== undefined) payload.apelido = apelido;
    if (data_nascimento !== undefined) payload.data_nascimento = data_nascimento;
    if (email !== undefined) payload.email = email;

    // apenas se veio senha não vazia; se veio '', ignoramos para não re-hashear vazio
    if (typeof senha === 'string' && senha.trim().length > 0) {
      payload.senha = senha; // hook beforeUpdate fará o hash
    }

    const [updated] = await Usuario.update(payload, {
      where: { id },
      individualHooks: true,  // necessário para o hook de hash
    });

    if (!updated) return res.status(404).json({ error: 'Usuário não encontrado' });

    const updatedUser = await Usuario.findByPk(id, {
      attributes: { exclude: ['senha'] },   // reforço
    });
    return res.json(updatedUser);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

/** DELETE /usuarios/:id */
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const deleted = await Usuario.destroy({ where: { id } });
    if (deleted) return res.json({ message: 'Usuário deletado com sucesso' });
    return res.status(404).json({ error: 'Usuário não encontrado' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

export default router;
