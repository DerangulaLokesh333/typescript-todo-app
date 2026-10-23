"use strict";
const STORAGE_KEY = "typescript-todo-tasks";
const taskForm = document.getElementById("task-form");
const taskNameInput = document.getElementById("task-name");
const dueDateInput = document.getElementById("due-date");
const taskList = document.getElementById("task-list");
const message = document.getElementById("message");
let tasks = loadTasks();
function loadTasks() {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (!savedTasks) {
        return [];
    }
    try {
        const parsed = JSON.parse(savedTasks);
        if (!Array.isArray(parsed)) {
            return [];
        }
        return parsed.filter((item) => typeof item.id === "number" &&
            typeof item.name === "string" &&
            typeof item.dueDate === "string" &&
            typeof item.completed === "boolean");
    }
    catch {
        return [];
    }
}
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
function renderTasks() {
    taskList.replaceChildren();
    if (tasks.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.textContent = "No tasks yet. Add your first task!";
        taskList.appendChild(emptyItem);
        return;
    }
    tasks.forEach((task) => {
        const listItem = document.createElement("li");
        listItem.className = "task-item";
        const taskDetails = document.createElement("div");
        taskDetails.className = "task-details";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", `Mark ${task.name} as completed`);
        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });
        const taskText = document.createElement("span");
        taskText.textContent = task.name;
        taskText.className = task.completed ? "completed" : "";
        const dateText = document.createElement("small");
        dateText.textContent = `Due: ${task.dueDate}`;
        taskDetails.append(checkbox, taskText, dateText);
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });
        listItem.append(taskDetails, deleteButton);
        taskList.appendChild(listItem);
    });
}
function addTask(name, dueDate) {
    const newTask = {
        id: Date.now(),
        name,
        dueDate,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
}
function toggleTask(id) {
    tasks = tasks.map((task) => task.id === id
        ? { ...task, completed: !task.completed }
        : task);
    saveTasks();
    renderTasks();
}
function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
}
taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = taskNameInput.value.trim();
    const dueDate = dueDateInput.value;
    if (!name || !dueDate) {
        message.textContent = "Please enter a task name and due date.";
        return;
    }
    addTask(name, dueDate);
    taskForm.reset();
    message.textContent = "Task added successfully.";
});
renderTasks();
