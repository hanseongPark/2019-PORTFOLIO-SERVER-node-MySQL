module.exports = (sequelize, DataTypes) => (
    sequelize.define('shoulder', {
      volume: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
      },
      date: {
          type: DataTypes.INTEGER,
          allowNull: false,
      }
    }, {
      timestamps: true,
      paranoid: true,
    })
  );