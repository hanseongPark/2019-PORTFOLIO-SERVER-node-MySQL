const express = require('express')

const router = express.Router();
const {Calculrating} = require('./middlewares')
const {Calorie} = require('../models');

//userCalorie.js 는 /user/calorie 주소로 들어오는 모든 요청을 처리하는 라우터들이 모여있는
//파일입니다. 우선 유저의 로그인 상태를 passport의 isAuthenticated를 이용해 확인하고
//req.user에 있는 id 정보를 바탕으로 Calorie 정보를 찾습니다. 이후 정보가 있다면 그 정보를
//클라이언트로 보내고 정보가 없다면 null값을 반환합니다.
router.get('/', async(req,res)=>{
    if(req.isAuthenticated()){
        const user = await Calorie.findOne({where:{user_id: req.user.id}})
        if(user){
            res.json(user)
        }else{
            res.json(null)
        }
    }else{
        res.json(null)
    }
})

//POST:/user/calorie 요청은 유저가 클라이언트에서 칼로리 계산기의 계산하기 버튼을 눌렀을 때 발생합니다. req.body에
//저장되어 있는 다양한 정보를 Calculrating 미들웨어를 통해 데이터를 변환합니다. 이후
//기존의 유저 영양소 정보를 찾아내어 다시 계산한 정보로 업데이트하여 저장하고 그 정보를 다시 클라이언트로 보내
//도넛 그래프가 표시될 수 있도록 합니다.
router.post('/', Calculrating, async(req,res)=>{
    const user = req.body

    let exUser = await Calorie.findOne({where: {user_id: user.user_id}})
    if(exUser){
        Calorie.update({
                age:user.age,
                gender: user.gender,
                activity: user.activity,
                goal: user.goal,
                weight: user.weight,
                height: user.height,
                calorie: user.calorie,
                carb: user.carb,
                protein: user.protein,
                fat: user.fat
            },{
                where: {
                    user_id: user.user_id,
                }
        })
    }else{
        Calorie.create(user)
    }
    res.json(user)
})

module.exports = router;