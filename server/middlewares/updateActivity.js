// middlewares/updateActivity.js
const { User } = require("../models");

module.exports = async (req, res, next) => {
  if (req.userId) {
    await User.update(
      { lastActivityAt: new Date(), status: "active" },
      { where: { id: req.userId } }
    );
  }
  next();
};
