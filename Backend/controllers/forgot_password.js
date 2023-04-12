const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');
require("dotenv").config();

const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');

exports.forgotpassword = async (req, res) => {
    try {
        console.log(req.body)
        const { email } =  req.body;
        const user = await User.findOne({where:{email: email }});
        if(user){
            console.log(user)
            //console.log(process.env.SENGRID_API_KEY)
            const id = uuid.v4();
            user.createForgotpassword({ id:id, active: true })
                .catch(err => {
                    throw new Error(err)
                })
            sgMail.setApiKey(process.env.SENGRID_API_KEY)

            const msg = {
                to: email, 
                from: 'iitianmahesh999@gmail.com', 
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset your password</a>`,
            }

            sgMail
            .send(msg)
            .then((response) => {
                return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})

            })
            .catch((error) => {
                throw new Error(error);
            })
        }else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}
exports.resetpassword = async (req, res) => {
    const id =  req.params.id;
    let forgotPassword= await Forgotpassword.findOne({ where:{id:id}})
        if( forgotPassword.active){

            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            
        }else{
            res.send('Link has been expired')
        }                                           
        
}

exports.updatepassword = async (req, res) => {

    try {
        console.log('#$%^&*()$%^&*()',req.query)
        const { newpassword } = req.query;
        const  resetpasswordid  = req.params.id;
        let resetpasswordrequest =await Forgotpassword.findOne({ where : { id: resetpasswordid }})
        let user= await  User.findOne({where: { id:resetpasswordrequest.userId}})
        if(user){
            let hashedPassword= await bcrypt.hash(newpassword,10)
            await user.update({ password: hashedPassword })
            await resetpasswordrequest.update({ active: false});

            user.save()
            return res.status(201).json('Successfuly update the new password')
        }
        else{
            return res.status(404).json({ error: 'No user Exists', success: false})
        }
    }catch(error){
        return res.status(403).json({ error, success: false } )
    }

}

