import { useEffect, useState, MouseEvent, ChangeEvent } from 'react';
import axios from 'axios';
import useTodoStore from '../store/todoStore';
import Task from '../components/Task';
import socket from '../socket';
import './List.css';
import TaskForm from '../components/TaskForm';

const List = () => {
    const tasks = useTodoStore(state => state.tasks);
    const setTasks = useTodoStore(state => state.setTasks);
    const showTasks = useTodoStore(state => state.showTasks);
    const setShowTasks = useTodoStore(state => state.setShowTasks);
    const [openNewTask, setOpenNewTask] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [openShare, setOpenShare] = useState<boolean>(false);
    const listId = window.location.pathname.slice(1);

    const getTasks = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/lists/${window.location.pathname.slice(1)}`);
            return setTasks(res.data);
        } catch (error) {
            return console.log(error);
        }
    }

    useEffect(() => {
        getTasks();
        socket.emit('join list room', window.location.pathname.slice(1));
    }, []);

    window.addEventListener('popstate', () => {
        return socket.emit('leave list room', listId);
    });

    socket.on('new tasks', (newTasks: Record<string, string>[]) => {
        console.log('frontend', newTasks);
        return setTasks(newTasks);
    });

    const handleShareInput = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    
    const handleSubmit = async (e: MouseEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await axios.patch(`http://localhost:4000/lists/${window.location.pathname.slice(1)}/share`, { username: inputValue });
            if (res.status === 200) {
                setInputValue('');
                setOpenShare(false);
                console.log('user added');
            }
        } catch (error) {
            return console.log(error);
        }
    };

    const handleShareClick = () => {
        if (!openShare) {
            return setOpenShare(true);
        }
        return setOpenShare(false);
    }

    const showTodoHandler = () => {
        if (showTasks === 'completed') {
            return setShowTasks('all');
        }
        if (showTasks === 'all') {
            return setShowTasks('completed');
        }
        if (showTasks === 'todos' ) {
            return setShowTasks('');
        }
        return setShowTasks('todos');
    }
    const showCompletedHandler = () => {
        if (showTasks === 'todos') {
            return setShowTasks('all');
        }
        if (showTasks === 'all') {
            return setShowTasks('todos');
        }
        if (showTasks === 'completed' ) {
            return setShowTasks('');
        }
        return setShowTasks('completed');
    }
     
    return (
        <div className='list'>
            <div className='header'>
                <div className='icons_left'>
                    <span className="task_add material-symbols-outlined" onClick={() => setOpenNewTask(true)}>
                        add_circle
                    </span>
                    <div className='filter'>
                        <span className='filter_label'>Show not completed: </span>
                        <span 
                            className={showTasks === 'todos' ||  showTasks === 'all' ? 
                                "filter_toggle show material-symbols-outlined"
                                : "filter_toggle material-symbols-outlined"} 
                            onClick={showTodoHandler}>
                                {showTasks === 'todos' ||  showTasks === 'all' ? 
                                    'check_box' 
                                    : 'check_box_outline_blank'}
                        </span>
                        <span className='filter_label'>Show completed: </span>
                        <span 
                            className={showTasks === 'completed' ||  showTasks === 'all' ? 
                                "filter_toggle show material-symbols-outlined"
                                : "filter_toggle material-symbols-outlined"} 
                            onClick={showCompletedHandler}>
                                {showTasks === 'completed' ||  showTasks === 'all' ? 
                                    'check_box' 
                                    : 'check_box_outline_blank'}
                        </span>
                    </div>
                </div>
                <div className='profile_section'>
                    {openShare && 
                    <form onSubmit={handleSubmit}>
                        <label>
                            Username: 
                            <input
                                className='share_input'
                                value={inputValue}
                                type="text"
                                maxLength={15}
                                onChange={handleShareInput}
                            />
                        </label>
                        <button type="submit">Submit</button>
                    </form>}
                    <span className="share_button material-symbols-outlined" onClick={handleShareClick}>
                        share
                    </span>
                </div>
            </div>
            {openNewTask && 
            <TaskForm setOpen={setOpenNewTask} parentId={''} />
            }
            {(showTasks === 'todos' ||  showTasks === 'all') && 
            <div className='tasks_todo'>
                {tasks.map((task: Record<string, string>) => {
                    if (task.parent_id === '' && task.completed === '0') {
                        return <Task task={task} key={task._id} />
                    }
                })}
            </div>}
            {(showTasks === 'completed' ||  showTasks === 'all') && 
            <div className='tasks_done'>
                {tasks.map((task: Record<string, string>) => {
                    if (task.parent_id === '' && task.completed === '1') {
                        return <Task task={task} key={task._id} />
                    }
                })}
            </div>}
        </div>
    )
}

export default List