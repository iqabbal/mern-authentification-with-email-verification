const express = require('express');
const router = express.Router();
const TodoModel = require('./models/Todo');


router.post("/signup", (req, res) => {
    
console.log("is here");
	let { name, email, password, dateOfBirth } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();

    console.log(name);
    console.log(email);
    console.log(password);
    console.log(dateOfBirth);
    if (name === "" || email === "" || password === "" || dateOfBirth === "") {
	    console.log("empty");
        res.json({
            status: "failed",
            message: "Empty input fields",
        });
    } else if (!/^[a-zA-Z]*$/.test(name)) {
	    console.log("invalid name");
        res.json({
            status: "failed",
            message: "Invalid name entered",
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
	    console.log("invalid email");
        res.json({
            status: "failed",
            message: "Invalid email entered",
        });
    } else if (!Date.parse(dateOfBirth)) {
	    console.log("invalid date");
        res.json({
            status: "failed",
            message: "Invalid date entered",
        });
    } else if (password.length < 8) {
	    console.log("invalid password");
        res.json({
            status: "failed",
            message: "Password is too short",
        });
    } else {
        TodoModel.find({ email })
            .then((result) => {
                if (result.length) {
		    console.log("email deja kayn");
                    res.json({
                        status: "failed",
                        message: "User with the provided email already exists",
                    });
                } else {
		    console.log("valid info");

                    // You can create a new user here
                    TodoModel.create({name : name, email: email , password:password , dateOfBirth : dateOfBirth}).then(()=>{

console.log("Valid info");                            				res.json({                                                status: "success",                                    message: "User signed up successfully",                                                                 });


		    }).catch(()=>{
			    res.json({                                                status: "failed",                                    message: "an error occured when adding data",                                                                 })
		    });

                }
            })
            .catch((err) => {
                console.log(err);
                res.json({
                    status: "failed",
                    message: "An error occurred while checking for existing user",
                });
            });
    }
});

router.post("/signin", (req, res) => {
    // Logic for signin route
 	console.log("signin");                            let { email, password } = req.body;
	email = email.trim();
	password = password.trim();
	console.log("password : ", password);
	if ( email === "" || password === ""
 ) {
        console.log("empty");
        res.json({
            status: "failed",                                     message: "Empty input fields",
        });
	}else{
		//check the pass
		TodoModel.find({email}).then((data)=>{

			console.log("data" , data);
			console.log("data 0 " , data[0]);
			if(data[0].password === password ){
				console.log("mar7ba bik");
			}
			else{
				console.log("pass incorrect");
			}
		}).catch((err)=>{


		console.log(err);                                     res.json({
                    status: "failed",
                    message: "An error occurred while getting the user",                                          });



		});
	}




});

module.exports = router;

