const {  User, Chest, Back, Core, Shoulder, Leg, Workout } = require('../models');
const bcrypt = require('bcrypt');

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
            protein = user.weight*2.204623*1.2
            fat= user.weight*2.204623*0.25
            carb=(calorie-protein*4-fat*9)/4
    
            break;
    
        case "체중유지":
            if(user.gender==="male"){
                calorie = ((10*user.weight)+(6.25*user.height)-(5*(user.age*1+5)))*user.activity
            }else{
                calorie=((10*user.weight)+(6.25*user.height)-5*user.age-161)*user.activity
            }
            protein = user.weight*2.204623*1.2
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