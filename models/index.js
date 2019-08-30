const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Calorie = require('./calorie')(sequelize, Sequelize);
db.Diet = require('./diet')(sequelize,Sequelize);
db.Workout = require('./workout')(sequelize,Sequelize);
db.Chest = require('./chest')(sequelize,Sequelize);
db.Back = require('./back')(sequelize,Sequelize);
db.Shoulder = require('./shoulder')(sequelize,Sequelize);
db.Leg = require('./leg')(sequelize,Sequelize);
db.Core = require('./core')(sequelize,Sequelize);

db.User.hasMany(db.Calorie, {foreignKey: 'user_id', sourceKey: 'id'});
db.Calorie.belongsTo(db.User, {foreignKey: 'user_id', targetKey: 'id'});
db.Diet.belongsTo(db.User,{foreignKey: 'user_id', targetKey: 'id'});
db.Workout.belongsTo(db.User,{foreignKey: 'user_id', targetKey: 'id'});
db.Chest.belongsTo(db.User,{foreignKey: 'user_id', targetKey: 'id'});
db.Back.belongsTo(db.User,{foreignKey: 'user_id', targetKey: 'id'});
db.Shoulder.belongsTo(db.User,{foreignKey: 'user_id', targetKey: 'id'});
db.Leg.belongsTo(db.User,{foreignKey: 'user_id', targetKey: 'id'});
db.Core.belongsTo(db.User,{foreignKey: 'user_id', targetKey: 'id'});

module.exports = db;
