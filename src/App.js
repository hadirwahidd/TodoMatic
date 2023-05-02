import React, { useState } from "react";
import { nanoid } from "nanoid";
import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";

// Defining outside App function to avoid recalculating every time App component re-renders

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed
};

// here we are using the Object.keys() method to collect an array of FILTER_NAMES
const FILTER_NAMES = Object.keys(FILTER_MAP);

function App({ data }) {

  const [tasks, setTasks] = useState(data);
  const [filter, setFilter] = useState('All');


  const addTask = (name) => {
    const newTask = { id: `todo-${nanoid()}`, name, completed: false };
    setTasks([...tasks, newTask]);
  };

  /* Here, we define an updatedTasks constant that maps over
  the original tasks array. If the task's id property matches
  the id provided to the function, we use object spread syntax
  to create a new object, and toggle the completed property of
  that object before returning it. If it doesn't match, we return
  the original object. Then we call setTasks() with this new array
  in order to update our state.*/
  const toggleTaskCompleted = (id) => {
    const updatedTasks = tasks?.map((task) => {
      if (id === task.id) {
        // make a new object whose 'completed' prop has been inverted
        return { ...task, completed: !task.completed }
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    /* A new array to render that copies the existing tasks,
    excluding the task whose ID matches the one passed into
    deleteTask() [in Todo.js]*/
    const remainingTasks = tasks?.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  };

  const editTask = (id, newName) => {
    const editedTasks = tasks?.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName }
      }
      return task;
    });
    setTasks(editedTasks);
  };

  const taskList = tasks?.filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        key={task.id}
        id={task.id}
        name={task.name}
        completed={task.completed}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  const tasksNoun = taskList.length === 1 ? "task" : "tasks";

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>

      <Form addTask={addTask} />

      <div className="filters btn-group stack-exception">
        {FILTER_NAMES.map((name) => (
          <FilterButton
            key={name}
            name={name}
            isPressed={name === filter}
            setFilter={setFilter}
          />
        ))}
      </div>

      <h2 id="list-heading">{`${taskList.length} ${tasksNoun} remaining`}</h2>

      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;
