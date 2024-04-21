const express = require('express');
const router = express.Router();
const TodoModel = require('./models/Todo');
const UserVerification = require('./models/UserVerification');
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const bcrypt = require('bcrypt');
const path = require("path");

let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "learnn2023@gmail.com",
        pass: "coajzqhtvylfenug",
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Ready for message");
        console.log(success);
    }
});

router.post("/signup", (req, res) => {
    let { name, email, password, dateOfBirth } = req.body;

    console.log("backend called ... ");
    name = name.trim();
    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();

    if (name === "" || email === "" || password === "" || dateOfBirth === "") {
        res.json({
            status: "FAILED",
            message: "Empty input fields",
        });
    } else if (!/^[a-zA-Z]*$/.test(name)) {
        res.json({
            status: "FAILED",
            message: "Invalid name entered",
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email entered",
        });
    } else if (!Date.parse(dateOfBirth)) {
        res.json({
            status: "FAILED",
            message: "Invalid date entered",
        });
    } else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password is too short",
        });
    } else {
        TodoModel.find({ email })
            .then((result) => {
                if (result.length) {
                    res.json({
                        status: "FAILED",
                        message: "User with the provided email already exists",
                    });
                } else {
                    bcrypt.hash(password, 10)
                        .then((hashedPassword) => {
                            TodoModel.create({
                                name: name,
                                email: email,
                                password: hashedPassword,
                                dateOfBirth: dateOfBirth,
                                verified: false
                            })
                            .then((result) => {
                                sendVerificationEmail(result, res);
                            })
                            .catch(() => {
                                res.json({
                                    status: "FAILED",
                                    message: "An error occurred when adding data",
                                });
                            });
                        })
                        .catch(() => {
                            res.json({
                                status: "FAILED",
                                message: "An error occurred when hashing password",
                            });
                        });
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

async function sendVerificationEmail(user, res) {
    const currentUrl = "http://localhost:5000/";
    const uniqueString = uuidv4() + user._id;

    const mailOptions = {
        from: "learnn2023@gmail.com",
        to: user.email,
        subject: "Verify your email",
        html: `<p>Verify  your email address to complete the signup and login into your account . </p> 
        <p><b>This Link expires in 6 hours </b> </p> <p> Press <a href=${currentUrl + "user/verify/" + user._id + "/" + uniqueString}>here </a> to proceed </p>`
    };

    bcrypt.hash(uniqueString, 10)
        .then((hashedUniqueString) => {
            UserVerification.create({
                userId: user._id,
                uniqueString: hashedUniqueString,
                createdAt: Date.now(),
                expireAt: Date.now() + 21600000
            })
            .then(() => {
                transporter.sendMail(mailOptions)
                    .then(() => {
                        res.json({
                            status: "PENDING",
                            message: "Verification email sent",
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.json({
                            status: "FAILED",
                            message: "Couldn't send verification email",
                        });
                    });
            })
            .catch((err) => {
                console.log(err);
                res.json({
                    status: "FAILED",
                    message: "Couldn't save verification email data",
                });
            });
        })
        .catch(() => {
            res.json({
                status: "FAILED",
                message: "An error occurred when hashing email data",
            });
        });
}

router.get("/verify/:userId/:uniqueString", (req, res) => {
    let { userId, uniqueString } = req.params;
    UserVerification
        .find({ userId })
        .then((result) => {
            if (result.length > 0) {
                const { expireAt } = result[0];
                const hashedUniqueString = result[0].uniqueString;
                UserVerification.deleteOne({ _id: userId })
                    .then(() => {
                        // Response sent here
                        res.sendFile(path.join(__dirname, "./views/verified.html"));
                    })
                    .catch((err) => {
                        console.log("Error deleting verification record:", err);
                        let message = "An error occurred while finalizing successful verification.";
                        res.redirect(`/user/verified/error=true&messages=${message}`);
                    });

                if (expireAt < Date.now()) {
                    UserVerification.deleteOne({ userId })
                        .then(() => {
                            TodoModel.delteOne({ _id: userId }).then(() => {
                                let message = "Link has expired, Please sign up again.";
                                res.redirect(`/user/verified/error=true&messages=${message}`);
                            }).catch((err) => {
                                let message = "clearing user with expired unique string failed";
                                res.redirect(`/user/verified/error=true&messages=${message}`);
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            let message = "An error occured while clearing expired user verification record";
                            res.redirect(`/user/verified/error=true&messages=${message}`);
                        });
                } else {
                    console.log("uniqueString : ", uniqueString);
                    console.log("hashedUniqueString", hashedUniqueString);
                    bcrypt.compare(uniqueString, hashedUniqueString).then((valid) => {
                        if (valid) {
                            TodoModel.updateOne({ _id: userId }, { verified: true })
                                .then(() => {
                                    // Response sent here
                                    res.sendFile(path.join(__dirname, "./views/verified.html"));
                                })
                                .catch((err) => {
                                    console.log(err);
                                    let message = "An error occurred while updating user record to show verified ";
                                    res.redirect(`/user/verified/error=true&messages=${message}`);
                                });
                        } else {
                            let message = "Invalid verification details passed. check your inbox";
                            res.redirect(`/user/verified/error=true&messages=${message}`);
                        }
                    })
                        .catch((err) => {
                            let message = "An error occurred while comparing unique string ";
                            res.redirect(`/user/verified/error=true&messages=${message}`);
                        });
                }
            } else {
                let message = "Account record doesn't exist or has been verified already. please sign up or log in";
                res.redirect(`/user/verified/error=true&messages=${message}`);
            }
        })
        .catch((err) => {
            console.log(err);
            let message = "An error occurred while checking for existing user verification record";
            res.redirect(`/user/verified/error=true&messages=${message}`);
        });
});



//Verified page route
router.get("/verified", (req, res) =>{
    res.sendFile(path.join(__dirname,"./views/verified.html"));
})

router.post("/signin", (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();
    if (email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Empty input fields",
        });
    } else {
        TodoModel.find({ email })
            .then((data) => {
                if (data.length) {
                    if (!data[0].verified) {
                        res.json({
                            status: "FAILED",
                            message: "Email hasn't been verified yet. Check your inbox",
                        });
                    } else {
                        const hashedPassword = data[0].password;
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
                                        message: "Invalid password entered",
                                    });
                                }
                            })
                            .catch(() => {
                                res.json({
                                    status: "FAILED",
                                    message: "An error occurred while comparing password",
                                });
                            });
                    }
                } else {
                    res.json({
                        status: "FAILED",
                        message: "User not found",
                    });
                }
            })
            .catch(() => {
                res.json({
                    status: "FAILED",
                    message: "An error occurred while checking for existing user",
                });
            });
    }
});

module.exports = router;

