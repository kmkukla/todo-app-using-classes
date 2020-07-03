class Todos {
  constructor() {
    this.todo = [];
  }
  addTodo() {
    this.todo = this.todo.concat({
      name: mainInput.value,
      completed: false,
      id: randomGen(),
    });
  }
  render(parent) {
    ul.innerHTML = "";
    this.todo.forEach((t) => {
      let li = document.createElement("li");
      li.classList.add("li");
      let p = document.createElement("p");
      p.classList.add("task-text");
      p.textContent = t.name;
      let input = document.createElement("input");
      input.setAttribute("type", "checkbox");
      input.checked = t.completed;
      input.checked
        ? (p.style.textDecorationLine = "line-through")
        : (p.style.textDecorationLine = "none");
      input.setAttribute("data-key", t.id);
      input.classList.add("status");
      let deleteBtn = document.createElement("button");
      deleteBtn.setAttribute("data-key", t.id);
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "X";
      deleteBtn.addEventListener("click", deleteTodo);
      input.addEventListener("click", toggle);
      li.append(input, p, deleteBtn);
      parent.append(li);
    });
    itemsLeftText();
  }
}

let newTodo = new Todos();

const mainInput = document.querySelector(".main-input");
const ul = document.querySelector("ul");
const itemsLeft = document.querySelector(".items-left");
const all = document.querySelector(".all");
const active = document.querySelector(".active");
const completed = document.querySelector(".completed");

// add todo
const enterTodo = function (event) {
  if (event.keyCode == 13) {
    newTodo.addTodo();
    event.target.value = "";
    localStorage.setItem("data", JSON.stringify(newTodo.todo));
    newTodo.render(ul);
  }
};

mainInput.addEventListener("keyup", enterTodo);

// delete todo
const deleteTodo = function ({ target }) {
  newTodo.todo = newTodo.todo.filter((t) => target.dataset.key != t.id);
  localStorage.setItem("data", JSON.stringify(newTodo.todo));
  newTodo.render(ul);
};

// mark todo as complete
const toggle = function ({ target }) {
  newTodo.todo = newTodo.todo.map((t) => {
    if (target.dataset.key == t.id) {
      t.completed = !t.completed;
    }
    return t;
  });
  localStorage.setItem("data", JSON.stringify(newTodo.todo));
  newTodo.render(ul);
};

// random id generator
function randomGen(str = "qwertyuio") {
  return (
    str
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("") +
    "_" +
    Math.floor(Math.random() * 1000)
  );
}

// items left text
function itemsLeftText() {
  itemsLeft.textContent = newTodo.todo.filter(
    (t) => t.completed == false
  ).length;
}

// active todos
const activeFunc = function (event) {
  let newtodoActive = new Todos();
  newtodoActive.todo = newTodo.todo.filter((t) => t.completed == false);
  highlightCurrentButton(event.target);
  newtodoActive.render(ul);
};
active.addEventListener("click", activeFunc);

// all todos
const allFunc = function (event) {
  highlightCurrentButton(event.target);
  newTodo.render(ul);
};
all.addEventListener("click", allFunc);

// complete todos
const completeFunc = function (event) {
  let newTodoComplete = new Todos();
  newTodoComplete.todo = newTodo.todo.filter((t) => t.completed);
  highlightCurrentButton(event.target);
  newTodoComplete.render(ul);
};
completed.addEventListener("click", completeFunc);

//active button style
function highlightCurrentButton(button) {
  document
    .querySelectorAll(".details-box button")
    .forEach((btn) => btn.classList.remove("current"));
  button.classList.add("current");
}

// **********
document.addEventListener("DOMContentLoaded", function () {
  const data = (function getLocalStorage() {
    return localStorage.getItem("data")
      ? JSON.parse(localStorage.getItem("data"))
      : [];
  })();
  newTodo.todo = data;
  newTodo.render(ul);
});
