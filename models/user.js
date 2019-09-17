//user.js 는 sequelize 를 이용해 user 테이블을 만들고 정의합니다.
//sequelize는 기본적으로 id 값을 자동으로 primaty key로 설정하기에
//id를 제외하고 나머지 컬럼들을 정의하였습니다. email, name, password등의
//기본적인 정보를 저장하고, provider 항목은 소셜 로그인시 로그인 대상자의 프로필
//을 제공자를 저장하는 항목있습니다. snsId 역시 소셜 로그인에서 제공하는 snsId 입니다.
//이후 timestamp를 사용해서 자동적으로 데이터가 만들어진 시간과 수정 시간이 생성되도록
//했고 이후 paranoid 값을 true 로 설정해 deleteAt 시간을 확인할 수 있도록 하였습니다.

module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
      email: {
        type: DataTypes.STRING(40),
        allowNull: true,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      provider: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'local'
      },
      snsId: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    }, {
      timestamps: true,
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci'
    })
  );