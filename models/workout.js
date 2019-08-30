module.exports = (sequelize, DataTypes) => (
    sequelize.define('workout', {
      workname: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      target: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      reps: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      sets: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      workweight: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
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