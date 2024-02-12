import mongoose from "mongoose";

const ListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user_id: { type: String, required: true },
    sharedWith: [{ type: String }],
    task_ids: [{ type: String }]
})

export const ListModel = mongoose.model('List', ListSchema);

export const getLists = () => ListModel.find();
export const getListById = (id: string) => ListModel.findById(id);
export const createList = (values: Record<string, any>) => new ListModel(values)
    .save().then(list => list.toObject());
export const deleteListById = (id: string) => ListModel.findOneAndDelete({ _id: id });
export const updateListById = async (id: string, values: Record<string, any>) => await ListModel.findByIdAndUpdate(id, values);
