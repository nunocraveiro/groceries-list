import { Request, Response } from 'express';
import { getUserByEmail, createUser, getUserBySessionToken } from '../db/users.js';
import { random, authentication } from '../helpers/index.js';

export const getUser = async (req: Request, res: Response) => {
    try {
        const sessionToken = req.cookies['NUNO-AUTH'];
        if (!sessionToken) {
            return res.sendStatus(403);
        }
        const existingUser = await getUserBySessionToken(sessionToken);
        if (!existingUser) {
            return res.sendStatus(403);
        }
        return res.status(200).json(existingUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.sendStatus(400);
        }
        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if (!user) {
            console.log('no user');
            return res.sendStatus(400);
        }
        const expectedHash = authentication(user.authentication.salt, password);
        if (user.authentication.password !== expectedHash) {
            console.log('wrong passy');
            return res.sendStatus(403);
        }
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());
        await user.save();
        res.cookie('NUNO-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/'});
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const list_ids: string[] = [];
        if (!username || !email || !password) {
            return res.sendStatus(400);
        }
        if (await getUserByEmail(email)) {
            return res.sendStatus(400);
        }
        const salt = random();
        const user = await createUser({
            email,
            username,
            list_ids,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        });
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        const sessionToken = req.cookies['NUNO-AUTH'];
        if (!sessionToken) {
            return res.sendStatus(403);
        }
        return res.clearCookie('NUNO-AUTH').sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}