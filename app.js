//app.js는 익스프레스로 만들어진 웹서버입니다. 개발과 배포를 위해
//cookie-parser, morgan, passport, helmet, hpp, redis, sequelize 등
//다양한 의존성 모듈이 사용되었습니다.
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');
const redis = require('redis')

//보안을 위하여 카카오와 네이버 restful api, 데이터베이스 이름, 비밀번호, 세션시크릿옵션,
//redis 포트번호와 호스팅주소, 비밀번호 등 다양한 정보를 .env 파일로 관리하였습니다. 
require('dotenv').config();

//클라이언트에서 오는 ajax요청을 REST api 처리에 따라 자원, 요청 등의 정보로 구성하여 
//라우터를 설정하였습니다.
const workoutRouter = require('./routes/userWorkoutManage')
const calorieRouter = require('./routes/userCalorie');
const dietManageRouter = require('./routes/userDietManage');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');

//MySQL의 연결과 쿼리구문 실행을 위해 프로미스 기반 ORM인 sequelize.js 를 
//사용하였습니다.
const { sequelize } = require('./models');

//헬스 스케쥴러는 단순한 관리 웹 어플리케이션 입니다. 따로 약관이나 회원 주소 등의 정보가 필요하지 않기에
//회원가입을 없애는 대신 카카오, 네이버 등의 로그인 api로 대체하였습니다. api가 필요로하는 인증절차
//를 처리하기 위해 passport를 사용하였습니다.
const passportConfig = require('./passport');

//AWS에서의 배포를 위해 redis 세션관리 db를 사용하였습니다. 직접적으로 redis db에 연결한 것이 아니라,
//redislab에서 제공하는 db 호스팅 서비스를 사용하였습니다.
let RedisStore = require('connect-redis')(session);
let client = redis.createClient({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST
});

//express를 변수 선언하고 시퀄라이즈를 이용해 db와 웹서버를 연결합니다. 패스포트 인증 처리과정을 
//이용하기 위해 패스포트 config 파일을 연결합니다.
const app = express();
sequelize.sync();
passportConfig(passport);

//app의 포트를 환경에 설정된 포트 or 8001번 포트를 설정합니다.
app.set('port', process.env.PORT || 8001);

//만약 노드의 환경변수가 배포를 위해 production 으로 설정되어 있다면 보안 모듈인 helmet과 hpp를 사용하고
//morgan의 설정을 combined로 설정합니다. 배포 환경이 아닐 경우 morgan의 개발환경으로 사용합니다.
if(process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(hpp());
}else{
  app.use(morgan('dev'))
}

//웹서버의 정적파일들의 경로를 설정합니다. build폴더는 create react app으로 만들어진 배포 파일입니다.
//웹서버가 json파일과 url로 넘어오는 prams를 사용할 수 있도록 하였습니다. cookie 정보를 암호화하기 위하여
//secret 코드를 설정하였습니다. 이후 redis 클라이언트가 설정된 포트와 호스팅 주소로 접속할 수 있도록 비밀번호를
//설정하였습니다.
app.use(express.static(path.resolve(__dirname, './build')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
client.auth(process.env.REDIS_PASSWORD, (err, res) => {
  if(err){
      throw err;
    }
  });

//세션정보가 저장되는 옵션 설정입니다. 세션 정보들이 redis 호스팅 db에 저장될 수 있도록 client의
//정보를 RedisStore에 객체 정보로 제공하였습니다.
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  store: new RedisStore({client}),
};

app.use(session(sessionOption));
app.use(flash());
//웹의 세션 정보를 passport 가 사용해 인증과정을 처리할 수 있도록 합니다.
app.use(passport.initialize());
app.use(passport.session());
//클라이언트의 ajax 요청을 다양한 라우터를 이용해 분리해서 처리합니다.
app.use('/user/workout', workoutRouter);
app.use('/user/calorie', calorieRouter);
app.use('/user/dietmanage', dietManageRouter);
app.use('/user', userRouter);
app.use('/auth', authRouter);
//React로 구성된 SPA는 React Router를 이용하여 페이지의 새로고침을 방지하며 렌더링합니다.
//이를 위해 설정되지 않은 주소로 보내지는 요청은 모두 메인페이지가 보여지도록 설정하였습니다.
app.get('*', (req,res) =>{
    res.sendFile(path.resolve(__dirname, "./build/index.html"));
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});
  