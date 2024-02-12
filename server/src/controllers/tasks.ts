import { Request, Response } from 'express';
import { createTask, deleteTaskById, getTaskById, updateTaskById } from 'db/tasks.js';
import { getListById, updateListById } from 'db/lists.js';

export const getTasksByListId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const list = await getListById(id);
        const tasks: Record<string, any>[] = [];
        for (const taskId of list.task_ids) {
            const task = await getTaskById(taskId);
            if (task) tasks.push(task);
        }
        return res.status(200).json(tasks);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const addTask = async (req: Request, res: Response) => {
    try {
        const { title, description, price, parent_id, completed } = req.body.task;
        const { tasks } = req.body;
        const { id } = req.params;
        if (!title) {
            return res.sendStatus(400);
        }
        const task = await createTask({
            title,
            description,
            price,
            parent_id,
            completed
        });
        const list = await getListById(id);
        updateListById(id, { task_ids: [...list.task_ids, task._id] });
        const updatedTaskPrices: Record<string, any>[] = [];
        if (parent_id !== '' && task.price !== '') {
            await updateAllPrices(task, tasks, price, '', updatedTaskPrices);
            return res.status(200).json({ task: task, updatedTaskPrices: updatedTaskPrices });
        }
        return res.status(200).json({ task: task, updatedTaskPrices: updatedTaskPrices });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateTask = async (req: Request, res: Response) => {
    try {
        const { title, description, price, parent_id, completed } = req.body.task;
        const { tasks, prevPrice } = req.body;
        const { id } = req.params;
        const task = await updateTaskById(id, { title: title, description: description, price: price, completed: completed });
        const updatedTaskPrices: Record<string, any>[] = [];
        if (parent_id !== '') {
            await updateAllPrices(task, tasks, price, prevPrice, updatedTaskPrices);
            return res.status(200).json({ task: task, updatedTaskPrices: updatedTaskPrices });
        }
        return res.status(200).json({ task: task, updatedTaskPrices: updatedTaskPrices });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { listId, tasks } = req.body;
        const list = await getListById(listId);
        await deleteSubtasks(tasks, id, list._id.toString(), list.task_ids);
        updateListById(list._id.toString(), { task_ids: list.task_ids.filter(taskId => taskId !== id) });
        const deletedTask = await deleteTaskById(id);
        const updatedTaskPrices: Record<string, any>[] = [];
        if (deletedTask.parent_id !== '') {
            await updateAllPrices(deletedTask, tasks, '', deletedTask.price, updatedTaskPrices);
            return res.status(200).json({ task: deletedTask, updatedTaskPrices: updatedTaskPrices });
        }
        return res.status(200).json({ task: deletedTask, updatedTaskPrices: updatedTaskPrices });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const completeTaskToggle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { newValue } = req.body;
        const task = await updateTaskById(id, { completed: newValue });
        return res.status(200).json({ task: task });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

const checkPrice = (parentPrice: string, newPrice: string, prevPrice:  string) => {
    const calcPrice = Number(parentPrice) + (Number(newPrice) - Number(prevPrice));
    const updatedPrice = !Number.isInteger(calcPrice) ? calcPrice.toFixed(2) : calcPrice.toString();
    return updatedPrice === '0' ? '' : updatedPrice;
}

const updateAllPrices = async (task: Record<string, any>, tasks: Record<string, string>[], newPrice: string, prevPrice: string, updatedTaskPrices: Record<string, any>[]) => {
    const parentTask = await getTaskById(task.parent_id);
    const parentPrevPrice = parentTask.price;
    let updatedPrice = '';

    if (tasks.filter(el => el.parent_id === task.parent_id).length < 1) {
        updatedPrice = task.price;
        updatedTaskPrices.push(await updateTaskById(task.parent_id, { price: updatedPrice }));
    }
    else {
        updatedPrice = checkPrice(parentTask.price, newPrice, prevPrice)
        updatedTaskPrices.push(await updateTaskById(task.parent_id, { price: updatedPrice }));
    }

    if (parentTask.parent_id !== '') {
        await updateAllPrices(parentTask, tasks, updatedPrice, parentPrevPrice, updatedTaskPrices);
        return updatedTaskPrices;
    }
    else {
        return updatedTaskPrices;
    }
}

const deleteSubtasks: any = async (tasks: Record<string, string>[], taskId: string, listId: string, taskIds: string[]) => {
    const subtasks = tasks.filter((subtask: Record<string, string>) => subtask.parent_id === taskId);
    if(subtasks.length === 0) return;

    subtasks.forEach(subtask => {
        taskIds.splice(taskIds.findIndex(el => el === subtask._id), 1);
    })
    updateListById(listId, { task_ids: taskIds });

    for (const subtask of subtasks) {
        await deleteTaskById(subtask._id);
        deleteSubtasks(tasks, subtask._id, listId, taskIds);
    }
        
}