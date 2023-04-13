//enables dark theme by default

document.body.classList.toggle("dark")
let b=document.getElementById('leaderboard')


//dark theme icon
const toggle = document.getElementById("toggle");

toggle.addEventListener("change", (e) => {
    document.body.classList.toggle("dark", e.target.unchecked);
});

const logout=document.getElementById('logout')
logout.addEventListener('click',()=>{
    window.location.href='../register/login.html'
    localStorage.removeItem('token')
})

function notifyUser(message){
    const notificationContainer = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `<h4>${message}</h4>`;
    notificationContainer.appendChild(notification);
    setTimeout(()=>{
        notification.remove();
        },2500)
}

const form=document.getElementById('expense')

form.addEventListener('submit',(e)=>{
    e.preventDefault()
    const expenseAmt=document.getElementById('amount').value
    const expenseDes=document.getElementById('description').value
    const expenseCat=document.getElementById('category').value
    const obj={
        amount:expenseAmt,
        description:expenseDes,
        category:expenseCat
    }
    document.getElementById('amount').value='';
    document.getElementById('description').value='';
    document.getElementById('category').value = '';
    

    console.log(localStorage.getItem('token'))
    axios.post('http://ec2-65-0-75-38.ap-south-1.compute.amazonaws.com:3000/expense/addExpenses',obj,{headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}})
    .then(res=>{
        console.log("res:", res)
        notifyUser(res.data.message)
    })
    .catch(err=>{
        console.log(err)
    })

})


//display expense
const getExpense=document.getElementById('getExpense')
getExpense.addEventListener('click',()=>{
    displayExpenses('all')
})
const dailyBtn=document.getElementById('daily')
dailyBtn.addEventListener('click',()=>{
    displayExpenses('daily')
})
const weeklyBtn=document.getElementById('weekly')
weeklyBtn.addEventListener('click',()=>{
    displayExpenses('weekly')
})
const monthlyBtn=document.getElementById('monthly')
monthlyBtn.addEventListener('click',()=>{
    displayExpenses('monthly')
})

//displaying expenses
function displayExpenses(limit,page=1,rows=localStorage.getItem('rows')){
    const displayContainer=document.getElementById('displayContainer')
    displayContainer.innerHTML=''
    axios.get(`http://ec2-65-0-75-38.ap-south-1.compute.amazonaws.com:3000/expense/getExpense?limit=${limit}&page=${page}&rows=${rows}`,{headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}})
    .then(response=>{
        console.log('@#$%^&*&^%$',response.data)
        const table=document.createElement('table')
        table.setAttribute('class','styled-table')
        const thead=document.createElement('thead')
        const tbody=document.createElement('tbody')
        const tfoot=document.createElement('tfoot')
        let total=0;
        thead.innerHTML=`
            <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Description</th>
            <th></th>
            </tr>
        `
        response.data.expenses.forEach(expense=>{
            const row=document.createElement('tr')
            row.setAttribute('id',`e${expense.id}`)
            row.innerHTML=`
                <td>${expense.createdAt.substring(0,10)}</td>
                <td>${expense.ammount}</td>
                <td>${expense.category}</td>
                <td>${expense.description}</td>
                <td><button id="dltbtn" style="color:red;border-radius:5px;padding:3px;">Delete</button></td>
            `
            total+=parseInt(`${expense.ammount}`)
            tbody.appendChild(row);
        })
        tfoot.innerHTML=`
                <tr>
                <td>Total</td>
                <td>${total}</td>
                <td></td>
                <td></td>
                <td></td>
                </tr>
            `
        table.appendChild(thead)
        table.appendChild(tbody)
        table.appendChild(tfoot)
        displayContainer.appendChild(table)
        pagination(response)

    })
    .catch(err=>{
        console.log(err)
    })
}

