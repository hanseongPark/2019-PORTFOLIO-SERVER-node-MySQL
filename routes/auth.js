const express = require('express');
const passport = require('passport');
const {createTester} = require('./middlewares')

//auth.js 는 /auth경로를 통해 들어오는 요청을 처리해주는 라우터 정보가 담겨있는 파일입니다.

const router = express.Router();

//우선 Get:/logout은 유저가 웹 클라이언트의 로그아웃 버튼을 누를 시 오게 되는 경로입니다.
//passport를 이용해 req.session에 저장되어 있던 유저 정보를 삭제함과 동시에 req.logout()메소드를
//통해 req.user 정보를 삭제합니다. 이후에는 json파일로 url정보를 클라이언트의 axios로 보내 react가
//다시 렌더링 되도록 합니다.
router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.json({"url":"/"});
});

//POST:/login 요청은 사용자가 테스터로그인을 요청했을 때 발생합니다. 우선 createTester 미들웨어를 
//거치며 테스터 정보가 있다면 정보를 불러오고 아니라면 테스터 정보를 생성합니다. 이후 passport 모듈의
//authenticate 메소드를 이용하여 localStrategy 로그인 전략을 수행하게 됩니다. 로그인에 실패할 시 메인화면을
//보여주고 로그인에 성공하면 req.user 정보를 보내 웹 클라이언트가 사용자 정보를 웹에 표시하도록 하였습니다.
router.post('/login', createTester, passport.authenticate('local', { failureRedirect: '/' }), (req, res)=>{
    res.json(req.user);
})

//GET:/kakao 경로는 사용자가 카카오 로그인 버튼을 눌렀을 시 발생합니다. 이후 passport 모듈의 authenticate 메소드를 이용해
//kakaoStrategy 로그인 전략을 수행하게 되며 서버 요청을 GET:/kakao/callback 으로 넘기게 됩니다.
router.get('/kakao', passport.authenticate('kakao'));

//GET:/kakao/callback 를 통해 카카오의 사용자인지 확인하게 되며 성공할 시 메인페이지에 req.user 정보를 보내게 됩니다.
router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

//GET:/naver 경로는 사용자가 네이버 로그인 버튼을 눌렀을 시 발생합니다. 이후 passport 모듈의 authenticate 메소드를 이용해
//naverStrategy 로그인 전략을 수행하게 되며 서버 요청을 GET:/naver/callback 으로 넘기게 됩니다.
router.get('/naver', passport.authenticate('naver'));

//GET:/naver/callback 를 통해 네이버의 사용자인지 확인하게 되며 성공할 시 메인페이지에 req.user 정보를 보내게 됩니다.
router.get('/naver/callback', passport.authenticate('naver', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;
