const express = require('express');
const router = express.Router();

//mongodb user model 
const TodoModel = require('./models/Todo');

//mongodb userverification model
const UserVerification = require('./models/UserVerification');


//email handler 
const nodemailer = require("nodemailer");

//unique string 
const {v4 : uuidv4} = require("uuid");

//env variables
require("dotenv").config();

//password hashing
const bcrypt = require('bcrypt')


//const for static verified page
const path = require("path");

//nodemailer stuff
let transporter = nodemailer.createTransport({
    service :  "Gmail",
    auth : {
        user : "learnn2023@gmail.com",
        pass : "coajzqhtvylfenug",
    }
})

//testing success
transporter.verify((error, success)=>{
        if(error){
            console.log(error);
        }else{
            console.log("Ready for message");
            console.log(success);
        }
})
router.post("/signup", (req, res) => {
    
console.log("is here");
	let { name, email, password, dateOfBirth } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();

    if (name === "" || email === "" || password === "" || dateOfBirth === "") {
	    console.log("empty");
        res.json({
            status: "FAILED",
            message: "Empty input fields",
        });
    } else if (!/^[a-zA-Z]*$/.test(name)) {
	    console.log("invalid name");
        res.json({
            status: "FAILED",
            message: "Invalid name entered",
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
	    console.log("invalid email");
        res.json({
            status: "FAILED",
            message: "Invalid email entered",
        });
    } else if (!Date.parse(dateOfBirth)) {
	    console.log("invalid date");
        res.json({
            status: "FAILED",
            message: "Invalid date entered",
        });
    } else if (password.length < 8) {
	    console.log("invalid password");
        res.json({
            status: "FAILED",
            message: "Password is too short",
        });
    } else {
        TodoModel.find({ email})
            .then((result) => {
                if (result.length) {
		    console.log("email deja kayn");
                    res.json({
                        status: "FAILED",
                        message: "User with the provided email already exists",
                    });
                } else {
		    console.log("valid info");

                    // You can create a new user here
            const saltRounds =10;
            bcrypt.hash(password,saltRounds).then((hashedPassword)=>{

                TodoModel.create(
                {
                    name : name,
                    email: email,
                    password:hashedPassword,
                    dateOfBirth : dateOfBirth,
                    verified : false
                })
                .then((result)=>{  
                    //handle accoutn verification
                    sendVerificationEmail(result, res);
                    // res.json({                    
                    //     status: "SUCCESS",
                    //     message: "User signed up successfully", 
                    // });
    
                }).catch(()=>{
                    res.json({              
                        status: "FAILED",
                        message: "an error occured when adding data",                                                                 
                    })
                });
                
            }).catch(()=>{
                    res.json({              
                        status: "FAILED",
                        message: "an error occured when hashing password",                                                                 
                    })
                }
            )


            }
            })
            .catch((err) => {
                console.log(err);
                res.json({
                    status: "FAILED",
                    message: "An error occurred while checking for existing user",
                });
            });
    }
});


//send verification email

const  sendVerificationEmail = ({_id , email}, res)=>{
    //url to be used in  the email

    const currentUrl = "http://localhost:5000/"
    const uniqueString = uuidv4() + _id;

    const mailOptions = {
        from : "learnn2023@gmail.com",
        to : email,
        subject : "Verify your email",
        html : `<p>Verify  your email address to complete the signup and login into your account . </p> 
        <p><b>This Link expires in 6 hours </b> </p> <p> Press <a href=${currentUrl + "user/verify/" + _id + "/" + uniqueString}>here </a> to proceed </p>`

    };

    //hash the unique string 
    const saltRounds = 10;
    bcrypt
    .hash(uniqueString,saltRounds)
    .then((hashedUniqueString)=>{
        //set value on userVerification collection

        UserVerification.create(
        {
                userId:  _id,
                uniqueString : hashedUniqueString,
                createdAt : Date.now(),
                expireAt : Date.now() + 21600000
        })
        .then(()=>{
            transporter.sendMail(mailOptions)
            .then(()=>{

                //email sent and verification record saved
                res.json({
                    status: "PENDING",                                     
                    message: "Verification email sent",
                });
            })
            .catch((err)=>{
                console.log(err);
                res.json({
                    status: "FAILED",                                     
                    message: "couldn't sent verification email data",
                });
            })
        })
        .catch((err)=>{
            console.log(err);
            res.json({
                status: "FAILED",                                     
                message: "couldn't save verification email data",
            });
        });

    })
    .catch(()=>{
        res.json({
            status: "FAILED",                                     
            message: "An error occured when hashing email data",
        });
    })


//verify email
router.get("/verify/:userId/:uniqueString",(req,res) =>{

    let {userId , uniqueString} = req.params;
    UserVerification
    .find({userId})
    .then((result)=>
    {


        
        
        
        
        console.log(result);
        if(result){
            
            //user verification record exists so we passsed
            const { expireAt } = result[0];
            const hashedUniqueString = result[0].uniqueString;
            
            // UserVerification.deleteOne({_id: userId})
            // .then(() => {
            //     res.sendFile(path.join(__dirname, "./views/verified.html"));
            // })
            // .catch((err) => {
            //     console.log("Error deleting verification record:", err);
            //     let message = "An error occurred while finalizing successful verification.";
            //     res.redirect(`/user/verified/error=true&messages=${message}`);
            // });
                console.log(result);

                  //checking for expired unique string
                if(expireAt < Date.now()){
                      //record has expired so we delete it 
                      UserVerification.deleteOne({userId})
                      .then((result)=>{
                        TodoModel.delteOne({_id : userId}).then(()=>{
                            let message =  "Link has expired , Please sign up again .";
                            res.redirect(`/user/verified/error=true&messages=${message}`);
                       

                        }).catch((err)=>{
                            let message =  "clearing user with expired unique string failed";
                            res.redirect(`/user/verified/error=true&messages=${message}`);

                        })

                      })
                      .catch((err)=>{

                        console.log(err);
                        let message =  "An error occured while clearing expired user verification record";
                        res.redirect(`/user/verified/error=true&messages=${message}`);
                   
                      })               
                }
                else{
                    //valid record exists so we validate the user string
                    //first compare the hashed unique string

                    console.log("uniqueString : " ,uniqueString );
                    console.log("hashedUniqueString",hashedUniqueString);

                    bcrypt.compare(uniqueString , hashedUniqueString).then((valid) =>{
                        if(valid){
                            TodoModel.updateOne({_id : userId},{verified : true})
                            .then(()=>{
                                UserVerification.deleteOne({_id: userId})
                                .then(() => {
                                    res.sendFile(path.join(__dirname, "./views/verified.html"));
                                })
                                .catch((err) => {
                                    console.log("Error deleting verification record:", err);
                                    let message = "An error occurred while finalizing successful verification.";
                                    res.redirect(`/user/verified/error=true&messages=${message}`);
                                });
                            
                            })
                            .catc((err)=>{
                                console.log(err);
                                let message =  "An error occurred while updating user record to show verified ";
                                res.redirect(`/user/verified/error=true&messages=${message}`);   
                          

                            })
                        }
                        else{
                            //existing record but incorrect verification details passed
                            let message =  "Invalid verification details passed . check your inbox";
                            res.redirect(`/user/verified/error=true&messages=${message}`);   
                        }
                    })
                    .catch((err)=>{
                        let message =  "An error occured while comparing unique string ";
                        res.redirect(`/user/verified/error=true&messages=${message}`);
                    })
                }
            }else{
                //user verification record doesn't exist
                let message =  "Account record doesn't exist or has been verified already . please sign up or log in ";
                res.redirect(`/user/verified/error=true&messages=${message}`);
            }
    }
    )
    .catch((err)=>{
        console.log(err);
        let message =  "An error occured white checking for existing user verification record";
        res.redirect(`/user/verified/error=true&messages=${message}`);
    })
});


}


//Verified page route
router.get("/verified", (req, res) =>{
    res.sendFile(path.join(__dirname,"./views/verified.html"));
})



router.post("/signin", (req, res) => {
                       
    let { email, password } = req.body;

	email = email.trim();
	password = password.trim();
	if ( email == "" || password == "") {
        console.log("empty");
        res.json({
            status: "FAILED",                                     
            message: "Empty input fields",
        });
	}else{
		//check the pass
		TodoModel.find({ email }).then((data) => {
            console.log(data);
            if (data.length) {
                //user exists



                //check if the user is verified
                if(!data[0].verified){
                    res.json({
                        status: "FAILED",
                        message: "Email hasn't been verified yet . check  your inbox",
                    });
                }else{

                    const hashedPassword = data[0].password;
                    console.log("hashed pass: ", hashedPassword);
                    bcrypt.compare(password, hashedPassword)
                        .then((valid) => {
                            if (valid) {
                                res.json({
                                    status: "SUCCESS",
                                    message: "Signin successful",
                                    data: data
                                });
                            } else {
                                res.json({
                                    status: "FAILED",
                                    message: "Invalid password entered !!",
                                });
                            }
                        }).catch((err) => {           
                            console.error("An error occurred while comparing password:", err);
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while comparing password",
                            });
                        });
                }

                
            } else {       
                res.json({
                    status: "FAILED",
                    message: "invalid conditional entered",
                });
            }
        }).catch((err) => {
            console.error("An error occurred while checking for existing user:", err);
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing user",
            });
        });
        
	}




});

module.exports = router;

