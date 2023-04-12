const sequelize= require('../util/database.js');
const Sequelize= require('sequelize');

const Order = sequelize.define('order',{
id:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    allowNull:false,
    autoIncrement:true
},
orderId:Sequelize.STRING,
paymentId:Sequelize.STRING,
Status:Sequelize.STRING
})

module.exports=Order;