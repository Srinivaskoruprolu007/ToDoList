document.addEventListener("DOMContentLoaded", () => {
  let taskInput = document.getElementById("taskInput");
  let addButton = document.getElementById("addButton");
  let taskList = document.getElementById("taskList");
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Render all tasks on load
  renderAllTasks();

  // Event Listeners
  addButton.addEventListener("click", addTask);
  taskInput.addEventListener("keydown", (e) => e.key === "Enter" && addTask());

  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;
    const newTask = { id: Date.now(), text: taskText, completed: false };
    tasks.push(newTask);
    saveTasks();
    renderTask(newTask);
    taskInput.value = "";
  }

  function renderTask(task) {
    const li = createTaskElement(task);
    taskList.appendChild(li);
  }

  function createTaskElement(task) {
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);
    li.innerHTML = `
        <span class="m-4">${task.text}</span>
        <button class="px-4 py-2 bg-red-600 hover:bg-red-900 transition-colors rounded-md">Delete</button>
      `;
    applyTaskStyles(li, task);
    addTaskEventListeners(li, task);
    return li;
  }

  function applyTaskStyles(li, task) {
    li.style.backgroundColor = "#1A1A1A";
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.justifyContent = "space-between";
    li.style.marginBottom = "10px";
    li.style.padding = "5px";
    li.style.borderRadius = "5px";
    li.style.cursor = "pointer";

    if (task.completed) {
      let span = li.querySelector("span");
      span.style.textDecoration = "line-through";
    }
  }

  function addTaskEventListeners(li, task) {
    const deleteButton = li.querySelector("button");
    deleteButton.addEventListener("click", () => deleteTask(task.id, li));
    li.addEventListener("click", () => toggleTaskCompletion(task, li));
  }

  function deleteTask(taskId, taskElement) {
    tasks = tasks.filter((t) => t.id !== taskId);
    saveTasks();
    taskElement.remove();
  }

  function toggleTaskCompletion(task, li) {
    task.completed = !task.completed;
    saveTasks();
    li.querySelector("span").style.textDecoration = task.completed
      ? "line-through"
      : "none";
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderAllTasks() {
    clearTaskList();
    tasks.forEach((task) => renderTask(task));
  }

  function clearTaskList() {
    taskList.innerHTML = "";
  }
});
