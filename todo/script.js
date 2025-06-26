document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const remainingCount = document.getElementById('remainingCount');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Initialize tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    
    // Render initial tasks
    renderTaskList();
    
    // Event Listeners
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => filterTasks(btn.dataset.filter));
    });
    
    // Add new task
    function addTask() {
        const taskText = taskInput.value.trim();
        
        if (!taskText) {
            alert('Please enter a task');
            return;
        }
        
        // Check for duplicate tasks
        if (tasks.some(task => task.text.toLowerCase() === taskText.toLowerCase())) {
            alert('This task already exists!');
            return;
        }
        
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date()
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTaskList();
        taskInput.value = '';
        taskInput.focus();
    }
    
    // Render task list based on current filter
    function renderTaskList() {
        taskList.innerHTML = '';
        
        // Filter tasks
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        });
        
        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = currentFilter === 'all' 
                ? 'No tasks yet. Add one above!' 
                : `No ${currentFilter} tasks`;
            taskList.appendChild(emptyMessage);
        } else {
            filteredTasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.className = 'task-item';
                taskItem.dataset.id = task.id;
                
                taskItem.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                `;
                
                const checkbox = taskItem.querySelector('.task-checkbox');
                const deleteBtn = taskItem.querySelector('.delete-btn');
                
                checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));
                deleteBtn.addEventListener('click', () => deleteTask(task.id));
                
                taskList.appendChild(taskItem);
            });
        }
        
        updateTaskStats();
    }
    
    // Toggle task completion status
    function toggleTaskCompletion(taskId) {
        tasks = tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTaskList();
    }
    
    // Delete a task
    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTaskList();
    }
    
    // Clear all completed tasks
    function clearCompletedTasks() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTaskList();
    }
    
    // Filter tasks
    function filterTasks(filter) {
        currentFilter = filter;
        filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        renderTaskList();
    }
    
    // Update task statistics
    function updateTaskStats() {
        const remainingTasks = tasks.filter(task => !task.completed).length;
        remainingCount.textContent = `${remainingTasks} ${remainingTasks === 1 ? 'item' : 'items'} left`;
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});