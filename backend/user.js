const express = require('express');
const router = express.Router();
const TodoModel = require('./models/Todo');

//password hashing

const bcrypt = require('bcrypt')
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
        TodoModel.find({ email })
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

                TodoModel.create({name : name, email: email , password:hashedPassword , dateOfBirth : dateOfBirth})
                .then(()=>{                          				
                    res.json({                    
                        status: "SUCCESS",
                        message: "User signed up successfully", 
                    });
    
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
                const hashedPassword = data[0].password;
                console.log("hashed pass: ", hashedPassword);
                bcrypt.compare(password, hashedPassword)
                    .then((data) => {
                        if (data) {
                            res.json({
                                status: "SUCCESS",
                                message: "signin successful",
                                data: data
                            });
                        } else {
                            res.json({
                                status: "FAILED",
                                message: "invalid password entered !!",
                            });
                        }
                    }).catch((err) => {           
                        console.error("An error occurred while comparing password:", err);
                        res.json({
                            status: "FAILED",
                            message: "An error occurred while comparing password",
                        });
                    });
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

