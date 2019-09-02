const express = require('express');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const router = express.Router();
const {parseWorkoutData, deleteWorkout, parseDate, parseTarget} = require('./middlewares');
const {Workout} = require('../models');

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
        const saveData = await Workout.findOne({where: {            
            workname: req.body.workname, 
            target: req.body.target, 
            reps: req.body.reps,
            sets: req.body.sets,
            workweight: req.body.workweight,
            date: req.body.date,
            user_id: req.user.id            
        }})
        res.json(saveData)
    }else{
        res.json(null)
    }
});

router.delete('/', parseDate, parseTarget, deleteWorkout, async(req,res)=>{
    const updateWorkout = await Workout.findAll({where:{user_id: req.user.id, date: req.body.date}})
    res.json(updateWorkout)
});

router.post('/target', async(req,res)=>{
    const data = await Workout.findAll({
        where:{
            user_id: req.user.id,
            date: req.body.date,
            target: req.body.target
        }
    })
    if(data){
        res.json(data);
    }else{
        res.json(null)
    }
    
})

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