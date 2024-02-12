import { Request, Response, NextFunction } from "express";
import lodash from 'lodash';
import { getUserBySessionToken } from "db/users.js";

// only for users for now
export const isOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const currentUserId = lodash.get(req, 'identity._id' as string);
        if (!currentUserId) {
            return res.sendStatus(403);
        }
        if (currentUserId.toString() !== id) {
            return res.sendStatus(403);
        }
        next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionToken = req.cookies['NUNO-AUTH'];
        if (!sessionToken) {
            return res.sendStatus(403);
        }
        const existingUser = await getUserBySessionToken(sessionToken);
        if (!existingUser) {
            return res.sendStatus(403);
        }
        lodash.merge(req, { identity: existingUser });
        return next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const hasPermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const listId = req.params.id;
        const userId = lodash.get(req, 'identity._id');
        const userListIds = lodash.get(req, 'identity.list_ids' as unknown as string[]);
        if (!userId) {
            return res.sendStatus(403);
        }
        if (userListIds && userListIds.includes(listId)) {
            return next();
        }
        return res.sendStatus(403);
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(403);
    }
}
