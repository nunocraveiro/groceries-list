import crypto from 'crypto';

const SECRET = 'NUNO-LIST-API';

export const random = () => crypto.randomBytes(128).toString('base64');

export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
};

export const getUpdatedPrices = (tasks: Record<string, string>[], updatedTaskPrices: Record<string, string>[]) => {
    return tasks.map(task => {
        const updatedTask = updatedTaskPrices.find(el => el._id === task._id);
        if (!updatedTask) {
            return task;
        }
        return {
            ...task,
            price: updatedTask.price,
        };
    })
}