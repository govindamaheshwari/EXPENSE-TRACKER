const express= require('express');
const path = require('path')
const dotenv= require('dotenv');
dotenv.config()

const bodyParser = require('body-parser')
const sequelize = require('./util/database.js');
const controller= require('./controllers/signUp.js');
const controllers= require('./controllers/expense.js');
const resetpasswordController=require('./controllers/forgot_password.js');
const purchase= require('./controllers/purchase.js');
const userauthentication=require('./middleware/auth.js');
const { urlencoded } = require('body-parser');
var cors = require('cors')
const app = express();
const Expense=require('./models/expense.js');
const Order=require('./models/orders.js');
const User=require('./models/user.js');
const Forgotpassword=require('./models/forgotpassword.js')



app.use(cors())
app.use(bodyParser.json(),urlencoded({extended:true}))

//app.get('/getExpenses',controllers.getExpanses);
app.post('/user/signup',controller.register);
app.post('/user/login',controller.login);
app.get('/premium',controller.premiumLeaderboard);
app.post('/password/forgotpassword', resetpasswordController.forgotpassword)
app.get('/password/resetpassword/:id', resetpasswordController.resetpassword)
app.get('/password/updatepassword/:id', resetpasswordController.updatepassword)
//app.get('/expense/getExpenses',userauthentication.authenticate,controllers.getExpanses);
app.post('/expense/addExpenses',userauthentication.authenticate,controllers.addExpense);
app.get('/purchase/purchasepremium',userauthentication.authenticate,purchase.purchasePremium);
app.post('/purchase/updateTransactionStatus',userauthentication.authenticate,purchase.updateTransaction);
app.get('/expense/getExpense',userauthentication.authenticate,controllers.getExpense);
app.put('/expense/updateExpense/:expanseId',controllers.updateExpense);
app.post('/expense/deleteExpenses/:expenseId',userauthentication.authenticate, controllers.deleteExpense);
app.get('/expense/downloadExpenses',userauthentication.authenticate, controllers.downloadExpense);
//app.get('/expense/previousdownloads',userauthentication.authenticate, controllers.previousDownload);


Expense.belongsTo(User,{constraints:true,onDelete:'CASCADE'}),
User.hasMany(Expense)
Order.belongsTo(User,{constraints:true,onDelete:'CASCADE'}),
User.hasMany(Order)
Forgotpassword.belongsTo(User)
User.hasMany(Forgotpassword)
sequelize.sync().then(result=>{console.log(result);}).catch(err=>{console.log(err);})
app.listen(3000,()=>{console.log("server running on port 3000");})
