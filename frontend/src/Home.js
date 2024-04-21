import { useState, useEffect } from 'react';
import React from 'react';
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'
import Create from './Create'
import axios from 'axios'
import './Home.css'
import Login from './Login';
import SignUp from './SignUp';
function Home() {

       
  return (
  
  
       
          <div className="Home">
                <div className='container'>
                <Router>
                        <Routes>
                                <Route path='/' element={<Login/>}></Route>
                                <Route path='/signup' element={<SignUp/>}></Route>
                                <Route path='/resetPassword' element={<SignUp/>}></Route>
                        </Routes>
                </Router>
                </div>
		 
</div>
          
        );
}

export default Home

