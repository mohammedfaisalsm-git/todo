document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const dueDateInput = document.getElementById("dueDateInput");
    const categorySelect = document.getElementById("categorySelect");
    const notesInput = document.getElementById("notesInput");
    const addTaskButton = document.getElementById("addTaskButton");
    const taskList = document.getElementById("taskList");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const noTasksMessage = document.getElementById("noTasksMessage");
  
    let todolist = JSON.parse(localStorage.getItem("todos")) || [];
  
    // Request permission for notifications
    if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                console.log("Notifications have been enabled.");
            } else {
                console.log("Notifications are not enabled.");
            }
        });
    }
  
    // Save tasks to local storage
    const saveTasks = () => {
        localStorage.setItem("todos", JSON.stringify(todolist));
    };
  
    // Schedule notifications
    const scheduleNotification = (todo) => {
        if (Notification.permission === "granted" && todo.dueDate && new Date(todo.dueDate) > new Date()) {
            const timeToNotify = new Date(todo.dueDate) - new Date();
            if (timeToNotify > 0) { // Ensure notification is set in the future
                setTimeout(() => {
                    new Notification(`Reminder: Task "${todo.text}" is due!`);
                }, timeToNotify);
            }
        }
    };
  
    // Render tasks on the page
    const renderTasks = () => {
        taskList.innerHTML = "";
        if (todolist.length === 0) {
            noTasksMessage.style.display = "block";
        } else {
            noTasksMessage.style.display = "none";
            todolist.forEach((todo) => {
                const taskItem = document.createElement("div");
                taskItem.className = `task-item ${todo.isComplete ? "line-through" : ""}`;
                taskItem.innerHTML = `
                    <div class="task-header">
                        <span class="task-text ${todo.isComplete ? "completed" : ""}" onclick="toggleTask(${todo.id})">${todo.text}</span>
                        <button class="delete-btn" onclick="deleteTask(${todo.id})">&times;</button>
                    </div>
                    ${todo.dueDate ? `<div class="task-detail">Due Date: ${new Date(todo.dueDate).toLocaleString()}</div>` : ""}
                    ${todo.category ? `<div class="task-detail">Category: ${todo.category}</div>` : ""}
                    ${todo.notes ? `<div class="task-detail">Notes: ${todo.notes}</div>` : ""}
                `;
                taskList.appendChild(taskItem);
            });
        }
    };
  
    // Add a new task
    const addTask = () => {
        const inputText = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const category = categorySelect.value;
        const notes = notesInput.value;
  
        if (!inputText) return;
  
        const newTodo = {
            id: Date.now(),
            text: inputText,
            isComplete: false,
            dueDate,
            category,
            notes,
        };
  
        todolist.push(newTodo);
        saveTasks();
        renderTasks();
        scheduleNotification(newTodo);
  
        // Clear input fields after adding a task
        taskInput.value = "";
        dueDateInput.value = "";
        categorySelect.value = "";
        notesInput.value = "";
    };
  
    // Toggle task completion
    window.toggleTask = (id) => {
        todolist = todolist.map((todo) =>
            todo.id === id ? { ...todo, isComplete: !todo.isComplete } : todo
        );
        saveTasks();
        renderTasks();
    };
  
    // Delete a task
    window.deleteTask = (id) => {
        todolist = todolist.filter((todo) => todo.id !== id);
        saveTasks();
        renderTasks();
    };
  
    // Event listener to add a task
    addTaskButton.addEventListener("click", addTask);
  
    // Toggle dark mode
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        darkModeToggle.textContent = document.body.classList.contains("dark-mode")
            ? "Light Mode"
            : "Dark Mode";
    });
  
    // Render tasks on initial load
    renderTasks();
});
