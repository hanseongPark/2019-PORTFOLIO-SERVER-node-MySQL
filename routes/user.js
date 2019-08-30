const express = require('express')

const router = express.Router();

router.get('/', (req, res)=>{
    if(req.isAuthenticated()){
        res.json(req.user)
    }else{
        res.json(null)
    }
});

module.exports = router;