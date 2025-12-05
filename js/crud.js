/**
 * CRUD Operations for Project Management
 * Handles Create, Update, Delete operations on localStorage projects
 */

// DOM Elements
let projectSelect, loadBtn, deleteBtn, createBtn, updateBtn, clearBtn;
let form, statusOutput;
let selectedProjectTitle = '';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    projectSelect = document.getElementById('project-select');
    loadBtn = document.getElementById('load-btn');
    deleteBtn = document.getElementById('delete-btn');
    createBtn = document.getElementById('create-btn');
    updateBtn = document.getElementById('update-btn');
    clearBtn = document.getElementById('clear-btn');
    form = document.getElementById('project-form');
    statusOutput = document.getElementById('crud-status');

    // Load project list into dropdown
    loadProjectList();

    // Event listeners
    loadBtn.addEventListener('click', loadSelectedProject);
    deleteBtn.addEventListener('click', deleteSelectedProject);
    form.addEventListener('submit', createProject);
    updateBtn.addEventListener('click', updateProject);
    clearBtn.addEventListener('click', clearForm);
    projectSelect.addEventListener('change', onProjectSelectChange);

    // Initial state
    updateButtonStates();
});

// Get projects from localStorage
function getProjects() {
    return JSON.parse(localStorage.getItem('projects') || '[]');
}

// Save projects to localStorage
function saveProjects(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
}

// Populate the project dropdown
function loadProjectList() {
    const projects = getProjects();

    // Clear existing options except the first one
    projectSelect.innerHTML = '<option value="">-- New Project --</option>';

    // Add project options
    projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.title;
        option.textContent = project.title;
        projectSelect.appendChild(option);
    });
}

// Handle dropdown selection change
function onProjectSelectChange() {
    selectedProjectTitle = projectSelect.value;
    updateButtonStates();
}

// Update button enabled/disabled states
function updateButtonStates() {
    const hasSelection = projectSelect.value !== '';
    loadBtn.disabled = !hasSelection;
    deleteBtn.disabled = !hasSelection;
    updateBtn.disabled = !hasSelection;
}

// Load selected project into form
function loadSelectedProject() {
    const title = projectSelect.value;
    if (!title) return;

    const projects = getProjects();
    const project = projects.find(p => p.title === title);

    if (project) {
        document.getElementById('title').value = project.title || '';
        document.getElementById('image').value = project.image || '';
        document.getElementById('alt').value = project.alt || '';
        document.getElementById('description').value = project.description || '';
        document.getElementById('features').value = (project.features || []).join('\n');
        document.getElementById('technologies').value = (project.technologies || []).join(', ');
        document.getElementById('link').value = project.link || '';
        document.getElementById('linkText').value = project.linkText || '';

        selectedProjectTitle = title;
        showStatus(`Loaded "${title}" for editing`, 'info');
    }
}

// Get form data as project object
function getFormData() {
    const featuresText = document.getElementById('features').value.trim();
    const technologiesText = document.getElementById('technologies').value.trim();

    return {
        title: document.getElementById('title').value.trim(),
        image: document.getElementById('image').value.trim(),
        alt: document.getElementById('alt').value.trim(),
        description: document.getElementById('description').value.trim(),
        features: featuresText ? featuresText.split('\n').map(f => f.trim()).filter(f => f) : [],
        technologies: technologiesText ? technologiesText.split(',').map(t => t.trim()).filter(t => t) : [],
        link: document.getElementById('link').value.trim(),
        linkText: document.getElementById('linkText').value.trim() || 'GitHub'
    };
}

// Create new project
function createProject(e) {
    e.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const projectData = getFormData();
    const projects = getProjects();

    // Check for duplicate title
    if (projects.some(p => p.title === projectData.title)) {
        showStatus(`A project with title "${projectData.title}" already exists. Use Update instead.`, 'error');
        return;
    }

    // Add new project
    projects.push(projectData);
    saveProjects(projects);

    // Refresh dropdown and clear form
    loadProjectList();
    clearForm();

    showStatus(`Created new project: "${projectData.title}"`, 'success');
}

// Update existing project
function updateProject() {
    if (!selectedProjectTitle) {
        showStatus('Please select a project to update', 'error');
        return;
    }

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const projectData = getFormData();
    const projects = getProjects();

    // Find and update the project
    const index = projects.findIndex(p => p.title === selectedProjectTitle);

    if (index === -1) {
        showStatus(`Project "${selectedProjectTitle}" not found`, 'error');
        return;
    }

    // Check if title changed and new title already exists
    if (projectData.title !== selectedProjectTitle) {
        if (projects.some(p => p.title === projectData.title)) {
            showStatus(`A project with title "${projectData.title}" already exists`, 'error');
            return;
        }
    }

    // Update the project
    projects[index] = projectData;
    saveProjects(projects);

    // Refresh dropdown
    loadProjectList();
    projectSelect.value = projectData.title;
    selectedProjectTitle = projectData.title;

    showStatus(`Updated project: "${projectData.title}"`, 'success');
}

// Delete selected project
function deleteSelectedProject() {
    const title = projectSelect.value;
    if (!title) return;

    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
        return;
    }

    const projects = getProjects();
    const filteredProjects = projects.filter(p => p.title !== title);

    if (filteredProjects.length === projects.length) {
        showStatus(`Project "${title}" not found`, 'error');
        return;
    }

    saveProjects(filteredProjects);

    // Refresh dropdown and clear form
    loadProjectList();
    clearForm();
    selectedProjectTitle = '';
    updateButtonStates();

    showStatus(`Deleted project: "${title}"`, 'success');
}

// Clear the form
function clearForm() {
    form.reset();
    projectSelect.value = '';
    selectedProjectTitle = '';
    updateButtonStates();
}

// Show status message
function showStatus(message, type) {
    statusOutput.textContent = message;
    statusOutput.className = type === 'error' ? 'output-error' :
                             type === 'success' ? 'output-success' : 'output-info';

    // Auto-clear after 5 seconds
    setTimeout(() => {
        statusOutput.textContent = '';
    }, 5000);
}
