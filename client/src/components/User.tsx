import axios from 'axios';
import './User.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
    username: string,
    setUsername: (value: string) => void
    isLoggedIn: boolean
    setIsLoggedIn: (value: boolean) => void
}

const User = ({ username, setUsername, isLoggedIn, setIsLoggedIn }: Props) => {
    const [showLogout, setShowLogout] = useState<boolean>(false);
    const navigate = useNavigate();

    const userClick = () => {
        if (!showLogout && isLoggedIn) {
            return setShowLogout(true);
        }
        return setShowLogout(false);
    }

    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:4000/auth/logout');
            if (res.status === 200) {
                setUsername('');
                setIsLoggedIn(false);
                setShowLogout(false)
                localStorage.clear();
                return navigate('/');
            }
          } catch (error) {
            console.log(error);
          }
    }

    return (
        <div className='user_container'>
            <div className='user'>
                <p>{username}</p>
                <div className="account material-symbols-outlined" onClick={userClick}>
                    account_circle
                </div>
            </div>
            {showLogout && 
            <div className='logout' onClick={logoutHandler}>
                Logout
            </div>}
        </div>
    )
}

export default User