const modal = document.getElementById("myModal");
const btn = document.getElementById("add-btn");
const span = document.getElementsByClassName("close")[0];
const todoInput = document.getElementById("todo-input");
const todosListEl = document.getElementById("todos-list");
const NotificationEl = document.querySelector(".notif");


let todos = JSON.parse(localStorage.getItem('todos')) || [];

renderToDo();

btn.onclick = function () {
  modal.style.display = "block";
};

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (evt) {
  if (evt.target == modal) {
    modal.style.display = "none";
  }
};

function saveToDo() {
  const todoValue = todoInput.value;

  const isDuplicate = todos.some(
    (todo) => todo.value.toUpperCase() === todoValue.toUpperCase()
  );
  
  const isEmpty = todoValue === "";

  if (isEmpty) {
    showNotif("You need to type something");
  } else if (isDuplicate) {
    showNotif("ToDo already exists.");
  } else {
    const todo = {
      value: todoValue,
      checked: false,
    };
    todos.push(todo);
    todoInput.value = "";
    renderToDo();
    saveToLocalStorage(); 
    modal.style.display = "none";
  }
}

function renderToDo() {
  todosListEl.innerHTML = "";

  todos.forEach((todo, index) => {
    todosListEl.innerHTML += `<div class="todo" id="${index}">
        ${
          todo.checked
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" data-action="check" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" data-action="check" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/></svg>`
        }
        <p data-action="check" class="${todo.checked ? 'checked' : ''}">${todo.value}</p>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" data-action="edit" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" data-action="delete" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
          </svg>
    </div>`;
  });
}

todosListEl.addEventListener("click", (evt) => {
  const target = evt.target;
  const parEl = target.parentNode;

  if (parEl.className !== "todo") return;

  const todo = parEl;
  const todoId = Number(todo.id);

  const action = target.dataset.action;

  action === "check" && checkToDo(todoId);
  action === "edit" && editToDo(todoId);
  action === "delete" && deleteToDo(todoId);

});

function checkToDo(todoId) {
    todos = todos.map((todo, index) => ({
        ...todo,
        checked: index === todoId ? !todo.checked : todo.checked,
    }));

    renderToDo();
    saveToLocalStorage(); 

}


function deleteToDo(todoId) {
    todos = todos.filter((todo, index) => index !== todoId);
    renderToDo();
    saveToLocalStorage(); 
}


function editToDo(todoId) {
  const todoToEdit = todos[todoId];
  const editModal = document.getElementById("myModal-edit");
  const editInput = document.getElementById("edit-todo-input");
  const editForm = document.getElementById("edit-todo-form");
  const editClose = document.querySelectorAll(".close")[1];
  editInput.value = todoToEdit.value;

  editModal.style.display = "block";

  editClose.onclick = function () {
    editModal.style.display = "none";
  };

  editForm.onsubmit = function(event) {
    event.preventDefault();

    const editedValue = editInput.value.trim();

    if (editedValue === "") {
      showNotif("You need to type something");
      return;
    }

    if (todos.some((todo) => todo.value.toUpperCase() === editedValue.toUpperCase())) {
      showNotif("ToDo already exists.");
      return;
    }

    todos[todoId].value = editedValue;
    editModal.style.display = "none";
    renderToDo();
    saveToLocalStorage();
  };
}



const editButtons = document.querySelectorAll('[data-action="edit"]');
editButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    editToDo(index);
  });
});

function saveToLocalStorage() {
  localStorage.setItem('todos', JSON.stringify(todos)); 
}

function showNotif(msg) {
  NotificationEl.innerHTML = msg;

  NotificationEl.classList.add('notif-enter');

  setTimeout(() => {
    NotificationEl.classList.remove('notif-enter');
  }, 2000);
}


// Filter the todo - completed - not completed
const filterBtn = document.getElementById("filter-btn");
const completedOption = document.getElementById("completed-option");
const nonCompletedOption = document.getElementById("non-completed-option");
const allTaskOption = document.getElementById("all-task-option");
const allTasksHeading = document.getElementById("all-tasks");

let showCompleted = true;

//filter button click function
filterBtn.onclick = function() {
  document.getElementById('filter-dropdown').classList.toggle('show');
}

//on selecting completed in filetr dropdown
completedOption.onclick = function() {
  showCompleted = true;
  filterToDo();
  allTasksHeading.textContent = 'Completed Tasks';
}

//on selecting non-completed in filter dropdown
nonCompletedOption.onclick = function() {
  showCompleted = false;
  filterToDo();
  allTasksHeading.textContent = "Incomplete Tasks";
}

//on selecting all tasks in filter dropdown
allTaskOption.onclick = function() {
  allTasksHeading.textContent = "All Tasks";
  renderToDo();
}

//function to filter the todos
function filterToDo() {
  let filteredTodo = showCompleted ? todos.filter(todo => todo.checked) : todos.filter(todo => !todo.checked);
  filterRenderToDo(filteredTodo);
}

//function to display filtered tasks
function filterRenderToDo(todos) {
  todosListEl.innerHTML = '';

  todos.forEach((todo, index) => {
      todosListEl.innerHTML += `<div class="todo" id="${index}">
          ${
              todo.checked
              ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" data-action="check" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </svg>`
              : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" data-action="check" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/></svg>`
          }
          <p data-action="check">${todo.value}</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" data-action="edit" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" data-action="delete" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
          </svg>
      </div>`;
  });
}





