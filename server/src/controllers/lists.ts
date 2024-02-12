import { Request, Response } from 'express';
import { createList, deleteListById, getListById, updateListById } from 'db/lists.js';
import { getUserById, getUserBySessionToken, getUserByUsername, updateUserById } from 'db/users.js';
import { deleteTaskById } from 'db/tasks.js';

export const getListsByUserId = async (req: Request, res: Response) => {
    try {
        const sessionToken = req.cookies['NUNO-AUTH'];
        if (!sessionToken) {
            return res.sendStatus(403);
        }
        const existingUser = await getUserBySessionToken(sessionToken);
        const listIds = existingUser.list_ids;
        const lists: Record<string, any>[] = [];
        for (const listId of listIds) {
            const list = await getListById(listId);
            lists.push(list);
        }
        return res.status(200).json(lists);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const addList = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.sendStatus(400);
        }
        const sessionToken = req.cookies['NUNO-AUTH'];
        if (!sessionToken) {
            return res.sendStatus(403);
        }
        const existingUser = await getUserBySessionToken(sessionToken);
        const user_id = existingUser._id;
        const task_ids: string[] = [];
        const sharedWith: string[] = [];
        const list = await createList({
            name,
            user_id,
            sharedWith,
            task_ids
        });
        updateUserById(user_id.toString(), { list_ids: [...existingUser.list_ids, list._id] });
        return res.status(200).json(list);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteList = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const sessionToken = req.cookies['NUNO-AUTH'];
        if (!sessionToken) {
            return res.sendStatus(403);
        }
        const existingUser = await getUserBySessionToken(sessionToken);
        const deletedList = await deleteListById(id);
        deletedList.sharedWith.forEach(async userId => {
            const user = await getUserById(userId);
            updateUserById(userId, { list_ids: user.list_ids.filter((listId: string) => listId !== id) });
        })
        deletedList.task_ids.forEach(async taskId => {
            await deleteTaskById(taskId);
        })
        updateUserById(existingUser._id.toString(), { list_ids: existingUser.list_ids.filter(listId => listId !== id) });
        return res.status(200).send(deletedList);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateList = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        if (!name) {
            return res.sendStatus(400);
        }
        const list = await getListById(id);
        list.name = name;
        await list.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const addUserShare = async (req: Request, res: Response) => {
    try {
        const { username } = req.body;
        const listId = req.params.id;
        if (!username) {
            return res.sendStatus(400);
        }
        const user = await getUserByUsername(username)
        const list = await getListById(listId);
        if (list.sharedWith.includes(user._id.toString()) || user.list_ids.includes(listId)) {
            return res.status(403).send({
                message: 'User already added'
            });
        }
        updateUserById(user._id.toString(), { list_ids: [...user.list_ids, listId] });
        updateListById(listId, { sharedWith: [...list.sharedWith, user._id] });
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}