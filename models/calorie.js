//calorie.js 는 사용자의 칼로리 데이터를 저장하는 데이터베이스를 정의합니다.
//나이, 체중, 키, 목표 활동량 등을 바탕으로 산출된 사용자의 칼로리, 영양성분을
//저장합니다. timestamp와 paranoid 설정을 통해 데이터의 생성, 수정, 삭제 시간을 알 수 있습니다.

module.exports = (sequelize, DataTypes) => (
    sequelize.define('calorie', {
      age: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      activity: {
        type: DataTypes.FLOAT.UNSIGNED,
        allowNull: false
      },
      weight: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      height: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      calorie: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      carb: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      protein: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      fat: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
      },
      goal: {
          type: DataTypes.STRING(20),
          allowNull: true,
      }
    }, {
      timestamps: true,
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci'
    })
  );