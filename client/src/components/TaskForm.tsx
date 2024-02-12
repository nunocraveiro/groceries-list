import { ChangeEvent, useState, KeyboardEvent, useRef, useEffect } from "react";
import useTodoStore from "../store/todoStore";
import axios from "axios";
import socket from "../socket";
import './Task.css';

interface Props {
    parentId: string
    setOpen: (value: boolean) => void,
}

const TaskForm = ({ parentId, setOpen }: Props) => {
    const tasks = useTodoStore(state => state.tasks);
    const [newTask, setNewTask] = useState<Record<string, string> | null>(null);
    const titleRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        titleRef.current!.focus();
    }, [])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTask({...newTask, [e.target.id]: e.target.value});
    };

    const keyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            return addTask();
        }
        if (e.key === 'Escape') {
            return closeHandler();
        }
    }

    const closeHandler = () => {
        return setOpen(false);
    }

    const addTask = async () => {
        if (!newTask) {
            return;
        }
        newTask.completed = '0';
        newTask.parent_id = parentId;
        if (!newTask.price) newTask.price = '';
        try {
            const res = await axios.post(`http://localhost:4000/lists/${window.location.pathname.slice(1)}`, { 
                task: newTask,
                tasks: tasks
            });
            setNewTask(null);
            setOpen(false);
            return socket.emit('task added', 
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
            <div className='task_card'>
                <div className='toggle'></div>
                <div className='task_info'>
                    <input 
                        className="task_title" 
                        id='title'
                        type='text'
                        maxLength={40}
                        placeholder={'Title (required)'}
                        onChange={handleChange}
                        onKeyDown={keyDownHandler}
                        ref={titleRef}>
                    </input>
                    <input 
                        className="task_description"
                        id='description'
                        type='text'
                        maxLength={53}
                        placeholder={'Description'}
                        onChange={handleChange}
                        onKeyDown={keyDownHandler}>
                    </input>
                </div>
                <div className='task_actions'>
                    <div className='task_icons'>
                        <span 
                            className="task_edit material-symbols-outlined" 
                            >
                        </span>
                        <span 
                            className="task_delete material-symbols-outlined" 
                            >
                        </span>
                    </div>
                    <div className='task_total'>
                        <input 
                            className="task_kr"
                            id='price'
                            type='text'
                            maxLength={10}
                            placeholder={'Price'}
                            onChange={handleChange}
                            onKeyDown={keyDownHandler}>
                        </input>
                        <span>kr.</span>
                    </div>
                </div>
                <div className='task_icons2'>
                    <span 
                        className="task_add_subtask material-symbols-outlined" 
                        onClick={closeHandler}>
                            cancel
                    </span>
                </div>
            </div>
        </div>
    )   
}

export default TaskForm;