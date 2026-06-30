const { Catalogue, Boutique, Produit } = require('../models');

const getByBoutique = async (req, res, next) => {
  try {
    const catalogues = await Catalogue.findAll({
      where: { idBoutique: req.params.idBoutique },
      include: [{ model: Produit, as: 'produits' }],
    });
    res.json(catalogues);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { nomCatalogue, idBoutique } = req.body;
    if (!nomCatalogue || !idBoutique) {
      return res.status(400).json({ error: 'nomCatalogue et idBoutique sont requis' });
    }
    const boutique = await Boutique.findByPk(idBoutique);
    if (!boutique) return res.status(404).json({ error: 'Boutique introuvable' });
    if (boutique.idCommercant !== req.user.userId) {
      return res.status(403).json({ error: 'Accès interdit' });
    }
    const catalogue = await Catalogue.create({ nomCatalogue, idBoutique });
    res.status(201).json(catalogue);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const catalogue = await Catalogue.findByPk(req.params.id, {
      include: [{ model: Boutique, as: 'boutique' }],
    });
    if (!catalogue) return res.status(404).json({ error: 'Catalogue introuvable' });
    if (catalogue.boutique.idCommercant !== req.user.userId) {
      return res.status(403).json({ error: 'Accès interdit' });
    }
    if (req.body.nomCatalogue) catalogue.nomCatalogue = req.body.nomCatalogue;
    await catalogue.save();
    res.json(catalogue);
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const catalogue = await Catalogue.findByPk(req.params.id, {
      include: [{ model: Boutique, as: 'boutique' }],
    });
    if (!catalogue) return res.status(404).json({ error: 'Catalogue introuvable' });
    if (catalogue.boutique.idCommercant !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès interdit' });
    }
    await catalogue.destroy();
    res.status(204).end();
  } catch (err) { next(err); }
};

module.exports = { getByBoutique, create, update, remove };