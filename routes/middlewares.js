const {  User, Chest, Back, Core, Shoulder, Leg, Workout } = require('../models');
const bcrypt = require('bcrypt');

//이 파일에는 클라이언트와 서버간의 원활한 자료교환을 위해 만들어진 다양한 미들웨어가 존재합니다.
//createTester미들웨어는 테스터 사용자들을 위한 미들웨어 입니다. 클라이언트의 ajax 요청 req.body에는
//테스터 사용자의 비밀번호가 있습니다. 비밀번호는 bcrypt 패키지를 이용해 12번 해쉬화 한 후 데이터베이스에
//저장됩니다. 이때 User 데이터베이스에 사용자 정보가 존재하며 다음 미들웨어를 호출하고 아니하면 새로운 사용자를
//만든 후 다음 미들웨어를 호출하도록 하였습니다.
exports.createTester = async(req, res, next) =>{
    const hash = await bcrypt.hash(req.body.password, 12);
    const user = await User.findOne({where: {
        email: req.body.email
    }})
    if(user){
        next()
    }else{
        User.create({
            email: req.body.email,
            password: hash,
            name: '사용자'
        })
        next()
    }
}

//Calculrating 미들웨어는 사용자의 나이, 체중, 키, 목표 등 다양한 정보를 클라이언트로부터 받습니다. 이 정보를 바탕으로
//사용자의 칼로리 정보, 목표 등을 데이터베이스에 저장할 수 있도록 자료형을 변환합니다.

exports.Calculrating = (req,res,next)=>{
    const user = req.body
    req.body.user_id = req.user.id

    let calorie;
    let protein;
    let fat;
    let carb;
    
    switch (user.goal) {
        case "다이어트":
            if(user.gender==="male"){
                calorie = ((10*user.weight)+(6.25*user.height)-(5*(user.age*1+5)))*user.activity-500
            }else{
                calorie=((10*user.weight)+(6.25*user.height)-5*user.age-161)*user.activity-500
            }
            protein = user.weight*2.204623*1
            fat= user.weight*2.204623*0.25
            carb=(calorie-protein*4-fat*9)/4
    
            break;
    
        case "체중유지":
            if(user.gender==="male"){
                calorie = ((10*user.weight)+(6.25*user.height)-(5*(user.age*1+5)))*user.activity
            }else{
                calorie=((10*user.weight)+(6.25*user.height)-5*user.age-161)*user.activity
            }
            protein = user.weight*2.204623*1.1
            fat= user.weight*2.204623*0.35
            carb=(calorie-protein*4-fat*9)/4
    
            break;
    
        case "체중증가":
            if(user.gender==="male"){
                calorie = ((10*user.weight)+(6.25*user.height)-(5*(user.age*1+5)))*user.activity*1.1
            }else{
                calorie=((10*user.weight)+(6.25*user.height)-5*user.age-161)*user.activity*1.1
            }
            protein = user.weight*2.204623*1.2
            fat= user.weight*2.204623*0.35
            carb=(calorie-protein*4-fat*9)/4
    
            break;
    }
    user.calorie=calorie.toFixed(0)
    user.carb=carb.toFixed(0)
    user.protein=protein.toFixed(0)
    user.fat=parseInt(fat)
    user.age=parseInt(user.age)
    user.weight=parseInt(user.weight)
    user.height=parseInt(user.height)
    user.activity=parseFloat(user.activity)

    next();
}

//parseDietData 미들웨어 역시 클라이언트의 식단관리 페이지에서 들어오는 사용자의
//식단 관리 정보를 데이터베이스에 저장할 수 있도록 자료형 변환을 해줍니다.
exports.parseDietData = (req,res,next)=>{
    const data = req.body
    data.user_id=req.user.id
    data.gram=parseInt(data.gram)
    data.calorie=parseInt(data.calorie)
    data.carb=parseInt(data.carb)
    data.protein=parseInt(data.protein)
    data.fat=parseInt(data.fat)
    next();
}

