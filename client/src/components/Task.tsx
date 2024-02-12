import { useState, MouseEvent, KeyboardEvent, ChangeEvent, useEffect } from 'react';
import useTodoStore from '../store/todoStore';
import axios from 'axios';
import './Task.css';
import TaskForm from './TaskForm';
import socket from '../socket';

interface Props {
    task: Record<string, string>
}

const Task = ({ task }: Props) => {
    const tasks = useTodoStore(state => state.tasks);
    const showTasks = useTodoStore(state => state.showTasks);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editedTask, setEditedTask] = useState<Record<string, string> | null>(null);
    const [openNewSubtask, setOpenNewSubtask] = useState<boolean>(false);
    const [showSubtasks, setShowSubtasks] = useState<boolean>(false);
    const [subtasks, setSubtasks] = useState<Record<string, string>[]>([])

    useEffect(() => {
        return setSubtasks(tasks.filter(subtask => subtask.parent_id === task._id));
    }, [tasks])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEditedTask({...editedTask, [e.target.id]: e.target.value});
    };

    const expandHandler = () => {
        if (!showSubtasks) {
            return setShowSubtasks(true);
        }
        return setShowSubtasks(false);
    }

    const openNewHandler = () => {
        setOpenNewSubtask(true);
        setShowSubtasks(true);
    }

    const taskClick = (e: MouseEvent<HTMLSpanElement>) => {
        const target = e.target as HTMLElement;
        if (editMode && (
                target.className === 'task_card' || 
                target.className === 'task_actions' || 
                target.className === 'task_icons'
            )) {
            editTask();
            return setEditMode(false);
        }
    }
    const enterHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            editTask();
            return setEditMode(false);
        }
    }

    const editTask = async () => {
        if (!editedTask) return;
        editedTask.parent_id = task.parent_id;
        try {
            const res = await axios.patch(`http://localhost:4000/tasks/${task!._id}`, { 
                task: editedTask,
                tasks: tasks,
                prevPrice: task.price
            });
            setEditedTask(null);
            return socket.emit('task edited', 
                res.data, 
                tasks, 
                window.location.pathname.slice(1)
            );
        } catch (error) {
            return console.log(error);
        }
    }

    const deleteTask = async () => {
        const config = {
            data: {
                listId: window.location.pathname.slice(1),
                tasks: tasks
            }
        }
        try {
            const res = await axios.delete(`http://localhost:4000/tasks/${task!._id}`, config);
            return socket.emit('task deleted', 
                res.data, 
                tasks, 
                window.location.pathname.slice(1)
            );
        } catch (error) {
            return console.log(error);
        }
    }

    const completeTask = async () => {
        try {
            const res = await axios.patch(`http://localhost:4000/tasks/${task!._id}/complete`, { 
                newValue: task.completed === '0' ? '1' : '0' 
            });
            return socket.emit('task completed', 
                res.data, 
                tasks, 
                window.location.pathname.slice(1)
            );
        } catch (error) {
            return console.log(error);
        }
    }

    return (
        <div className='task_container'>
            <div className={task.completed === '0' ? 'task_card' : 'task_card completed'} onClick={taskClick}>
                <span 
                    className={task.completed === '0' ? 
                        'material-symbols-outlined toggle' 
                        : 'material-symbols-outlined toggle_completed'}
                    onClick={completeTask}>
                        {task.completed === '0' ? 'radio_button_unchecked' : 'check_circle'}
                </span>
                <div className='task_info'>
                    <input 
                        className="task_title" 
                        id='title'
                        type='text' 
                        defaultValue={task.title}
                        maxLength={40} 
                        disabled={editMode ? false : true}
                        placeholder={editMode ? 'Title (required)' : ''}
                        onChange={handleChange}
                        onKeyDown={enterHandler}>
                    </input>
                    <input 
                        className="task_description"
                        id='description'
                        type='text' 
                        defaultValue={task.description}
                        maxLength={53} 
                        disabled={editMode ? false : true}
                        placeholder={editMode ? 'Description' : ''}
                        onChange={handleChange}
                        onKeyDown={enterHandler}>
                    </input>
                </div>
                <div className='task_actions'>
                    <div className='task_icons'>
                        <span 
                            className="task_edit material-symbols-outlined" 
                            onClick={() => setEditMode(true)}>
                                edit
                        </span>
                        <span 
                            className="task_delete material-symbols-outlined" 
                            onClick={deleteTask}>
                                delete
                        </span>
                    </div>
                    <div className='task_total'>
                        <input 
                            className="task_kr"
                            id='price'
                            type='text'
                            defaultValue={task.price}
                            maxLength={10}
                            disabled={editMode && !subtasks.some(el => el.price !== '') ? false : true}
                            placeholder={editMode ? 'Price' : ''}
                            onChange={handleChange}
                            onKeyDown={enterHandler}>
                        </input>
                        {(task.price !== '' || editMode) && <span>kr.</span>}
                    </div>
                </div>
                <div className='task_icons2'>
                    <span 
                        className="task_add_subtask material-symbols-outlined" 
                        onClick={openNewHandler}>
                            add_circle
                    </span>
                    <span 
                        className="task_expand material-symbols-outlined" 
                        onClick={expandHandler}>
                            expand_more
                    </span>
                </div>
            </div>
            <div className='subtask'>
                {openNewSubtask && 
                <TaskForm setOpen={setOpenNewSubtask} parentId={task._id} />
                }
                {(showTasks === 'todos' ||  showTasks === 'all') && 
                <div className='tasks_todo'>
                    {(subtasks.length > 0 && showSubtasks) && subtasks.map(subtask => {
                        if (subtask.completed === '0') {
                            return <Task task={subtask} key={subtask._id} />
                        }
                    })}
                </div>}
                {(showTasks === 'completed' ||  showTasks === 'all') && 
                <div className='tasks_done'>
                    {(subtasks.length > 0 && showSubtasks) && subtasks.map(subtask => {
                        if (subtask.completed === '1') {
                            return <Task task={subtask} key={subtask._id} />
                        }
                    })}
                </div>}
            </div>
        </div>
    )   
}

export default Task;
