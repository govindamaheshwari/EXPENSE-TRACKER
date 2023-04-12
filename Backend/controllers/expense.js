const Expense = require('../models/expense.js');
const Sequelize = require("sequelize");
const Op=Sequelize.Op;
const UserServices=require('../services/userServices.js');
const S3Services= require('../services/s3Services.js')
const https=require('https')
const fs=require('fs')

exports.getExpenses=async(req,res,next)=>{
let expenses= await Expense.findAll({where:{userId:req.user.id}});
console.log('<gettingAllExpenses>',expenses);
res.send({expenses:expenses})
}

exports.downloadExpense = async (req, res, next) => {
  try {
  const expenses = await UserServices.getExpenses(req);

  const userId = req.user.id;
  const stringified = await JSON.stringify({expenses:expenses, length:expenses.length});
  const fileName = `expenses${userId}/${new Date()}`;
  console.log("expenses fetched: ", expenses, "stringified: ", stringified)
  const downloadLink = await S3Services.uploadToS3(fileName, stringified);
  console.log("download butto hitted.............")


  const file = fs.createWriteStream("file.jpg");
  const request = https.get(downloadLink, function(response) {
    console.log("response of piping : ", response)
   response.pipe(file);

   // after download completed close filestream
   file.on("finish", () => {
       file.close();
       console.log("Download Completed");
   });
});
  
  res.status(200).json({ success: true, fileUrl: downloadLink });
} catch (error) {
  //console.log("error occured: ", error)
  res.status(500).json({ success: false, error:error });
}
};





exports.addExpense= async(req,res,next)=>{
    console.log("we are in ");
    

    

  await  Expense.create({
        ammount:req.body.amount,
        description: req.body.description,
        category:req.body.category,
        userId:req.user.id

    }).then(result=>{res.status(200).json({result:result,message:"data added!",})}).catch(err=>{console.log(err);console.log("code wasnt executed");});
}
//exports.getExpense= async (req,res,next)=>{
//     
exports.getExpense = (req, res, next) => {
    const limit = req.query.limit;
    const page = +req.query.page || 1;
    const rows = +req.query.rows || 10;
    //console.log(page, rows);
    let totalExpenses;
    let today = new Date();
    let date = new Date("1980-01-01");
    if (limit == "weekly") {
      const todayDateOnly = new Date(today.toDateString());
      date = new Date(todayDateOnly.setDate(todayDateOnly.getDate() - 6));
    } else if (limit == "daily") {
      date = new Date(today.toDateString());
    } else if (limit == "monthly") {
      date = new Date(today.getFullYear(), today.getMonth(), 1);
    }
    req.user.getExpenses({
        where: {
          createdAt: { [Op.and]: [{ [Op.gte]: date }, { [Op.lte]: today }] },
        },
      })
      .then((response) => {
        totalExpenses = response.length;
       
        req.user
          .getExpenses({
            where: {
              createdAt: { [Op.and]: [{ [Op.gte]: date }, { [Op.lte]: today }] },
            },
            order: [["createdAt", "DESC"]],
            offset: (page - 1) * rows,
            limit: rows,
          })
          .then((expenses) => {
            // const filteredExpenses=expenses.filter((expense)=>{
            //     return expense.createdAt>=date;
            // })
         
            return res
              .status(200)
              .json({
                success: true,
                
                expenses: expenses,
                currentPage: page,
                hasPreviousPage: page > 1,
                hasNextPage: page * rows < totalExpenses,
                previousPage: page - 1,
                nextPage: page + 1,
                  lastPage: Math.ceil(totalExpenses / rows),
                limit:limit
              });
          })
          .catch((err) => {
            throw new Error(err);
          });
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  };

exports.updateExpense=(req,res,next)=>{
    const id= req.params.expenseId;
    if(id){
    Expense.findByPk(id).then(expense=>{
        expense.ammount=req.body.amount,
        expense.description= req.body.description,
        expense.category=req.body.category
    return expense.save()
    }).then(result=>{console.log("expense updated");res.json({expense:result})}).catch(err=>{console.log(err);})
    }else{
        res.send("expense not found")
    }

}



exports.deleteExpense = async (req, res, next) => {
  const expId = req.params.expanseId;
  console.log("expId: ", expId)
  req.user
    .getExpenses({ where: { id: expId } })
    .then((expenses) => {
      const expense = expenses[0];
      console.log('$%^&*$%^&IOP',typeof(expense.ammount))
      expense.destroy();
      res.status(201).json({ message: "Deleted successfully" });
    })
    .catch((err) => {
      console.log(err);
    });
};