// Retrieve todo from local storage or initialize an empty array
let todo = JSON.parse(localStorage.getItem("todo")) || [];
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  addButton.addEventListener("click", addTask);
  todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents default Enter key behavior
      addTask();
    }
  });
  deleteButton.addEventListener("click", deleteAllTasks);
  displayTasks();
  todoList.addEventListener("click", handleListClick); // Add event listener for list clicks
});

function addTask() {
  const newTask = todoInput.value.trim();
  if (newTask === "") {
    alert("Task cannot be empty.");
    return;
  }
  
  // Check for duplicates
  const taskExists = todo.some(task => task.text === newTask);
  if (taskExists) {
    alert("This task already exists.");
    return;
  }

  // Add task if it doesn't exist
  todo.unshift({ text: newTask, disabled: false });
  saveToLocalStorage();
  todoInput.value = "";
  displayTasks();
}

function displayTasks() {
  todoList.innerHTML = "";
  todo.forEach((item, index) => {
    const p = document.createElement("p");
    p.innerHTML = `
      <div class="todo-container">
        <input type="checkbox" class="todo-checkbox" id="input-${index}" ${item.disabled ? "checked" : ""}>
        <p id="todo-${index}" class="${item.disabled ? "disabled" : ""}" onclick="editTask(${index})">${item.text}</p>
        <button class="delete-btn" style="background-color:transparent ;font-size: 1.3rem;cursor: pointer;margin-left: auto;border:none !important"  onclick="deleteTask(${index})">\u00d7</button>
      </div>
    `;
    p.querySelector(".todo-checkbox").addEventListener("change", () =>
      toggleTask(index)
    );
    todoList.appendChild(p);
  });
  todoCount.textContent = todo.length;
}

function editTask(index) {
  const todoItem = document.getElementById(`todo-${index}`);
  const existingText = todo[index].text;
  const inputElement = document.createElement("input");

  inputElement.value = existingText;
  todoItem.replaceWith(inputElement);
  inputElement.focus();

  inputElement.addEventListener("blur", function () {
    const updatedText = inputElement.value.trim();
    if (updatedText) {
      todo[index].text = updatedText;
      saveToLocalStorage();
    }
    displayTasks();
  });
}

function toggleTask(index) {
  todo[index].disabled = !todo[index].disabled;
  saveToLocalStorage();
  displayTasks();
}

function deleteTask(index) {
  todo.splice(index, 1);
  saveToLocalStorage();
  displayTasks();
}

function deleteAllTasks() {
  todo = [];
  saveToLocalStorage();
  displayTasks();
}

function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo));
}

// Handle list item click events
function handleListClick(e) {
  if (e.target.tagName === "P") {
    e.target.classList.toggle("checked");
    saveToLocalStorage();
  } else if (e.target.tagName === "SPAN") {
    const index = Array.from(todoList.children).indexOf(e.target.closest("li"));
    deleteTask(index);
  }
}