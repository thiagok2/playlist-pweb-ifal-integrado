# 🎬 API de Filmes - Tutorial

API RESTful para gerenciar filmes com recursos de busca, ordenação e estatísticas.

---

## 📚 Sumário

- [🎬 API de Filmes - Tutorial](#-api-de-filmes---tutorial)
  - [📚 Sumário](#-sumário)
  - [🔍 Buscar por título ou gênero](#-buscar-por-título-ou-gênero)
  - [🎭 Listar por gênero com ordenação](#-listar-por-gênero-com-ordenação)
  - [🆕 Últimos lançamentos](#-últimos-lançamentos)
  - [🌟 Melhores avaliados](#-melhores-avaliados)
  - [📃 Listar todos os filmes](#-listar-todos-os-filmes)
  - [🔎 Buscar por ID](#-buscar-por-id)
  - [➕ Criar novo filme](#-criar-novo-filme)
  - [✏️ Atualizar filme](#️-atualizar-filme)
  - [🗑️ Remover filme](#️-remover-filme)

---

## 🔍 Buscar por título ou gênero

**Rota:** `GET /filmes/search?q=valor`

Busca filmes onde `título` ou `gênero` contenham o texto fornecido (`ILIKE`).

```js
router.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q) return res.status(400).json({ error: 'Parâmetro "q" é obrigatório' });

  try {
    const filmes = await Filme.findAll({
      where: {
        [Op.or]: [
          { titulo: { [Op.iLike]: `%${q}%` } },
          { genero: { [Op.iLike]: `%${q}%` } },
        ],
      },
    });
    res.json(filmes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar filmes', details: err.message });
  }
});
```

---

## 🎭 Listar por gênero com ordenação

**Rota:** `GET /filmes/por-genero/:genero?sort=ano|nota&ordem=asc|desc`

Lista filmes de um determinado gênero com ordenação opcional por ano ou nota.

```js
router.get('/por-genero/:genero', async (req, res) => {
  const { genero } = req.params;
  const { sort, ordem } = req.query;

  const sortField = (sort === 'ano') ? 'ano_lancamento' :
                    (sort === 'nota') ? 'nota_avaliacao' :
                    null;

  const sortOrder = (ordem?.toLowerCase() === 'desc') ? 'DESC' : 'ASC';

  const options = {
    where: {
      genero: { [Op.iLike]: genero },
    },
  };

  if (sortField) {
    options.order = [[sortField, sortOrder]];
  }

  try {
    const filmes = await Filme.findAll(options);
    res.json(filmes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar filmes por gênero', details: err.message });
  }
});
```

---

## 🆕 Últimos lançamentos

**Rota:** `GET /filmes/ultimos-lancamentos`

Retorna os 10 filmes mais recentes, ordenados por ano de lançamento e desempate por `created_at`.

```js
router.get('/ultimos-lancamentos', async (req, res) => {
  try {
    const filmes = await Filme.findAll({
      order: [
        ['ano_lancamento', 'DESC'],
        ['created_at', 'DESC']
      ],
      limit: 10,
    });
    res.json(filmes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar últimos lançamentos', details: err.message });
  }
});
```

---

## 🌟 Melhores avaliados

**Rota:** `GET /filmes/melhores-avaliados`

Retorna os 10 filmes com melhor nota (`nota_avaliacao`), desempate por `created_at`.

```js
router.get('/melhores-avaliados', async (req, res) => {
  try {
    const filmes = await Filme.findAll({
      order: [
        ['nota_avaliacao', 'DESC'],
        ['created_at', 'DESC']
      ],
      limit: 10,
    });
    res.json(filmes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar melhores avaliados', details: err.message });
  }
});
```

---

## 📃 Listar todos os filmes

**Rota:** `GET /filmes?sort=ano|nota&ordem=asc|desc`

Lista todos os filmes com ordenação opcional por ano ou nota.

```js
router.get('/', async (req, res) => {
  const { sort, ordem } = req.query;

  const sortField = (sort === 'ano') ? 'ano_lancamento' :
                    (sort === 'nota') ? 'nota_avaliacao' :
                    null;

  const sortOrder = (ordem?.toLowerCase() === 'desc') ? 'DESC' : 'ASC';

  const options = {};
  if (sortField) {
    options.order = [[sortField, sortOrder]];
  }

  try {
    const filmes = await Filme.findAll(options);
    res.json(filmes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar filmes', details: err.message });
  }
});
```

---

## 🔎 Buscar por ID

**Rota:** `GET /filmes/:id`

```js
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const filme = await Filme.findByPk(id);
  if (!filme) {
    return res.status(404).json({ error: 'Filme não encontrado' });
  }
  res.json(filme);
});
```

---

## ➕ Criar novo filme

**Rota:** `POST /filmes`

```js
router.post('/', async (req, res) => {
  try {
    const filme = await Filme.create(req.body);
    res.status(201).json(filme);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar filme', details: err });
  }
});
```

---

## ✏️ Atualizar filme

**Rota:** `PUT /filmes/:id`

```js
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Filme.update(req.body, { where: { id } });
    if (updated) {
      const updatedFilme = await Filme.findByPk(id);
      return res.json(updatedFilme);
    }
    return res.status(404).json({ error: 'Filme não encontrado' });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar filme', details: err });
  }
});
```

---

## 🗑️ Remover filme

**Rota:** `DELETE /filmes/:id`

```js
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deleted = await Filme.destroy({ where: { id } });
  if (deleted) {
    return res.json({ message: 'Filme removido com sucesso' });
  }
  return res.status(404).json({ error: 'Filme não encontrado' });
});
```
