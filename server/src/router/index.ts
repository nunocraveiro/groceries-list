import { Router } from 'express';
import authentication from './authentication.js';
import users from './users.js';
import lists from './lists.js';
import tasks from './tasks.js';

const router = Router();

export default (): Router => {
    authentication(router);
    users(router);
    lists(router);
    tasks(router);
    return router;
}