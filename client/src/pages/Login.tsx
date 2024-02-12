import axios from 'axios';
import { ChangeEvent, FormEvent, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

interface Props {
    setIsLoggedIn: (value: boolean) => void
}

const Login = ({ setIsLoggedIn }: Props) => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setData({
        ...data,
        [e.target.id]: value
      });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const userData = {
        email: data.email,
        password: data.password
      };
      try {
        const res = await axios.post('http://localhost:4000/auth/login', userData);
        if (res.status === 200) {
            localStorage.setItem('user', JSON.stringify({ isLoggedIn: true, username: res.data.username }))
            setIsLoggedIn(true);
            return navigate('/');
        }
      } catch (error) {
        console.log(error);
      }
    }
    
    return (
        <div className='login'>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
              <label htmlFor="email">email:
                <input type="text" id='email' onChange={handleChange}/>
              </label>
              <label htmlFor="email">password:
                <input type="password" id='password' onChange={handleChange}/>
              </label>
              <button type='submit'>Submit</button>
          </form>
          <p>Don't have an account yet? <Link to='/register'>Register</Link></p>
        </div>
    )
}

export default Login