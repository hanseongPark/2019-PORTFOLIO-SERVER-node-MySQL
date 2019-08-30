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

require('dotenv').config();

const workoutRouter = require('./routes/userWorkoutManage')
const calorieRouter = require('./routes/userCalorie');
const dietManageRouter = require('./routes/userDietManage');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

let RedisStore = require('connect-redis')(session);
let client = redis.createClient({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST
});

const app = express();
sequelize.sync();
passportConfig(passport);

app.set('port', process.env.PORT || 8001);

if(process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(hpp());
}else{
  app.use(morgan('dev'))
}

app.use(express.static(path.resolve(__dirname, './build')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
client.auth(process.env.REDIS_PASSWORD, (err, res) => {
  if(err){
      throw err;
    }
  });
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
app.use(passport.initialize());
app.use(passport.session());

app.use('/user/workout', workoutRouter);
app.use('/user/calorie', calorieRouter);
app.use('/user/dietmanage', dietManageRouter);
app.use('/user', userRouter);
app.use('/auth', authRouter);

app.get('*', (req,res) =>{
    res.sendFile(path.resolve(__dirname, "./build/index.html"));
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});
  