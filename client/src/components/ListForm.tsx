import { ChangeEvent, useState, KeyboardEvent, useRef, useEffect } from "react";
import { List } from "../pages/Home";
import axios from "axios";
import '../pages/List.css';

interface Props {
    setOpen: (value: boolean) => void,
    lists: List[],
    setLists: (newLists: List[]) => void
}

const ListForm = ({ setOpen, lists, setLists }: Props) => {
    const [newListName, setNewListName] = useState<string | null>('');
    const nameRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewListName(e.target.value);
    };

    const keyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            return addList();
        }
        if (e.key === 'Escape') {
            return closeHandler();
        }
    }

    const closeHandler = () => {
        return setOpen(false);
    }

    const addList = async () => {
        if (!newListName) {
            return;
        }
        try {
            const res = await axios.post('http://localhost:4000/lists', { name: newListName });
            setNewListName(null);
            setOpen(false);
            return setLists([...lists, res.data]);
        } catch (error) {
            return console.log(error);
        }
    }

    useEffect(() => {
        nameRef.current!.focus();
    }, [])

    return (
        <div className="list_card">
            <input 
                className="list_name" 
                id='name'
                type='text'
                maxLength={50}
                placeholder={'Name'}
                onChange={handleChange}
                onKeyDown={keyDownHandler}
                ref={nameRef}>
            </input>
            <span 
                className="list_delete material-symbols-outlined" 
                onClick={closeHandler}>
                    cancel
            </span>
        </div>
    )
}

export default ListForm;