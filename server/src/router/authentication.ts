import { Router } from 'express';
import { register, login, logout } from '../controllers/authentication.js';
import { getUser } from 'controllers/authentication.js';

export default (router: Router) => {
    router.get('/auth', getUser)
    router.post('/auth/register', register);
    router.post('/auth/login', login);
    router.get('/auth/logout', logout);
}