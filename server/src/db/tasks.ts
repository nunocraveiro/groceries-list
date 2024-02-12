import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: String },
    parent_id: { type: String },
    completed: { type: String }
})

export const TaskModel = mongoose.model('Task', TaskSchema);

export const getTasks = () => TaskModel.find();
export const getTaskById = (id: string) => TaskModel.findById(id);
export const createTask = (values: Record<string, string>) => new TaskModel(values)
    .save().then(task => task.toObject());
export const deleteTaskById = (id: string) => TaskModel.findOneAndDelete({ _id: id });
export const updateTaskById = (id: string, values: Record<string, string>) => TaskModel.findByIdAndUpdate(id, values, {new: true});