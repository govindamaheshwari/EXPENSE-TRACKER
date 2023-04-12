const User= require('../models/user');
const Expanse = require('../models/expense.js');
const sequelize = require("../util/database.js");
const bcrypt =require('bcrypt');
const path=require('path');
const jwt=require('jsonwebtoken');
exports.register =async (req,res,next)=>{
    console.log('<><>',req.body)
    try{
    const hashedPass=await bcrypt.hash(req.body.password,10);
    let user=await User.findAll({where:{email:req.body.email}})
        if(user[0]){
            res.json({success:false,message:'Useralready exists. please login!'})
        }
        else{
            let result =await User.create({
                name:req.body.name,
                email:req.body.email,
                password:hashedPass,
                hasPremium:false
            })
            {console.log('>>>>',result)};
            res.json({result:result ,success:true,message:'New user successfully added'})
        }
    }catch(err){console.log(err)}
}
exports.login =async (req,res,next)=>{
    console.log('<>--<>',req.body)
    try{
    let user=await User.findAll({where:{email:req.body.email}})
        if(!user[0]){
            res.json({success:false,message:'User doesnot exist'})
        }
        let pass_check=await bcrypt.compare(req.body.password ,user[0].password)
        function generateAccessToken(id,name,premium){
            return jwt.sign({userId:id,name:name,hasPremium:premium},process.env.Token_Secret)
        }
        console.log(pass_check)
            if(!pass_check){
            res.json({success:false,message:'Incorrect password'})
            }
            else{
            res.json({result:user[0],success:true,message:'User login sucessful' ,token:generateAccessToken(user[0].id,user[0].name,user[0].hasPremium)})
            }
        }catch(err){console.log(err)}
}
exports.premiumLeaderboard=async(req,res)=>{

    try {    
        const leaderBoard= await User.findAll({
            attributes:['id','name',[sequelize.fn('sum',sequelize.col('expenses.ammount')),'totalExpense']],
            include:[
                {
                    model:Expanse,
                    attributes:[]
                }
            ],
            group:['users.id'],
            order:[['totalExpense','DESC']]
        })
        return res.json(leaderBoard);        
    } catch (error) {
        res.json(error);
    }

    
}



