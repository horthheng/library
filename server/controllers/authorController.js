const { Author } = require('../models');

// Create a new author
exports.store = async (req, res) => {
    try {
        const { name, nationality } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        const author = await Author.create({ name, nationality });
        res.status(201).json(author);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all authors
exports.index = async (req, res) => {
    try {
        const authors = await Author.findAll({ attributes: ['id', 'name', 'nationality'] });
        res.json(authors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single author by id
exports.show = async (req, res) => {
    try {
        const author = await Author.findByPk(req.params.id, { attributes: ['id', 'name', 'nationality'] });
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        res.json(author);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an author
exports.update = async (req, res) => {
    try {
        const { name, nationality } = req.body;
        const author = await Author.findByPk(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        if (name !== undefined) author.name = name;
        if (nationality !== undefined) author.nationality = nationality;
        await author.save();
        res.json(author);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an author
// Delete an author
exports.destroy = async (req, res) => {
    try {
        const author = await Author.findByPk(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        await author.destroy();
        res.json({ message: 'Author deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};