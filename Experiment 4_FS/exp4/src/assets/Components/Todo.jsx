import React, { useState } from 'react';


function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    setTodos([...todos, input.trim()]);
    setInput('');
  };

  const removeTodo = (idx) => {
    setTodos(todos.filter((_, i) => i !== idx));
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-5 border border-gray-300 rounded-lg bg-white shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Todo App</h2>
      <form onSubmit={addTodo} className="flex gap-2 mb-5">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a todo..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium">Add</button>
      </form>
      <ul className="list-none p-0">
        {todos.length === 0 && <li className="text-gray-500">No todos yet.</li>}
        {todos.map((todo, idx) => (
          <li key={idx} className="flex justify-between items-center mb-2 p-2 bg-gray-50 rounded">
            <span className="text-gray-800">{todo}</span>
            <button onClick={() => removeTodo(idx)} className="bg-red-500 text-white border-none rounded px-3 py-1 cursor-pointer hover:bg-red-600 transition-colors">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;