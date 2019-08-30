const express = require('express')

const router = express.Router();
const {parseDietData} = require('./middlewares')
const {Diet} = require('../models');

router.get('/', async(req,res)=>{
    if(req.isAuthenticated()){
        const data = await Diet.findAll({where:{user_id: req.user.id, date: req.query.date}})
        if(data){
            res.json(data)
        }else{
            res.json(null)
        }
    }else{
        res.json(null)
    }
})

router.post('/', parseDietData, async(req,res)=>{
    const save = await Diet.create(req.body)
    if(save){
        const saveData = await Diet.findOne({where: req.body})
        res.json(saveData);
    }
    
})

router.post('/time', async(req,res)=>{
    const data = await Diet.findAll({
        where:{
            user_id: req.user.id,
            date: req.body.date,
            time: req.body.time
        }
    })
    if(data){
        res.json(data);
    }else{
        res.json(null)
    }
    
})

router.delete('/', async(req,res)=>{
    const data = await Diet.destroy({where:{id: req.body.id, date: req.body.date}})
    if(data){
        const success = await Diet.findAll({where:{user_id: req.user.id, date:req.body.date}})
        res.json(success)
    }else{
        res.json(null)
    }
})

module.exports = router;