const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

//시퀄라이즈를 사용하기 위한 index 설정 파일입니다. 우선 시퀄라이즈 객체에 인자로
//config 파일의 설정을 불러옵니다. 이를 바탕으로 시퀄라이즈 변수를 설정합니다. config파일은
//개발, 배포, 테스트로 설정이 나뉘어져있으며 process.env.NODE_ENV에 따라 개발과 배포 모드가
//결정됩니다.
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

//이후 db 객체에 시퀄라이즈 변수를 추가해줍니다.
db.sequelize = sequelize;
db.Sequelize = Sequelize;

//User, Calorie, Diet, Workout 데이터베이스와 각 부위별 볼륨 데이터베이스를
//db 객체에 추가해줍니다.
db.User = require('./user')(sequelize, Sequelize);
db.Calorie = require('./calorie')(sequelize, Sequelize);
db.Diet = require('./diet')(sequelize,Sequelize);
db.Workout = require('./workout')(sequelize,Sequelize);
db.Chest = require('./chest')(sequelize,Sequelize);
db.Back = require('./back')(sequelize,Sequelize);
db.Shoulder = require('./shoulder')(sequelize,Sequelize);
db.Leg = require('./leg')(sequelize,Sequelize);
db.Core = require('./core')(sequelize,Sequelize);

//다음은 데이터베이스들간의 관계설정입니다. User 데이터베이스를 제외한 나머지
//데이터베이스는 User의 id를 외래키로 갖습니다. hasMany와 belongTo를 사용하여
//데이터베이스들 간의 관계를 설정해줍니다.
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
