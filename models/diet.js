module.exports = (sequelize, DataTypes) => (
    sequelize.define('diet', {
      food: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      gram: {
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
      date: {
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