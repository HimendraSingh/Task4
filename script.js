// ==========================================================================
// 1. FORM SUBMIT LOGIC (Task 3 - Contact & Submissions)
// ==========================================================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        const submission = { name, email, message };

        let submissions = JSON.parse(localStorage.getItem('formSubmissions')) || [];
        submissions.push(submission);
        localStorage.setItem('formSubmissions', JSON.stringify(submissions));

        contactForm.reset();
        alert("Form submitted successfully!");
        displaySubmissions(); 
    });
}

function displaySubmissions() {
    const submissionsGrid = document.getElementById('submissionsGrid');
    if (!submissionsGrid) return; 

    const submissions = JSON.parse(localStorage.getItem('formSubmissions')) || [];

    if (submissions.length === 0) {
        submissionsGrid.innerHTML = '<p style="color: #94a3b8; grid-column: 1/-1;">No submissions found. Please fill the form first!</p>';
    } else {
        submissionsGrid.innerHTML = submissions.map(item => `
            <div class="feature-card">
                <h3>${item.name}</h3>
                <p><strong>Email:</strong> ${item.email}</p>
                <p>${item.message}</p>
            </div>
        `).join('');
    }
}

// ==========================================================================
// 2. TASK MANAGER DASHBOARD LOGIC (Task 4 - CRUD Engine)
// ==========================================================================
let tasks = JSON.parse(localStorage.getItem('dashboardTasks')) || [];

// Dashboard initial load listener
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('taskListContainer')) {
        displayTasks(tasks);
    }
});

// Create and Update Function
function saveTask(event) {
    event.preventDefault();
    
    const taskInput = document.getElementById('taskInput');
    const editTaskId = document.getElementById('editTaskId').value;
    const submitBtn = document.getElementById('taskSubmitBtn');
    
    if (taskInput.value.trim() === "") return;

    if (editTaskId) {
        // Edit Mode (Update)
        tasks = tasks.map(task => {
            if (task.id == editTaskId) {
                return { ...task, name: taskInput.value.trim() };
            }
            return task;
        });
        document.getElementById('editTaskId').value = "";
        submitBtn.innerText = "Add Task";
    } else {
        // Add Mode (Create)
        const newTask = {
            id: Date.now(),
            name: taskInput.value.trim(),
            completed: false
        };
        tasks.push(newTask);
    }

    syncWithStorage();
    taskInput.value = "";
}

// Read Interface
function displayTasks(tasksToRender) {
    const listContainer = document.getElementById('taskListContainer');
    if (!listContainer) return;

    if (tasksToRender.length === 0) {
        listContainer.innerHTML = '<p style="color: #94a3b8; text-align: center; font-size: 14px; padding: 20px;">No tasks found.</p>';
        return;
    }

    listContainer.innerHTML = tasksToRender.map(task => `
        <div class="feature-card" style="padding: 20px; border-radius: 14px; display: flex; justify-content: space-between; align-items: center; background: #0b0f19;">
            <div style="display: flex; align-items: center; gap: 12px; flex: 1; text-align: left;">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleComplete(${task.id})" style="width: 18px; height: 18px; cursor: pointer; accent-color: #6366f1;">
                <span style="font-size: 15px; color: ${task.completed ? '#64748b' : '#f8fafc'}; text-decoration: ${task.completed ? 'line-through' : 'none'}; word-break: break-all;">
                    ${task.name}
                </span>
            </div>
            <div style="display: flex; gap: 8px; margin-left: 15px;">
                <button onclick="editTask(${task.id})" style="background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600;">Edit</button>
                <button onclick="deleteTask(${task.id})" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600;">Delete</button>
            </div>
        </div>
    `).join('');
}

// Toggle Complete
function toggleComplete(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    syncWithStorage();
}

// Populate UI for Edit
function editTask(id) {
    const taskToEdit = tasks.find(task => task.id === id);
    if (!taskToEdit) return;

    document.getElementById('taskInput').value = taskToEdit.name;
    document.getElementById('editTaskId').value = taskToEdit.id;
    document.getElementById('taskSubmitBtn').innerText = "Update";
    document.getElementById('taskInput').focus();
}

// Delete Logic
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    syncWithStorage();
}

// Search and Filter Logic
function filterTasks() {
    const query = document.getElementById('searchBox').value.toLowerCase();
    const filterValue = document.getElementById('statusFilter').value;

    const filtered = tasks.filter(task => {
        const matchesSearch = task.name.toLowerCase().includes(query);
        const matchesStatus = 
            filterValue === 'all' ? true :
            filterValue === 'completed' ? task.completed : !task.completed;

        return matchesSearch && matchesStatus;
    });

    displayTasks(filtered);
}

// Data synchronization helper
function syncWithStorage() {
    localStorage.setItem('dashboardTasks', JSON.stringify(tasks));
    filterTasks();
}