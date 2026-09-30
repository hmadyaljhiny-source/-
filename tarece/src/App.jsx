import { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './components/UserList';
import UserForm from './components/UserForm';

import './App.css';



const API_URL = 'http://localhost:3000/User';

function App() {
  const [User, setTasks] = useState([]);

  useEffect(() => {
    axios.get(API_URL).then((response) => setTasks(response.data));
  }, []);

  const addTask = async (title) => {
    const response = await axios.post(API_URL, { title });
    setTasks([...User, response.data]);
  };

  const updateTask = async (id, title) => {
    const response = await axios.put('${API_URL}/${id}, { title }');
    setTasks(User.map((t) => (t.id === id ? response.data : t)));
  };

  const deleteTask = async (id) => {
    await axios.delete('${API_URL}/${id}');
    setTasks(User.filter((t) => t.id !== id));
  };

  return (
    <div>
      <h1>قائمة المهام</h1>
      <UserForm onAdd={addTask} />
      <UserList User={User} onUpdate={updateTask} onDelete={deleteTask} />
    </div>
  );
}

export default App;