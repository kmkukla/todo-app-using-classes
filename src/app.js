class Todos {
  constructor() {
    this.todo = [];
  }
  addTodo() {
    this.todo.push({
      name: mainInput.value,
      completed: false,
      id: randomGen(),
    });
  }
  render(parent) {
    parent.innerHTML = "";
    this.todo.forEach((task) => {
      let li = document.createElement("li");
      li.classList.add("li");
      let name = document.createElement("p");
      name.classList.add("task-text");
      name.textContent = task.name;
      let status = document.createElement("input");
      status.classList.add("status");
      status.setAttribute("type", "checkbox");
      status.checked = task.completed;
      status.checked
        ? (name.style.textDecorationLine = "line-through")
        : (name.style.textDecorationLine = "none");
      status.setAttribute("data-key", task.id);
      let deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "X";
      deleteBtn.setAttribute("data-key", task.id);
      deleteBtn.addEventListener("click", deleteTodo);
      status.addEventListener("click", toggle);
      li.append(status, name, deleteBtn);
      parent.append(li);
    });
    displayItemsLeft();
  }
}

const todoList = new Todos();

// select elements
const mainInput = document.querySelector(".main-input");
const ul = document.querySelector(".ul");
const itemsLeft = document.querySelector(".items-left");
const all = document.querySelector(".all");
const active = document.querySelector(".active");
const completed = document.querySelector(".completed");

mainInput.addEventListener("keyup", function enterTodo(event) {
  if (event.keyCode == 13 && isValid(event.target.value)) {
    todoList.addTodo();
    event.target.value = "";
    localStorage.setItem("list", JSON.stringify(todoList.todo));
    todoList.render(ul);
    hightLightBtn(all);
  }
});

completed.addEventListener("click", showCompletedTasks);
all.addEventListener("click", showAllTasks);
active.addEventListener("click", showActiveTasks);

document.addEventListener("DOMContentLoaded", function setUpList() {
  const list = (function getLocalStorage() {
    return localStorage.getItem("list")
      ? JSON.parse(localStorage.getItem("list"))
      : [];
  })();
  todoList.todo = list;
  todoList.render(ul);
});

function isValid(taskName) {
  if (taskName != "" && taskName.replace(/\s/g, "").length) return true;
  else return false;
}

function deleteTodo({ target }) {
  todoList.todo = todoList.todo.filter((task) => task.id != target.dataset.key);
  localStorage.setItem("list", JSON.stringify(todoList.todo));
  todoList.render(ul);
  hightLightBtn(all);
}

function toggle({ target }) {
  todoList.todo = todoList.todo.map((task) => {
    if (task.id == target.dataset.key) {
      task.completed = !task.completed;
    }
    return task;
  });
  localStorage.setItem("list", JSON.stringify(todoList.todo));
  todoList.render(ul);
}

function randomGen() {
  return Date.now();
}

function displayItemsLeft() {
  itemsLeft.textContent = todoList.todo.filter(isNotCompleted).length;
}

function isNotCompleted(task) {
  return !task.completed;
}

function showActiveTasks() {
  let todoListActive = new Todos();
  todoListActive.todo = todoList.todo.filter(isNotCompleted);
  todoListActive.render(ul);
  hightLightBtn(active);
}

function showAllTasks() {
  todoList.render(ul);
  hightLightBtn(all);
}

function showCompletedTasks() {
  let todoListCompleted = new Todos();
  todoListCompleted.todo = todoList.todo.filter(function isCompleted(task) {
    return task.completed;
  });
  todoListCompleted.render(ul);
  hightLightBtn(completed);
}

function hightLightBtn(button) {
  document
    .querySelectorAll("button")
    .forEach((btn) => btn.classList.remove("current"));
  button.classList.add("current");
}