//pagination
function pagination(response){
    const container=document.getElementById('pagination')
    const rows=parseInt(localStorage.getItem('rows'));
    container.innerHTML=`
    <form> 
    <label for="rows">Rows Per Page:</label>
    <select name="rowsPerPage" id="rows" style="width:60px;padding:0px" value="50">
          <option disabled selected value> ${localStorage.getItem('rows')}</option>
          <option value=5>5</option>
          <option value=10>10</option>
          <option value=25>25</option>
          <option value=50>50</option>
   </select>
   <button type="click" id="rowsPerPage">Submit</button>
   </form>
   <br>
    <span>
         <button id="firstPage" onclick="displayExpenses(${response.limit},${1},${rows})">1</button>
         <button id="previousPage" onclick="displayExpenses(${response.limit},${response.data.previousPage},${rows})">${response.data.previousPage}</button>
         <button id="currentPage" onclick="displayExpenses(${response.limit},${response.data.currentPage},${rows})" class="active">${response.data.currentPage}</button>
         <button id="nextPage" onclick="displayExpenses(${response.limit},${response.data.nextPage},${rows})">${response.data.nextPage}</button>
         <button id="lastPage" onclick="displayExpenses(${response.limit},${response.data.lastPage},${rows})">${response.data.lastPage}</button>
    </span>
    `
    const firstPage=document.getElementById(`firstPage`);
    const currentPage=document.getElementById(`currentPage`);
    const previousPage=document.getElementById(`previousPage`);
    const nextPage=document.getElementById(`nextPage`);
    const lastPage=document.getElementById(`lastPage`);
    if(parseInt(currentPage.innerText)==1)
    firstPage.style.display='none'
    if(parseInt(previousPage.innerText)<1 || parseInt(previousPage.innerText)==firstPage.innerText)
    previousPage.style.display='none'
    if(parseInt(nextPage.innerText)>parseInt(lastPage.innerText))
    nextPage.style.display='none'
    if(parseInt(currentPage.innerText)==parseInt(lastPage.innerText) || parseInt(nextPage.innerText)==parseInt(lastPage.innerText) )
    lastPage.style.display='none'

    //when rows per page clicked
    //dynamic pagination
    const rowsPerPageBtn=document.getElementById('rowsPerPage')
    rowsPerPageBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    localStorage.setItem('rows',document.getElementById('rows').value)
    displayExpenses()

})

}



//delete expense
const displayContainer=document.getElementById('displayContainer')
displayContainer.addEventListener('click',(e)=>{
    if(e.target.id=='dltbtn'){
        const trId=e.target.parentNode.parentNode.id.substring(1);
        const tr=e.target.parentNode.parentNode
        console.log("b=delete clicked");
        console.log("trId: ",trId)
        axios.delete(`http://ec2-65-0-75-38.ap-south-1.compute.amazonaws.com:3000/expense/deleteExpenses/${trId}`,{},{headers:{'authorization':`Bearer ${localStorage.getItem('token')}`}})
        .then((res)=>{
            tr.remove()
            notifyUser(res.data.message)
        })
        .catch(err=>{console.log(err)})
    }
})

//download Expense
const downloadBtn=document.getElementById('download')
downloadBtn.addEventListener('click',()=>{
    axios.get('http://ec2-65-0-75-38.ap-south-1.compute.amazonaws.com:3000/expense/downloadExpenses',{headers:{'authorization':`Bearer ${localStorage.getItem('token')}`}})
    .then(response=>{
        console.log(response)
        const link=document.createElement('a');
        link.href=`${response.data.fileUrl}`;
        link.download='MyExpenses.csv'
        link.click();
    })
    .catch((err)=>{
        console.log(err)
        document.innerHTML+=`<div>${err}</div>`
    })
})


document.getElementById('premium_').onclick=async function displayLeaderBoard() {
    axios.get("http://ec2-65-0-75-38.ap-south-1.compute.amazonaws.com:3000/premium")
      .then((result) => {
        let list = document.getElementById("leader_list");

        console.log('premiumUserFeatures',result)
        // while (list.firstChild) {
        //   list.removeChild(list.lastChild);
        // }
        list.innerHTML = ''
        list.innerHTML = '<h6>Learder Board</h6>'
        result.data.forEach((element) => {{

        const liItem=`<li class="leader_item">name :${element.name} & total_expense: ${element.totalExpense?element.totalExpense:0}</li>`
        list.innerHTML+=liItem
        //   let li = document.createElement("li");
          
        //   let textContent=document.createTextNode(`name :${element.name} & total_expense: ${element.totalExpense}`)
        //   li.className = "leader-item";
        //   li.appendChild(textContent);
        //   list.appendChild(li);
        }});
      })
      .catch((err) => {
        console.log(err);
      });
  }
      