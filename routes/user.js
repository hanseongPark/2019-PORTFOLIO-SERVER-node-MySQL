const express = require('express')

const router = express.Router();

//user.js 는 /user경로로 들어오는 모든 RESTful api 요청을 수행하는 라우터입니다.
//GET:/user 는 클라이언트의 메인페이지에서 사용자가 로그인상태인지 비로그인 상태인지를
//확인할 때 요청합니다. 요청을 받으면 passport의 isAuthenticated()를 이용해 요청자가 
//로그인 상태인지를 판별하며 로그인 상태일 시 user정보를 아닐 시 null값을 보내게 됩니다.
router.get('/', (req, res)=>{
    if(req.isAuthenticated()){
        res.json(req.user)
    }else{
        res.json(null)
    }
});

module.exports = router;