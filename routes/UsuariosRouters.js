import express from 'express';
import { Usuario } from '../models/Index.js';
import { Op }  from 'sequelize';

const router = express.Router();

router.get('/search', async (req, res) => {
  console.log('search')
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Parâmetro "q" é obrigatório' });
  }

  try {
    const usuarios = await Usuario.findAll({
      where: {
        [Op.or]: [
          { nome: { [Op.iLike]: `%${q}%` } },
          { login: { [Op.iLike]: `%${q}%` } },
          { email: { [Op.iLike]: `%${q}%` } },
        ],
      },
    });

    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Error na busca', details: err });
  }
});


router.get('/buscar-por-email-ou-login', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Parâmetro "valor" é obrigatório' });
  }

  try {
    const usuario = await Usuario.findOne({
      where: {
        [Op.or]: [
          { email: q },
          { login: q },
        ],
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Erro na busca', details: err });
  }
});

router.get('/', async (req, res) => {
  console.log('get/')
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (err){
    console.log(err);
    return res.status(500).json({ error: 'Erro recuperar usuários', details: err });
  }
});

router.get('/:id', async (req, res) => {
  console.log('get/:id');
  try {
    const {id} = req.params;
    const usuario = await Usuario.findByPk(id);
    
    if(usuario)
      res.json(usuario);
    else
      res.status(404).json({error: 'Nenhum usuário encontrado'});
  } catch (err){
    return res.status(500).json({ error: 'Erro recuperar usuários', details: err });
  }
});


router.post('/', async (req, res) => {
  try {
    //const usuario = await Usuario.create(req.body);
    
    const usuario = Usuario.build(req.body);
    await usuario.validate();
    await usuario.save();
    
    res.json(usuario);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao salvar usuário', details: err });
  }
    
});

//recebe uma lista de usuários e salva no modo bulk
router.post('/batch', async (req, res) => {
  try {
    const result = await Usuario.bulkCreate(req.body);
    
    res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao salvar usuário', details: err });
  }
    
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Usuario.update(req.body, {
      where: { id },
    });

    if (updated) {
      const updatedUser = await Usuario.findByPk(id);
      return res.json(updatedUser);
    }

    return res.status(404).json({ error: 'Usuário não encontrado' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar usuário', details: err });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Usuario.destroy({
      where: { id },
    });

    if (deleted) {
      return res.json({ message: 'Usuário deletado com sucesso' });
    }

    return res.status(404).json({ error: 'Usuário não encontrado' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao deletar usuário', details: err });
  }
});

export default router;