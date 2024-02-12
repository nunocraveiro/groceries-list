import { Router } from 'express';
import { addTask, deleteTask, updateTask, getTasksByListId, completeTaskToggle } from 'controllers/tasks.js';
import { hasPermission, isAuthenticated, isOwner } from 'middlewares/index.js';

export default (router: Router) => {
    router.get('/lists/:id', isAuthenticated, hasPermission, getTasksByListId);
    router.post('/lists/:id', isAuthenticated, addTask);
    router.delete('/tasks/:id', isAuthenticated, deleteTask);
    router.patch('/tasks/:id', isAuthenticated, updateTask);
    router.patch('/tasks/:id/complete', isAuthenticated, completeTaskToggle);
}