const Razorpay=require('razorpay');
const Order=require('../models/orders.js');
const jwt=require('jsonwebtoken');
require('dotenv').config()

exports.purchasePremium=(req,res,next)=>{
    try {
        var  rzp = new Razorpay({ 
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET      
        
        })
        console.log("<<<<",rzp.key_id)
        var options = {
            amount: 500, 
            currency: "INR"
          };
    
    rzp.orders.create(options,(err,order)=>{
        if(err){
            throw new Error(JSON.stringify(err))
        }
        console.log(order);
        req.user.createOrder({
            orderId:order.id,Status:"pending"
        }).then(result=>{
            console.log(result);
            res.status(201).json({order,key_id:rzp.key_id})
        }).catch(err=>{
            console.log(err);
        })})
    }catch(err){console.log(err);res.json({message:"something went wrong"})}   
}
exports.updateTransaction=(req,res,next)=>{
    console.log('status',req.body);
    console.log(req.user);
req.user.getOrders({where:{orderId:req.body.orderId}}).then(
    orders=>{
        function generateAccessToken(id,name,premium){
            return jwt.sign({userId:id,name:name,hasPremium:premium},'123456781234567')}
         console.log(orders);
        orders[0].Status="successful"
        orders[0].paymentId=req.body.paymentId
        req.user.hasPremium=true
        req.user.save()
        orders[0].save();
        res.json({result:orders[0],success:true,token:generateAccessToken(req.user.id,req.user.name,req.user.hasPremium)})
    }


    ).catch(err=>{console.log(err);})
}
