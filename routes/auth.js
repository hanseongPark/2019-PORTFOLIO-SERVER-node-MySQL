const express = require('express');
const passport = require('passport');
const {createTester} = require('./middlewares')

const router = express.Router();

router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.json({"url":"/"});
});

router.post('/login', createTester, passport.authenticate('local', { failureRedirect: '/' }), (req, res)=>{
    res.json(req.user);
})

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

router.get('/naver', passport.authenticate('naver'));

router.get('/naver/callback', passport.authenticate('naver', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;
