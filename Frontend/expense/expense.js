let myForm = document.getElementById('myform');
let description= document.getElementById('description-Input')
let category= document.getElementById('category')
let expanse= document.getElementById('expanse')
let expanseId= document.getElementById('expanseId');
const userList = document.getElementById('displayList');
var a=0;

const url= "http://ec2-65-0-75-38.ap-south-1.compute.amazonaws.com:3000";


myForm.addEventListener('submit',add);
userList.addEventListener('click',remove);
userList.addEventListener('click',edit);

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}
window.addEventListener('DOMContentLoaded',()=>{  
const token =localStorage.getItem('token');
const decodeToken= parseJwt (token)
console.log(decodeToken.hasPremium)
if (decodeToken.hasPremium==1){
  window.location.href=`../premium/premium.html`
}  
axios.get(url+'/expense/getExpenses',{headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`}}) 
.then(res=>{
  console.log('<lodingExpenses>',res);
  displayExpanses(res.expenses);
}).catch(err=>{console.log("error found"); console.log(err)});  
})



async function add(e){
try{
e.preventDefault();
console.log(description.value)
const token =localStorage.getItem('token');
if(description.value.length>0 && expanse.value.length>0 && category.value.length>0){
   
  let obj={"amount":expanse.value, "category":category.value,"description": description.value}
  if (a==0){
    
    let res=await axios.post(url+'/expense/addExpenses',obj,{headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`}})
    console.log('<sqlNewDataRecieved>',res)
  }
  else{
    let res=await axios.put(url+'/expense/updateExpense'+'/'+expanseId.value,obj)
    console.log('<updatedExpanseRecieved>',res)
  }

  let res =await axios.get(url+'/expense/getExpenses',{headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`}})
  a=0;
  console.log('<gettingAllExpenses>',res)
  displayExpanses(res.expenses)
}

}

catch(err){console.log(err)};  
}

function displayExpanses(data){
let ul = document.getElementById('displayList')
while (userList.firstChild) {
  userList.removeChild(userList.lastChild);
  }
for (let i = 0; i < data.length  ; i++){
  
    let destring=data[i];

let li= document.createElement('li');
li.id=destring.id;
li.appendChild(document.createTextNode(destring.ammount + ': ' ))
li.appendChild(document.createTextNode(destring.category+ " - "))
li.appendChild(document.createTextNode(destring.description))


let delbtn = document.createElement('button');
delbtn.className='delete'
delbtn.appendChild(document.createTextNode('DEL_EXP'))
li.appendChild(delbtn)
let editbtn = document.createElement('button');
editbtn.className='edit'
editbtn.appendChild(document.createTextNode('EDIT_EXP'))
li.appendChild(editbtn)
userList.appendChild(li);

expanse.value=''
description.value=''

}
};
async function remove(e){
try{
  if(e.target.classList.contains('delete')){
     var li= e.target.parentElement;
     let key = li.id;
     console.log(key);
     const token =localStorage.getItem('token');
     let re =await axios.delete(url+'/expense/deleteExpenses/'+key,{headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`}})
     console.log('<deletedExpense>',re);
     let res=await axios.get(url+'/expense/getExpenses',{headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`}})
     displayExpanses(res.expenses);
  } 
  }catch(err){console.log(err)}
  }
async function edit(e){
  try{
  a=1
  if(e.target.classList.contains('edit')){
  let li= e.target.parentElement;
  let key = li.id;
  console.log(key);
  let res=await axios.get(url+'/expense/getExpense'+'/'+key,{headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`}})
  console.log('<getOldExpanse>',res);
  expanse.value=res.expanse.ammount;
  description.value=res.expanse.description; 
  category.value= res.expanse.category
  expanseId.value=res.expanse.id
  }
  }
  catch(err){console.log(err)}
}

document.getElementById('premium').onclick=async function(e){
      const token =localStorage.getItem('token')
      console.log(token)
      try {
        console.log(token)
        let response = await axios.get(url+ "/purchase/purchasepremium", {
          headers: { "Authorization":`Bearer ${localStorage.getItem('token')}`}
        })
        console.log(response);
      let options={
        "key":response.key_id,
        "order_id":response.order.id,
      "handler":async function(response){
        let res=await axios.post(url+'/purchase/updateTransactionStatus',{
          orderId:options.order_id,
          paymentId:response.razorpay_payment_id,
        },{headers:{"Authorization": token}})
        if(res.success){

      
          alert('you are a premium user now,please refresh once ')
          let a=document.getElementById('premium')
          a.style.visibility="hidden";
          document.getElementById('message').innerHTML="You are permium user now."
          localStorage.setItem("token",res.data.token)
          

        }

      }}

      var rzp1 = new Razorpay(options);
        rzp1.open()
        e.preventDefault()
        rzp1.on('payment.failed',function(response){
          console.log(response);
          alert('something is wrong')
        })
      
      }catch(err){console.log(err)}
    }
   
        