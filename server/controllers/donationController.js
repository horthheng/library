const { Donation } = require('../models');

// List all donations
exports.index = async (req, res) => {
  try {
    const donations = await Donation.findAll();

    // Log to help debug
    console.log('Donations found:', donations.length);

    const donationsWithImageUrl = donations.map(donation => {
      const data = donation.toJSON();
      data.cover_image_url = data.cover_image
        ? `${req.protocol}://${req.get('host')}/uploads/donations/${data.cover_image}`
        : null;
      return data;
    });

    res.json({
      message: 'Donations fetched successfully',
      donations: donationsWithImageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donations', error: error.message });
  }
};

// Get single donation by ID
exports.show = async (req, res) => {
  try {
    const donation = await Donation.findByPk(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    const data = donation.toJSON();
    data.cover_image_url = data.cover_image
      ? `${req.protocol}://${req.get('host')}/uploads/donations/${data.cover_image}`
      : null;

    res.json({
      message: 'Donation fetched successfully',
      donation: data,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donation', error: error.message });
  }
};

// Create a new donation
exports.store = async (req, res) => {
  try {
    const {
      title,
      isbn,
      quantity,
      language,
      author,
      user_id,
      available,
    } = req.body;

    if (!quantity) {
      return res.status(400).json({ message: 'Quantity is required.' });
    }

    const cover_image = req.file ? req.file.filename : null;

    const newDonation = await Donation.create({
      title,
      isbn,
      quantity,
      language,
      cover_image,
      author,
      status: 'pending', // default status
      available,
      user_id: user_id || null,
    });

    const data = newDonation.toJSON();
    data.cover_image_url = cover_image
      ? `${req.protocol}://${req.get('host')}/uploads/donations/${cover_image}`
      : null;

    res.status(201).json({
      message: 'Donation created successfully.',
      donation: data,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating donation', error: error.message });
  }
};

// Update donation by ID
exports.update = async (req, res) => {
  try {
    const donationId = req.params.id;
    const {
      title,
      isbn,
      quantity,
      language,
      author,
      available,
      user_id,
    } = req.body;

    const donation = await Donation.findByPk(donationId);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    const cover_image = req.file ? req.file.filename : donation.cover_image;

    await donation.update({
      title,
      isbn,
      quantity,
      language,
      author,
      available,
      user_id,
      cover_image,
    });

    const data = donation.toJSON();
    data.cover_image_url = cover_image
      ? `${req.protocol}://${req.get('host')}/uploads/donations/${cover_image}`
      : null;

    res.json({
      message: 'Donation updated successfully',
      donation: data,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating donation', error: error.message });
  }
};

// Delete donation by ID
exports.destroy = async (req, res) => {
  try {
    const donation = await Donation.findByPk(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    await donation.destroy();
    res.json({ message: 'Donation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting donation', error: error.message });
  }
};
