import { Router } from 'express';
import { addList, deleteList, updateList, getListsByUserId, addUserShare } from 'controllers/lists.js';
import { isAuthenticated, isOwner } from 'middlewares/index.js';

export default (router: Router) => {
    router.get('/lists', isAuthenticated, getListsByUserId);
    router.post('/lists', isAuthenticated, addList);
    router.delete('/lists/:id', isAuthenticated, /* isOwner, */ deleteList);
    router.patch('/lists/:id', isAuthenticated, isOwner, updateList);
    router.patch('/lists/:id/share', isAuthenticated, addUserShare);
}