const express = require('express')

const router = express.Router();
const {parseDietData} = require('./middlewares')
const {Diet} = require('../models');

//userDietManage.js는 user/dietmanage/로 들어오는 모든 ajax요청을 처리하기 위한 라우터입니다.
//GET:/user/dietmanage 요청이 들어올 시 우선 passport 의 isAuthenticated() 메소드가 req 의
//로그인 여부를 판단합니다. 이후 로그인 상태일 시에는 req.user 객체의 아이디와 클라이언트에서 보내온
//prams date를 바탕으로 식단 정보를 찾습니다. 만약 식단 정보가 있다면 data를 보내고 없다면
//null값을 보내게 됩니다.
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

//POST:/user/dietmanage 요청은 사용자가 식단을 추가할 때의 요청을 처리하는 라우터입니다. 
//우선 parseDietData 미들웨어를 통과하며 식단의 데이터들을 DB에 저장하기 적합한 자료형태로
//변환합니다. 이후 req.body의 정보들을 그대로 저장한 후 저장이 완료되었다면 정보를 다시
//json의 형태로 클라이언트에 보냅니다.
router.post('/', parseDietData, async(req,res)=>{
    const save = await Diet.create(req.body)
    if(save){
        res.json(save);
    }
})

//POST:/user/dietmanage/time 은 유저가 클라이언트의 식단관리 중 하나를 클릭했을 때의 요청을
//처리하는 라우터입니다. 우선 사용자의 아이디와 날짜 , 그리고 조회하기 원하는 식단리스트의 시간대를
//바탕으로 DB를 검색합니다. 이후에 data가 있다면 그 값을 json 형태로 보내고, data가 없다면 null값을
//반환합니다.
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

//DELETE:/user/dietmanage 요청은 유저가 식단관리 리스트를 삭제할 때 처리합니다. 먼저 유저의 id와 날짜를
//요소로 데이터를 지웁니다. 이후 data를 성공적으로 지웠다면 다시 그날의 식단리스트를 다 찾은 후에
//클라이언트로 보내어 식단 리스트를 갱신하도록 만듭니다.
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