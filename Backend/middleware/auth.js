const jwt=require('jsonwebtoken');
const User=require('../models/user.js');
const authenticate=(req,res,next)=>{
try{
   // console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',req.headers.authorization,req.headers.Authorization)
    //const authHearder=req.headers.authorization || req.headers.Authorization;
    const authHearder=req.headers.authorization;
    console.log(authHearder)
    const token= authHearder.split(' ')[1]
    const user=jwt.verify(token,'abc')
   ;
    User.findOne({where:{id:user.userId}}).then(user=>{
        req.user=user;
        next()
    })
}catch(err){ 
    console.log(err);
    res.status(401).json({success:false})}
}
module.exports={authenticate};
    