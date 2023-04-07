const Sequelize=require('sequelize');
const sequelize=new Sequelize('node-complete','root','Iitd@0202',{dialect:'mysql',host:'localhost'});
module.exports = sequelize;