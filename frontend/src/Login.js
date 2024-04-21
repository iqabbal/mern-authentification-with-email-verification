import React from 'react'
import "./Login.css"

export default function Login() {
  return (

      <div className='Login'>
              <h1>Login</h1>

              <div className='input'>
                <h5>email</h5>
                <input  className="email" placeholder='enter your email' type='text' />
              </div>
              <div className='input'>
                <h5>password</h5>
                <input  className="password" placeholder='enter your password' type='password'></input>
              </div>
              <button className='Login-button'>Login</button>
              <p>if you don't registred <a href='/signup'> sign up</a></p>
              <p>if you forget the password<a href='/resetPassword'> reset password</a></p>
      </div>

  )
}