//parseWorkoutData 미들웨어는 데이터베이스 자료저장을 위한 형변환과 더불어 한가지 기능이
//더 있습니다. 사용자의 운동정보를 취합에 당일의 볼륨을 저장하는 것입니다. 사용자가 운동 정보를
//저장하게 되면 타겟 부위의 운동 정보의 볼륨을 정합니다. 볼륨은 무게와 반복 수, 셋트를 곱해서 구하며
//이렇게 구해진 볼륨은 운동 부위별 볼륨 데이터베이스에 유저 id를 외래키로 저장됩니다. 만약 사용자가 이전에
//이미 저장해놓은 데이터가 있다면 새로 들어오는 볼륨을 이전 볼륨에 더해 다시 저장하며, 이전 볼륨 데이터가
//없다면 새로 만들어서 저장하게 됩니다.
exports.parseWorkoutData = async (req, res, next)=>{
    const data = req.body
    data.user_id=req.user.id
    data.sets=parseInt(data.sets)
    data.reps=parseInt(data.reps)
    data.workweight=parseInt(data.workweight)
    data.user_id=req.user.id

    var volume = data.sets*data.reps*data.workweight

    const exVolume = await req.body.volumeTg.findOne({where:{user_id: req.user.id, date: req.body.newDate}})

    if(exVolume){
        const newVolume = exVolume.get('volume')+volume
        req.body.volumeTg.update({
            volume: newVolume,
          }, {
            where: {
                user_id: req.user.id, 
                date: req.body.newDate,
                }
          })
    }else{
        req.body.volumeTg.create({volume: volume, date: req.body.newDate, user_id: req.user.id})
    }

    next();
}

//parseDate 미들웨어는 날짜를 변환해주는 미들웨어입니다. 일반적인 정보들의 날짜는 toLocalDateString()을 통해
//yyyy. mm. dd. 의 형식으로 저장하였습니다. 하지만 볼륨 데이터는 사용자가 볼륨차트를 확인할 시 가장 최근의 데이터를
//10개 선별해서 보내줘야 합니다. 이때 기준 날짜와 최근 날짜의 비교를 위하여 날짜 데이터를 yyyymmdd의 형식으로 숫자로
//저장하여 비교를 원활히 할 수 있도록 하였습니다.
exports.parseDate=(req,res,next)=>{
    let y = req.body.date.split(' ')[0].slice(0,-1)
    let m = req.body.date.split(' ')[1].slice(0,-1)
    let d = req.body.date.split(' ')[2].slice(0,-1)
    if(parseInt(m)<10){
        m = '0'.concat(req.body.date.split(' ')[1].slice(0,-1))
    }
    if(parseInt(d)<10){
        d = '0'.concat(req.body.date.split(' ')[2].slice(0,-1))
    }
    req.body.newDate=y.concat(m, d)
    next();
}

//사용자가 운동 관리 정보를 삭제, 수정 등의 변경을 할 시에는 단순히 운동관리 데이터뿐만
//아니라 그와 연관된 각 부위의 볼륨 데이터 역시 변경해야합니다. 이를 위해 클라이언트로부터
//운동관리 정보 삭제 요청이 들어오게 되면 deleteWorkout 미들웨어를 거치게 됩니다. 이 미들웨어는
//사용자의 운동 정보를 destroy 하고 다시 그날의 운동 정보를 불러와 볼륨을 계산합니다. 이후
//새로 계산된 볼륨을 수정하여 저장하게 됩니다.
exports.deleteWorkout=async(req,res,next)=>{

    const data = await Workout.destroy({where:{id: req.body.id, date: req.body.date}})

    if(data){
        const callData = await Workout.findAll({
            where:{user_id: req.user.id, date: req.body.date, target:req.body.target},
            attributes:['workweight', 'reps', 'sets' ]
        })
        req.body.srcData = JSON.stringify(callData)
    }

    const srcData=JSON.parse(req.body.srcData)

    let newVolume=0;

    srcData.forEach(element => {
        return newVolume += element.workweight*element.sets*element.reps
    });

    req.body.volumeTg.update({
         volume: newVolume,
       }, {
         where: {
             user_id: req.user.id, 
             date: req.body.newDate,
             }
       })

    next();
}

//parseTarget 미들웨어는 사용자의 운동 정보를 통해 계산된 볼륨이 어느
//볼륨 데이터베이스에 저장될지를 분류해줍니다. 데이터느 req.body의 volumeTg에
//저장되어 다음 미들웨어에서 사용됩니다.
exports.parseTarget = (req, res, next)=>{
    switch(req.body.target){
        case '가슴': 
            req.body.volumeTg = Chest
            break;
        case '등':
            req.body.volumeTg = Back  
            break;
        case '어깨':
            req.body.volumeTg = Shoulder
            break;
        case '하체':
            req.body.volumeTg = Leg
            break;
        case '코어':
            req.body.volumeTg = Core
            break;
    }
    next();
}