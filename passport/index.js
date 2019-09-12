const kakao = require('./kakaoStrategy');
const naver = require('./naverStrategy');
const local = require('./localStrategy');
const { User } = require('../models');
//passport/index.js 는 passport의 모듈 파일입니다. passport.serializeUser 는 req.session 객체에
//저장할 데이터를 선택합니다. done 함수의 첫번째 인자는 에러가 발생시 사용됩니다. 우선 넘어온 user를 매개변수로
//받아 done 함수의 두번째 인자를 user.id를 통해 session에 user의 id 정보만 저장하라고 명령합니다.
module.exports = (passport) => {
    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });
//deserializeUser는 매 서버 요청시 발생합니다. passport.session 미들웨어가 이 메소드를 호출합니다.
//serializeUser가 세션에 저장했던 id를 바탕으로 User데이터 베이스에서 검색한후 user정보를 조회합니다.
//이후 이 정보를 req.user에 저장하게 되므로 라우터에서 req.user 를 통해 사용자의 name, id 등의 정보에
//접근할 수 있습니다. 이 두 가지 메소드는 세션에 필요한 데이터만을 저장하고 불필요한 정보를 담지 않기 위함입니다.
    passport.deserializeUser((id, done)=>{
        User.findOne({where: {id}})
        .then(user => done(null, user))
        .catch(err=> done(err));
    });

    //local, kakao, naver는 각각의 로그인전략을 passport 에 추가해줍니다.
    local(passport);
    kakao(passport);
    naver(passport);
};