const Sequelize= require('sequelize');
const sequelize= require('../util/database.js');

const Expense= sequelize.define('expense',{
    id:{type:Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
    },
    ammount:{type:Sequelize.DOUBLE,
    allowNull:false
    },
category:Sequelize.STRING,
description:Sequelize.STRING
    
    })
    
    module.exports=Expense;