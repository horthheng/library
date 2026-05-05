const { Summary } = require('../models');

exports.index = async (req, res) => {
  try {
    const summaries = await Summary.findAll(); 

    res.json({
      message: 'Summaries fetched successfully',
      summaries: summaries,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching summaries', error: error.message });
  }
};

exports.show = async (req, res) => {
  try {
    const { id } = req.params;   // get id from URL

    const summary = await Summary.findByPk(id);   // find by primary key

    if (!summary) {
      return res.status(404).json({ message: 'Summary not found' });
    }

    res.json({
      message: 'Summary fetched successfully',
      summary: summary,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching summary', error: error.message });
  }
};

// POST /summaries
exports.store = async (req, res) => {
  try {
    const {
      Student_ID,
      Student_Name,
      Student_Class,
      Student_Year,
      Book_Title,
      Book_Label,
      Summary: summaryText
    } = req.body;

    // Insert new summary
    const summary = await Summary.create({
      Student_ID,
      Student_Name,
      Student_Class,
      Student_Year,
      Book_Title,
      Book_Label,
      Summary: summaryText
    });

    res.status(201).json({
      message: 'Summary created successfully',
      summary: summary,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating summary', error: error.message });
  }
};

// PUT /summaries/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      Student_ID,
      Student_Name,
      Student_Class,
      Student_Year,
      Book_Title,
      Book_Label,
      Summary: summaryText
    } = req.body;

    // Find record
    const summary = await Summary.findByPk(id);
    if (!summary) {
      return res.status(404).json({ message: 'Summary not found' });
    }

    // Update record
    await summary.update({
      Student_ID,
      Student_Name,
      Student_Class,
      Student_Year,
      Book_Title,
      Book_Label,
      Summary: summaryText
    });

    res.json({
      message: 'Summary updated successfully',
      summary: summary,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating summary', error: error.message });
  }
};

// DELETE /summaries/:id
exports.destroy = async (req, res) => {
  try {
    const { id } = req.params;

    // Find record
    const summary = await Summary.findByPk(id);
    if (!summary) {
      return res.status(404).json({ message: 'Summary not found' });
    }

    // Delete record
    await summary.destroy();

    res.json({ message: 'Summary deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting summary', error: error.message });
  }
};