const express=require('express');
const router=express.Router();
const {requireSignin,isAuth,isAdmin}=require('../Controllers/auth');
const {UserById}=require('../Controllers/user');

router.get('/secret/:userId',requireSignin,isAuth,isAdmin,(req,res)=>{
    res.json({
        user : req.profile
    })
})
router.param('userId',UserById);

module.exports=router;