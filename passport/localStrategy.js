const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')

const {User} = require("../models")

//localStrategy는 passport의 로컬 로그인 전략을 수행하는 파일입니다. 헬스스케쥴러는 단순한
//스케쥴러 웹어플리케이션이기에 따로 회원가입은 없습니다. 하지만 테스터 사용자의 로그인을 위해
//로컬 로그인을 사용하였습니다.

module.exports = (passport) =>{
    //우선 LocalStrategy의 인자로 usernameField에는 req.body.email을 넣고,
    //passwordField에는 req.body.password를 넣습니다. 이후 이메일을 기준으로
    //DB검색을 실행합니다.
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    },async(email, password, done)=>{
        try{
            //만약 있다면 bcrypt 모듈을 사용해 패스워드와 유저의 패스워드를
            //비교합니다. 만약 로그인이 성공한다면 exUser에 유저정보를 담아 다음 미들웨어로 보냅니다.
            const exUser = await User.findOne({where:{email: email}});
            if(exUser){
                const result = await bcrypt.compare(password, exUser.password)
                if(result){
                    done(null, exUser);
                    //다음 미들웨어에서 passport.authenticated가 req.login 메소드를 호출하고 req.login은
                    //passport.serialize 를 호출합니다.
                }
            }else{
                done(null, false, {message: '오류발생'})
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }))
};
