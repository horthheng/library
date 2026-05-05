const { Language } = require('../models');

exports.index = async (req, res) => {
  try {
    const languages = await Language.findAll();
    res.json(languages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch languages.' });
  }
};

exports.store = async (req, res) => {
  const { name, country } = req.body;
  if (!name) return res.status(400).json({ message: 'Language name is required.' });

  try {
    // Check if language with same name already exists
    const existingLanguage = await Language.findOne({
      where: { name },
    });

    if (existingLanguage) {
      return res.status(409).json({ message: 'Language with this name already exists.' });
    }

    // Create new language
    const language = await Language.create({ name, country: country || null });
    res.status(201).json(language);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create language.' });
  }
};

exports.update = async (req, res) => {
  const language = await Language.findByPk(req.params.id);
  if (!language) return res.status(404).json({ message: 'Language not found.' });

  try {
    await language.update({
      name: req.body.name || language.name,
      country: req.body.country !== undefined ? req.body.country : language.country,
    });
    res.json(language);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update language.' });
  }
};

exports.destroy = async (req, res) => {
  const language = await Language.findByPk(req.params.id);
  if (!language) return res.status(404).json({ message: 'Language not found.' });

  try {
    await language.destroy();
    res.json({ message: 'Language deleted.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete language.' });
  }
};