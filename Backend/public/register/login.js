const loginbtn=document.getElementById('loginbutton');

loginbtn.addEventListener('click',login);

async function login(e){
        e.preventDefault();
        const email=document.getElementById('email');
        const password=document.getElementById('password');
        if(email.value.length>0 && password.value.length>0){
            const object={
                email:email.value,
                password:password.value
            }
            email.value="";
            password.value="";
            let res;
            const url='http://localhost:3000/user/login';
                res=await axios.post(url,object);
                if(res.data.success===true){
                console.log("response of post ",res.data);
                localStorage.setItem('token',res.data.token)
                window.location.href="../expense/expense.html"
                }

                // const hasPremium=res.data.hasPremium;
                // localStorage.setItem('token',res.data.token);
                else{
                const notif=document.getElementById('notif');

                notif.classList.add("active");
                notif.innerHTML=`<h2>${res.data.message}</h2>`
                setTimeout(()=>{
                    notif.classList.remove("active"); 
                    console.log("Notif removed");
                //     if(hasPremium==='0'){
                //     window.location.href='../mainFrontEnd/index.html';
                //     }
                //     else{
                //         window.location.href="../premiumFrontEnd/premium.html";
                //     }
                 },2000)
                }
    
            
        }
        else{
                alert("Please fill all the fields");
        }

}
const forgotPassword=document.getElementById('forgotpassword');

forgotPassword.addEventListener('click',forgotuserPassword)
function forgotuserPassword(e){
        window.location.href = "../forgotPassword/forgot_P.html"
}

    