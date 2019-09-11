const express = require('express');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const router = express.Router();
const {parseWorkoutData, deleteWorkout, parseDate, parseTarget} = require('./middlewares');
const {Workout} = require('../models');

//userWorkoutManage.js 는 유저의 운동정보에 관한 요청을 관리하고 처리하는 라우터들이 모여있습니다.
///user/workout으로 들어오는 모든 ajax요청을 처리하게 됩니다.
//GET:/user/workout 라우터는 유저가 운동 관리 페이지로 이동했을 때 요청됩니다.
//해당 요일의 유저의 모든 운동 정보를 클라이언트에 json형태로 보내게 됩니다.
router.get('/', async(req,res)=>{
    if(req.isAuthenticated()){
        const data = await Workout.findAll({where:{user_id: req.user.id, date: req.query.date}})
        if(data){
            res.json(data)
        }else{
            res.json(null)
        }
    }else{
        res.json(null)
    }
});

//POST:/user/workout 은 유저가 운동관리 폼을 이용해 정보를 추가할 때 발생되는 요청입니다.
//우선 요청된 정보는 3개의 미들웨어를 거칩니다. parseDate 를 통해 날짜를 변환합니다. 변환의 이유는 middlewares에서
//더 자세히 확인할 수 있습니다. 이후 볼륨 정보 저장을 위해 parseTarget 미들웨어를 거치고 parseWorkoutData 에서 
//각 운동을 부위별로 분류하여 각 볼륨데이터베이스에 저장합니다. 이후 남은 정보를 유저 workout 데이터에 저장하고
//저장이 완료되면 json으로 데이터를 보내게 됩니다.
router.post('/', parseDate, parseTarget, parseWorkoutData, async(req,res)=>{
    const save = await Workout.create({
        workname: req.body.workname, 
        target: req.body.target, 
        reps: req.body.reps,
        sets: req.body.sets,
        workweight: req.body.workweight,
        date: req.body.date,
        user_id: req.user.id
    })
    if(save){
        res.json(save)
    }else{
        res.json(null)
    }
});

//DELETE:/user/workout 요청은 사용자가 운동정보 리스트를 삭제하여 데이터의 변화가 일어날 때 발생합니다.
//우선 parseDate, parseTarget 날짜를 변환하고 삭제할 운동리스트의 볼륨을 정합니다. 이후 deleteWorkout에서
//대상 운동리스트를 삭제하고 볼륨리스트 역시 삭제된 리스트에 맞게 변경합니다. 마지막으로는 그 날 변경이
//모두 완료된 모든 데이터를 사용자에게 json 형태로 보내게 됩니다.
router.delete('/', parseDate, parseTarget, deleteWorkout, async(req,res)=>{
    const updateWorkout = await Workout.findAll({where:{user_id: req.user.id, date: req.body.date}})
    res.json(updateWorkout)
});


//POST:/user/workout/chartdata 는 유저의 운동볼륨 차트 정보를 보내는 라우터입니다. 
//우선 parseDate, parseTarget 미들웨어를 거치며 변환된 날짜와 운동 부위를 바탕으로
//데이터베이스에 접근합니다. 이후 기준 날짜와 가장 가까운 10일간의 데이터를 뽑아 사용자에게
//보여주게 됩니다. Sequelize 의 Op연산자를 사용해 기준 날짜보다 작은 숫자의 날짜를 뽑아냈습니다.
router.post('/chartdata', parseDate, parseTarget, async(req,res)=>{
    const data = await req.body.volumeTg.findAll({
        where:{
            user_id: req.user.id,
            date: {
                [Op.lte]: req.body.newDate
            }
        },
        limit: 10,
        attributes:['date', 'volume']
    })
    if(data){
        res.json(data)
    }else{
        res.json(null)
    }

})

module.exports = router;