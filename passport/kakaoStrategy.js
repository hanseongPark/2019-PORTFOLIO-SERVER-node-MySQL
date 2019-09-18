const KakaoStrategy = require('passport-kakao').Strategy;

const { User } = require('../models');

//카카오 로그인 전략을 수행하는 파일입니다. 우선 카카오에서 제공하는 RESTful API를
//clientID에 넣습니다. 이 프로젝트는 깃허브에 올릴 예정이므로 아이디와 비밀번호 유출방지를
//위해 .env를 이용하였습니다.
module.exports = (passport) => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID,
    callbackURL: '/auth/kakao/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    // refreshToken과 accessToken을 이용하여 kakao api에 접속해 인증을 요청합니다. 이후 인증이 성공한다면 사용자의 profile을 callbackURL로 보내줍니다.
    try {
      //우선 snsID를 이용하여 이전 카카오 로그인 등록자인지를 검색합니다.
      const exUser = await User.findOne({ where: { snsId: profile.id, provider: 'kakao' } });
      if (exUser) {
        //만약 이전 로그인기록이 있다면 그 정보를 done함수를 이용해 다음 미들웨어로 전송합니다.
        done(null, exUser);
      } else {
        //만약 이전 로그인 정보가 없다면 카카오에서 제공하는 profile의 정보를 바탕으로 회원가입을 진행합니다.
        const newUser = await User.create({
          email: profile._json && profile._json.kaccount_email,
          name: profile.displayName,
          snsId: profile.id,
          provider: 'kakao',
        });
        done(null, newUser);
      }
    } catch (error) {
      done(error);
    }
  }));
};
