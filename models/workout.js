//workout.js는 사용자의 운동관리 데이터베이스를 설정합니다. 날짜, 운동 이름, 부위
//반복 수, 세트 수, 무게를 컬럼값으로 설정하고, timestamp와 paranoid 설정을 추가하여
//생성, 수정, 삭제 시간을 파악할 수 있도록 하였습니다.

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