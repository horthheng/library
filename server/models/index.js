const Sequelize = require("sequelize");
const sequelize = require("../config/db");

// Initialize DB object
const db = {};

// Sequelize instances
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require("./user").default(sequelize, Sequelize.DataTypes);
db.Role = require("./role")(sequelize, Sequelize.DataTypes);
db.Book = require("./book")(sequelize, Sequelize.DataTypes);
db.Category = require("./categories")(sequelize, Sequelize.DataTypes);
db.Author = require("./author")(sequelize, Sequelize.DataTypes);
db.Borrow = require("./borrow")(sequelize, Sequelize.DataTypes);
db.Language = require("./languageBook")(sequelize, Sequelize.DataTypes);
db.Donation = require("./donation")(sequelize, Sequelize.DataTypes);
db.Summary = require("./summary")(sequelize, Sequelize.DataTypes);

//
// ========== ASSOCIATIONS ==========
//

// 2. Role -> Users (One-to-Many as 'roleUsers' to avoid alias conflict)
db.Role.hasMany(db.User, {
  foreignKey: 'roleId',
  as: 'roleUsers', 
});

db.User.belongsTo(db.Role, {
  foreignKey: 'roleId',
  as: 'Role',
});

// 3. Book -> Author
db.Book.belongsTo(db.Author, { foreignKey: 'AuthorId', as: 'author' });
db.Author.hasMany(db.Book, { foreignKey: 'AuthorId' });

// 4. Book -> Category
db.Book.belongsTo(db.Category, { foreignKey: 'CategoryId', as: 'category' });
db.Category.hasMany(db.Book, { foreignKey: 'CategoryId' });

// 5. Book -> Language
db.Book.belongsTo(db.Language, { foreignKey: 'language_id', as: 'language' });
db.Language.hasMany(db.Book, { foreignKey: 'language_id' });

// 6. Borrow -> User (borrower and librarian), Book
db.Borrow.belongsTo(db.User, { as: 'user', foreignKey: 'user_id' });
db.Borrow.belongsTo(db.User, { as: 'librarian', foreignKey: 'librarian_id' });
db.Borrow.belongsTo(db.Book, { as: 'book', foreignKey: 'book_id' });

// 7. User -> Borrow
db.User.hasMany(db.Borrow, { foreignKey: 'user_id' });
db.User.hasMany(db.Borrow, { as: 'librarianBorrows', foreignKey: 'librarian_id' });

// 8. Book -> Borrow
db.Book.hasMany(db.Borrow, { foreignKey: 'book_id' });

// 9. User -> Donation
db.User.hasMany(db.Donation, { foreignKey: 'user_id', as: 'donations' });
db.Donation.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });

module.exports = db;