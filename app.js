//import modules
const express = require('express');
const fs = require('fs');
const Todo = require('./Todo');


const app = express();
const port = 3000;

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

//load from json
const loadTodos = () => {
  try {
    const data = fs.readFileSync('todos.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

//save to json
const saveTodos = (todos) => {
  fs.writeFileSync('todos.json', JSON.stringify(todos), 'utf8');
};

//redirect to todos
app.get('/', (req, res) => {
  res.redirect('/todos');
});

//routes for todos
app.get('/todos', (req, res) => {
  const todos = loadTodos();
  res.render('todos', { todos });
});

//create new todo, save to json, redirect to todos
app.post('/todos', (req, res) => {
  const { task } = req.body;
  const todos = loadTodos();
  const newTodo = new Todo(Date.now(), task, false);
  todos.push(newTodo);
  saveTodos(todos);
  res.redirect('/todos');
});

//update todo status, save to json
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const todos = loadTodos();
  const todoToUpdate = todos.find(todo => todo.id === parseInt(id));
  if (todoToUpdate) {
    todoToUpdate.completed = !todoToUpdate.completed;
    saveTodos(todos);
    res.json(todoToUpdate);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

//delete todo, save to json
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  const todos = loadTodos();
  const updatedTodos = todos.filter(todo => todo.id !== parseInt(id));
  saveTodos(updatedTodos);
  res.json({ success: true });
});

//start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
