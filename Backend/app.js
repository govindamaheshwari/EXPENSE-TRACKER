const express= require('express');
const path = require('path')
const dotenv= require('dotenv');
dotenv.config()

const bodyParser = require('body-parser')
const sequelize = require('./util/database.js');


const { urlencoded } = require('body-parser');
var cors = require('cors')
const app = express();

const Expense=require('./models/expense.js');
const Order=require('./models/orders.js');
const User=require('./models/user.js');
const Forgotpassword=require('./models/forgotpassword.js')


const loginRoutes=require('./routes/login.js');
const passwordRoutes=require('./routes/password.js');
const purchaseRoutes=require('./routes/purchase.js');
const expenseRoutes=require('./routes/expenses.js');
const { register } = require('./controllers/signUp.js');




app.use(cors())
app.use(bodyParser.json(),urlencoded({extended:true}))
app.use(loginRoutes);
app.use(passwordRoutes);
app.use(purchaseRoutes);
app.use(expenseRoutes);

app.use((req, res)=>{
    res.sendFile(path.join(__dirname, "public/register/signup.html"))

})


Expense.belongsTo(User,{constraints:true,onDelete:'CASCADE'}),
User.hasMany(Expense)
Order.belongsTo(User,{constraints:true,onDelete:'CASCADE'}),
User.hasMany(Order)
Forgotpassword.belongsTo(User)
User.hasMany(Forgotpassword)


sequelize
    .sync()
    .then(()=>{
        app.listen(process.env.port || 3000);
    })
    .catch(error=>console.log(error));