const myForm = document.getElementById("myForm");
const myInput = document.getElementById("myInput");
const myItem = document.getElementById("myItem");
const taskCount = document.getElementById("taskCount");
const currentDate = document.getElementById("currentDate");
const filterButtons = document.querySelectorAll("[data-filter]");
const storageKey = "daymark-tasks";

let tasks = loadTasks();
let currentFilter = "all";

currentDate.textContent = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric"
}).format(new Date());

myForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = myInput.value.trim();

    if (!title) {
        myInput.focus();
        return;
    }

    tasks.unshift({ id: crypto.randomUUID(), title, completed: false });
    saveTasks();
    renderTasks();
    myForm.reset();
    myInput.focus();
});

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;
        filterButtons.forEach(function (filterButton) {
            filterButton.classList.toggle("active", filterButton === button);
        });
        renderTasks();
    });
});

myItem.addEventListener("click", function (event) {
    const deleteButton = event.target.closest("[data-delete]");
    if (!deleteButton) return;

    tasks = tasks.filter(function (task) {
        return task.id !== deleteButton.dataset.delete;
    });
    saveTasks();
    renderTasks();
});

myItem.addEventListener("change", function (event) {
    if (!event.target.matches("[data-complete]")) return;

    tasks = tasks.map(function (task) {
        return task.id === event.target.dataset.complete
            ? { ...task, completed: event.target.checked }
            : task;
    });
    saveTasks();
    renderTasks();
});

function renderTasks() {
    const visibleTasks = tasks.filter(function (task) {
        return currentFilter === "all"
            || (currentFilter === "active" && !task.completed)
            || (currentFilter === "completed" && task.completed);
    });

    myItem.replaceChildren();
    taskCount.textContent = `${tasks.filter(task => !task.completed).length} ${tasks.filter(task => !task.completed).length === 1 ? "task" : "tasks"} left`;

    if (!visibleTasks.length) {
        const emptyState = document.createElement("li");
        emptyState.className = "empty-state";
        emptyState.innerHTML = "<strong>Nothing here yet.</strong>Start with one small thing.";
        myItem.append(emptyState);
        return;
    }

    visibleTasks.forEach(function (task) {
        const item = document.createElement("li");
        item.className = `task${task.completed ? " completed" : ""}`;

        const checkbox = document.createElement("input");
        checkbox.className = "task-check";
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.dataset.complete = task.id;
        checkbox.setAttribute("aria-label", `Mark ${task.title} as complete`);

        const text = document.createElement("span");
        text.className = "task-text";
        text.textContent = task.title;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.type = "button";
        deleteButton.dataset.delete = task.id;
        deleteButton.setAttribute("aria-label", `Delete ${task.title}`);
        deleteButton.textContent = "×";

        item.append(checkbox, text, deleteButton);
        myItem.append(item);
    });
}

function loadTasks() {
    try {
        const storedTasks = JSON.parse(localStorage.getItem(storageKey));
        return Array.isArray(storedTasks) ? storedTasks : [];
    } catch (error) {
        return [];
    }
}

function saveTasks() {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
}

renderTasks();