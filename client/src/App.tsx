import axios from 'axios';
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import List from './pages/List';
import Login from './pages/Login';
import './App.css'
import User from './components/User';
import Register from './pages/Register';

axios.defaults.withCredentials = true;

function App() {
  const [username, setUsername] = useState<string>(localStorage.getItem('user') ? 
    JSON.parse(localStorage.getItem('user')!).username : '');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(localStorage.getItem('user') ? 
    JSON.parse(localStorage.getItem('user')!).isLoggedIn : false);

  useEffect(() => {
    if (isLoggedIn) {
      setUsername(JSON.parse(localStorage.getItem('user')!).username);
    }
  }, [isLoggedIn])
  
  return (
    <div className='app'>
      {isLoggedIn && <User username={username} setUsername={setUsername} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
      <Routes>
        <Route path='/' element={isLoggedIn ? <Home /> : <Login setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path='/:id' element={<List />} />
        <Route path='/register' element={<Register setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>
    </div>
  )
}

export default App
