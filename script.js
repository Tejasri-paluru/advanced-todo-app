let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let isDarkMode = JSON.parse(localStorage.getItem("darkMode")) || false;

const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const dueDateInput = document.getElementById("dueDateInput");

const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const clearAllBtn = document.getElementById("clearAllBtn");
const taskCount = document.getElementById("taskCount");
const filterButtons = document.querySelectorAll(".filter-btn");
const themeToggle = document.getElementById("themeToggle");
const toast = document.getElementById("toast");
const particlesContainer = document.getElementById("particles");
const sortSelect = document.getElementById("sortSelect");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const progressNumbers = document.getElementById("progressNumbers");

let currentFilter = "all";
// Toast function
function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// Create particles dynamically
function createParticles() {
  if (!particlesContainer) return;

  for (let i = 0; i < 25; i++) {
    let particle = document.createElement("span");
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDuration = (5 + Math.random() * 10) + "s";
    particle.style.opacity = Math.random();
    particle.style.transform = `scale(${Math.random()})`;
    particle.style.width = particle.style.height = (2 + Math.random() * 6) + "px";

    particlesContainer.appendChild(particle);
  }
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Save dark mode
function saveTheme() {
  localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
}

// Format date
function formatDate(dateStr) {
  if (!dateStr) return "No Due Date";
  const date = new Date(dateStr);
  return date.toDateString();
}

// Apply theme
function applyTheme() {
  if (isDarkMode) {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️ Light";
  } else {
    document.body.classList.remove("dark");
    themeToggle.textContent = "🌙 Dark";
  }
}

function priorityRank(priority) {
  if (priority === "High") return 1;
  if (priority === "Medium") return 2;
  return 3;
}
// Render tasks
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;
// Sorting
if (sortSelect) {
  const sortValue = sortSelect.value;

  if (sortValue === "newest") {
    filteredTasks = filteredTasks.slice().reverse();
  }

  if (sortValue === "oldest") {
    filteredTasks = filteredTasks.slice();
  }

  if (sortValue === "priority") {
    filteredTasks = filteredTasks.slice().sort((a, b) => {
      return priorityRank(a.priority) - priorityRank(b.priority);
    });
  }

  if (sortValue === "duedate") {
    filteredTasks = filteredTasks.slice().sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }
}
  // Filter based on currentFilter
  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (currentFilter === "pending") {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  // Search filter
  const searchText = searchInput.value.toLowerCase();
  filteredTasks = filteredTasks.filter(task =>
    task.text.toLowerCase().includes(searchText)
  );

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.classList.add("task-item");

    let priorityClass = task.priority.toLowerCase();

    li.innerHTML = `
      <div class="task-left">
        <div class="task-top">
          <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask(${index})">
          <span class="task-text ${task.completed ? "completed" : ""}">${task.text}</span>
        </div>

        <div class="task-meta">
          <span class="badge ${priorityClass}">${task.priority}</span>
          <span class="badge date">📅 ${formatDate(task.dueDate)}</span>
          <span class="badge date">🕒 Created: ${task.createdAt}</span>
        </div>
      </div>

      <div class="task-actions">
        <button class="edit-btn" onclick="editTask(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateTaskCount();
  updateProgress();
}

// Update task count
function updateTaskCount() {
  taskCount.textContent = `${tasks.length} tasks`;
}
function updateProgress() {
  if (!progressFill) return;

  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;

  let percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressFill.style.width = percent + "%";

  if (progressText) progressText.textContent = `${percent}% Completed`;
  if (progressNumbers) progressNumbers.textContent = `${completed}/${total}`;
}

// Add task
addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  const priority = priorityInput.value;
  const dueDate = dueDateInput.value;

  if (taskText === "") {
    showToast("⚠️ Please enter a task!");
    return;
  }

  const createdAt = new Date().toLocaleString();

  tasks.push({
    text: taskText,
    completed: false,
    priority: priority,
    dueDate: dueDate,
    createdAt: createdAt
  });


  taskInput.value = "";
  dueDateInput.value = "";

  saveTasks();
  renderTasks();
  showToast("✅ Task Added Successfully!");
});

// Add task on Enter key
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addBtn.click();
  }
});

// Toggle complete task
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
  showToast("🎉 Task Status Updated!");
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
  showToast("❌ Task Deleted!");
}

// Edit task
function editTask(index) {
  const newTask = prompt("Edit your task:", tasks[index].text);

  if (newTask !== null && newTask.trim() !== "") {
    tasks[index].text = newTask.trim();
    saveTasks();
    renderTasks();
    showToast("✏️ Task Updated!");
  }
}

// Clear all tasks
clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
    showToast("🗑️ All tasks cleared!");
  }
});

// Search tasks
searchInput.addEventListener("input", () => {
  renderTasks();
});

// Filter tasks
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentFilter = btn.getAttribute("data-filter");
    renderTasks();
  });
});
if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    renderTasks();
    showToast("🔄 Sorting Updated!");
  });
}

// Theme toggle
themeToggle.addEventListener("click", () => {
  isDarkMode = !isDarkMode;
  saveTheme();
  applyTheme();
});

// Initial setup
createParticles();
applyTheme();
renderTasks();
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  });
}