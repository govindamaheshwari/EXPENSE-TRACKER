const form=document.getElementById('form-signup');

form.addEventListener('click',signup);

async function signup(e){
        e.preventDefault();
        if(e.target.className=="signup"){
            const name=document.getElementById('name');
            const email=document.getElementById('email');
            const password=document.getElementById('password');
            if(name.value.length && email.value.length && password.value.length){
            const newuser={
                name:name.value,
                email:email.value,
                password:password.value
            }
            name.value="";
            password.value='';
            email.value="";
           let res;
            const url='http://ec2-65-0-75-38.ap-south-1.compute.amazonaws.com:3000/user/signup';
            try {
                res=await axios.post(url,newuser);
                console.log(res);
                
            } catch (error) {
                console.log(error);
            }

            const notif=document.getElementById('notif');
            console.log(notif)
            notif.classList.add("active");
            notif.innerHTML=`<h2>${res.data.message}</h2>`

            console.log(notif);
            setTimeout(()=>{notif.classList.remove("active"); console.log("done")},3000)

            }else{
                alert("Please fill all the fields");
            }
        }
}