import { useState, useEffect } from 'react';
import Create from './Create'
import axios from 'axios'
import './Home.css'
function Home() {

const [todos, setTodos]= useState([]);

	useEffect(() => {
  axios.get('http://localhost:3001/get')
    .then(result => setTodos(result.data)) // setTodos to result.data
    .catch(err => console.log(err));

},[]);



const Delete = (id) => {
        axios.delete('http://localhost:3001/delete/'+id).then(result => {console.log(result)
window.location.reload();
        }).catch(err => console.log(err))
}



const Update = (id) => {
	axios.put('http://localhost:3001/update/'+id).then(result => {console.log(result)
window.location.reload();
	}).catch(err => console.log(err))
}



  return (<div className="Home"> 
		<Create/>
	</div>);
}

export default Home

