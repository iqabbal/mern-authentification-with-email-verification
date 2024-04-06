import { useState } from 'react';
import axios from 'axios'
import './Create.css'


function Create() {
const [email,setEmail] = useState();
const [password,setPassword] = useState();
const [name,setName] = useState();
const [dateOfBirth,setDateOfBirth] = useState();
const handleClick = () => {
  console.log("clicked...");
  axios.post('http://localhost:3001/user/signup', { email: email , password : password , name : name , dateOfBirth : dateOfBirth })
    .then(result => {
      console.log("Post request successful");
      //window.location.reload();
    })
    .catch(err => console.log(err));
	return (<h1> err </h1>);
}




const handleSingin = () => {
  console.log("clicked...");
  axios.post('http://localhost:3001/user/signin', { email: email , password : password })
    .then(result => {
      console.log("Post request successful");               //window.location.reload();
    })
    .catch(err => console.log(err));
        return (<h1> err </h1>);                      }





  return (<div className="create" >
	    <h1> sign up </h1><br/><br/><br/>
	    <h5>name</h5>
	    <input  type="text" name="" id="" onChange={(e)=>setName(e.target.value)} placeholdee="enter your name"/>
	    <h5>password</h5>
	    <input  type="password" name="" id="" onChange={(e)=>setPassword(e.target.value)} placeholdee="enter your password" />
<h5>email</h5>
            <input  type="email" name="" id="" onChange={(e)=>setEmail(e.target.value)} placeholdee="enter your email" />
            <h5>dateOfBirth</h5>
            <input  type="date" name="" id="" onChange={(e)=>setDateOfBirth(e.target.value)} placeholdee="enter your date of birth " />

	    <button onClick={handleClick}> sign up </button>

	    <button onClick={handleSingin}>sign in </button>
	  </div>);
}

export default Create
