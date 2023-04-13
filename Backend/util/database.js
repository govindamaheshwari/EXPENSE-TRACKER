const Sequelize=require('sequelize');


console.log("tryig to connect db ")
//console.log("process variables: ", process)
const sequelize=new Sequelize(process.env.DB_NAME,process.env.DB_USERNAME,process.env.DB_PASSWORD,{dialect:'mysql',host:process.env.DB_HOST});
console.log("sequelise: ", sequelize)
module.exports = sequelize;