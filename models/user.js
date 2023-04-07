const Sequelize=require('sequelize');

const sequelize=require('../util/database.js');

const User= sequelize.define('users',{
    id:{
        type: Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name: Sequelize.STRING,
    email:{
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password: {
        type:Sequelize.STRING,
        allowNull:false
    },
    hasPremium:{
        type:Sequelize.STRING,
        defaultValue:false
    },
    totalExpense:{
        type:Sequelize.INTEGER,
        defaultValue:0
        
    }
    }
)
module.exports=User;