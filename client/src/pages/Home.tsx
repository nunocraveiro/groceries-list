import axios from "axios";
import { useEffect, useState, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';
import ListForm from "../components/ListForm";

export interface List {
  _id: string,
  name: string,
  user_id: string,
  sharedWith: string[],
  task_ids: string[]
}

const Home = () => {
  const [lists, setLists] = useState<List[]>([]);
  const navigate = useNavigate();
  const [openNewList, setOpenNewList] = useState<boolean>(false);
  
  const getLists = async () => {
    try {
        const res = await axios.get('http://localhost:4000/lists');
        setLists(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getLists();
  }, []);

  const toggleNewList = () => {
    if (openNewList) {
        return setOpenNewList(false);
    }
    return setOpenNewList(true);
  }

  const deleteList = async (e: MouseEvent<HTMLSpanElement>) => {
    try {
      const target = e.target as HTMLElement;
      const res = await axios.delete(`http://localhost:4000/lists/${target.parentElement!.id}`);
      return setLists(lists.filter(el => el._id !== res.data._id));
    } catch (error) {
      return console.log(error);
    }
  }

  const listClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.className.includes('list_delete')) {
      return deleteList(e);
    }
    return navigate(`/${e.currentTarget.id}`);
  }

  return (
    <div className="home">
      <span className="task_add material-symbols-outlined" onClick={toggleNewList}>
        add_circle
      </span>
      <div className="lists">
        {openNewList && 
        <ListForm setOpen={setOpenNewList} lists={lists} setLists={setLists} />
        }
        {lists.map((list: List) => 
          <div className="list_card" id={list._id} key={list._id} onClick={listClick}>
            <p className="list_name">{list.name}</p>
            <span className="list_delete material-symbols-outlined">
                  delete
            </span>
          </div>)
        }
      </div>
    </div>
  )
}

export default Home;