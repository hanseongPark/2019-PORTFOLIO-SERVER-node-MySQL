const express = require('express')

const router = express.Router();
const {Calculrating} = require('./middlewares')
const {Calorie} = require('../models');

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