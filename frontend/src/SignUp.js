import React , {useState} from 'react'
import  "./SignUp.css"
import  axios  from 'axios';
export default function SignUp() {


  //data
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [dateOfBirth,setDateOfBirth] = useState("");



  function handleSubmit(){

    console.log("clicked ...");
    axios.post("http://localhost:5000/user/signup" , {
      name : name,
      email : email,
      password : password,
      dateOfBirth : dateOfBirth,
      
    })
    .then((res)=>{console.log("post request successful")})
    .catch((err)=>{console.log(err)})
  }

  return (
    <div className='signup'>
              <h1>Sign Up</h1>
              <div className='input'>
                <h5>name</h5>
                <input  className="name" placeholder='enter your name' type='text' onChange={(e)=>{setName(e.target.value)}} />
              </div>
              <div className='input'>
                <h5>email</h5>
                <input  className="email" placeholder='enter your email' type='email' onChange={(e)=>{setEmail(e.target.value)}} />
              </div>
              <div className='input'>
                <h5>password</h5>
                <input  className="password" placeholder='enter your password' type='password' onChange={(e)=>{setPassword(e.target.value)}} ></input>
              </div>
              <div className='input'>
                <h5>dateOfBirth</h5>
                <input  className="dateOfBirth" placeholder='enter your dateOfBirth' type='date' onChange={(e)=>{setDateOfBirth(e.target.value)}} />
              </div>
              <button className='Login-button' onClick={handleSubmit}>submit</button>
              <p>if you already registred <a href='/'> login</a></p>
    </div>
  )
}
