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