import React, { useState, useEffect } from "react";
import axios from "axios";
import TodoForm from "./TodoForm";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTodos();
  }, [currentPage]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/todos/?page=${encodeURIComponent(
          currentPage
        )}`
      );
      setTodos(response.data.results);
      setTotalPages(Math.ceil(response.data.count / response.data.page_size));
    } catch (error) {
      console.log("Error fetching todos", error);
    }
  };

  const createTodo = async (task, dueDate) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/todos/", {
        task,
        due_at: dueDate,
      });
      setTodos([...todos, response.data]);
    } catch (error) {
      console.log("Error creating todo", error);
    }
  };

  const updateTodo = async (id, updatedTask, completed, dueDate) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/todos/${id}/`,
        {
          task: updatedTask,
          completed,
          due_at: dueDate,
        }
      );
      setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
    } catch (error) {
      console.log("Error updating todo", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/todos/${id}/`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.log("Error deleting todo", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pendingTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <>
      <h1>Todos List</h1>
      <TodoForm onSubmit={createTodo} />
      <h2>Pending Tasks</h2>
      <ul>
        {pendingTodos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() =>
                updateTodo(todo.id, todo.task, !todo.completed, todo.due_at)
              }
            />
            {todo.completed ? <del>{todo.task}</del> : todo.task}
            <span>Due: {new Date(todo.due_at).toLocaleString()}</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            <button
              onClick={() =>
                updateTodo(
                  todo.id,
                  prompt("Enter new task:", todo.task),
                  todo.completed,
                  todo.due_at
                )
              }
            >
              Edit
            </button>
          </li>
        ))}
      </ul>

      <h2>Completed Tasks</h2>
      <ul>
        {completedTodos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() =>
                updateTodo(todo.id, todo.task, !todo.completed, todo.due_at)
              }
            />
            {todo.completed ? <del>{todo.task}</del> : todo.task}
            <span>Due: {new Date(todo.due_at).toLocaleString()}</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            <button
              onClick={() =>
                updateTodo(
                  todo.id,
                  prompt("Enter new task:", todo.task),
                  todo.completed,
                  todo.due_at
                )
              }
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TodoList;
