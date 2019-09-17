//shoulder.js 는 사용자의 어깨 운동 볼륨을 저장하는 데이터베이스입니다. 
//날짜를 기준으로 총 운동 볼륨 정보를 저장합니다. timestamp와
//paranoid 설정을 통해 데이터의 생성, 수정, 삭제 시간을 알 수 있습니다.

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