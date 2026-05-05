const { Category, Book, Sequelize } = require('../models');

exports.index = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("Books.id")), "qty"]
        ]
      },
      include: [
        {
          model: Book,
          attributes: []
        }
      ],
      group: ['Category.id']
    });

    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.show = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { id: req.params.id },
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("Books.id")), "qty"]
        ]
      },
      include: [
        {
          model: Book,
          attributes: [],
        }
      ],
      group: ['Category.id']
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.store = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({
      message: 'Both name and description are required.',
    });
  }

  const existingCategory = await Category.findOne({ where: { name } });

  if (existingCategory) {
    return res.status(409).json({
      message: 'A category with this name already exists.',
    });
  }

  const newCategory = await Category.create({ name, description });
  return res.status(201).json(newCategory);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findByPk(id);
  if (!category) return res.status(404).json({ message: 'category not found' });

  const { name, description } = req.body;
  await category.update({ name, description });
  res.json(category);
};

exports.destroy = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findByPk(id);
  if (!category) return res.status(404).json({ message: 'category not found' });

  await category.destroy();
  res.json({ message: 'category deleted successfully' });
};
