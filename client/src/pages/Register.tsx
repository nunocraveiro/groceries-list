import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';
import { useState, ChangeEvent, FormEvent } from 'react';

interface Props {
    setIsLoggedIn: (value: boolean) => void
}

const Register = ({ setIsLoggedIn }: Props) => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        username: "",
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
        username: data.username,
        email: data.email,
        password: data.password
      };
      try {
        const res = await axios.post('http://localhost:4000/auth/register', userData);
        if (res.status === 200) {
            return navigate('/');
        }
      } catch (error) {
        console.log(error);
      }
    }

    return (
        <div className='login'>
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
              <label htmlFor="username">username:
                <input type="text" id='username' onChange={handleChange}/>
              </label>
              <label htmlFor="email">email:
                <input type="text" id='email' onChange={handleChange}/>
              </label>
              <label htmlFor="email">password:
                <input type="password" id='password' onChange={handleChange}/>
              </label>
              <button type='submit'>Submit</button>
          </form>
        </div>
    )
}

export default Register;