const forgot_P=document.getElementById('forgotpassword');
const email_P=document.getElementById("email")
forgot_P.addEventListener('submit',forgotpassword)
function forgotpassword(e) {
    e.preventDefault();

    const userDetails = {
        email: email_P.value
    }
    console.log('?><<>?><><',userDetails)
    axios.post('http://localhost:3000/password/forgotpassword',userDetails).then(response => {
        if(response.status === 202){
            
            document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
            alert(response.data.message)
        } else {
            throw new Error('Something went wrong!!!')
        }
    }).catch(err => {
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    })
}
