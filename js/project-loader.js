/**
 * Project Loader
 * Handles loading project data from localStorage and My JSON Server
 */

// Local projects data (stored in localStorage)
const localProjectsData = [
    {
        title: "Detector-Redactor",
        image: "Assets/detector_redeactor.gif",
        alt: "Data security and privacy concept showing PII detection and redaction system",
        description: "A Python tool designed to <b>analyze and redact Personally Identifiable Information (PII)</b> from text using the Presidio library. Features <i>custom recognizers</i>, <em>multi-language support</em>, and context-aware detection with scoring mechanisms.",
        features: [
            "Custom PII recognizers with regex patterns",
            "Multi-language support (English, Spanish)",
            "Credit card, password, and VIN detection",
            "Configurable detection thresholds"
        ],
        technologies: ["Python", "Presidio", "YAML"],
        link: "https://github.com/MgMap/Detector-Redactor",
        linkText: "GitHub"
    },
    {
        title: "PayRoll Manager",
        image: "Assets/pay_roll_manager.gif",
        alt: "Payroll management system with employee data and salary calculations",
        description: "A comprehensive program designed to <b>manage payroll tasks efficiently</b> using advanced data structures like file trees, priority queues, and heaps. Features a <i>user-friendly GUI</i> built with <em>SFML</em> for smooth user experience.",
        features: [
            "Employee management (add, remove, update)",
            "Payroll processing with calculations",
            "Data persistence (save and load)",
            "Advanced data structures for efficiency"
        ],
        technologies: ["C++", "SFML", "CMake"],
        link: "https://github.com/MgMap/PayRoll-Manager",
        linkText: "GitHub"
    },
    {
        title: "CPP-ASM Exam App",
        image: "Assets/examappdemo.png",
        alt: "Code editor interface for C++ and assembly language exam application",
        description: "An <b>Electron-based desktop application</b> designed to facilitate C++ and assembly language exams. Features an <i>integrated development environment</i> with code compilation, execution, and <em>proctoring features</em> for educational assessment.",
        features: [
            "ACE editor with C++ syntax highlighting",
            "Compilation & execution with error reporting",
            "Canvas LMS integration",
            "Proctoring controls and lockdown features"
        ],
        technologies: ["C++", "JavaScript", "Electron"],
        link: "https://github.com/MgMap/CPP-ASM-Exam-APP",
        linkText: "GitHub"
    },
    {
        title: "Assembly Typing Game",
        image: "Assets/asm_typing_demo.gif",
        alt: "Typing game interface for learning assembly language instructions",
        description: "An <b>educational typing practice game</b> that helps users improve typing speed and accuracy while learning <i>assembly language instructions</i>. Features <em>three difficulty modes</em> with progressively challenging content and a scoring system.",
        features: [
            "Three difficulty levels (easy, medium, hard)",
            "Scoring system for accuracy and speed",
            "Learn assembly language instructions",
            "User-friendly interface"
        ],
        technologies: ["Assembly", "Visual Studio", "Education"],
        link: "https://github.com/MgMap/Typing-Game",
        linkText: "GitHub"
    }
];

// My JSON Server configuration
// Create a GitHub repo with db.json file, URL format: https://my-json-server.typicode.com/USERNAME/REPO
const REMOTE_JSON_URL = 'https://my-json-server.typicode.com/MgMap/portfolio-data/projects';

// Initialize localStorage with data if empty
function initLocalStorage() {
    if (!localStorage.getItem('projects')) {
        localStorage.setItem('projects', JSON.stringify(localProjectsData));
    }
}

// Load projects from localStorage
function loadLocal() {
    const container = document.querySelector('.projects-grid');
    if (!container) return;

    // Clear existing cards
    container.innerHTML = '';

    // Get data from localStorage
    const data = JSON.parse(localStorage.getItem('projects') || '[]');

    // Create project cards
    data.forEach(project => {
        const card = document.createElement('project-card');
        card.data = project;
        container.appendChild(card);
    });

    console.log('Loaded', data.length, 'projects from localStorage');
}

// Load projects from My JSON Server (remote)
async function loadRemote() {
    const container = document.querySelector('.projects-grid');
    if (!container) return;

    // Clear existing cards
    container.innerHTML = '';

    try {
        const response = await fetch(REMOTE_JSON_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const projects = await response.json();

        // Create project cards
        projects.forEach(project => {
            const card = document.createElement('project-card');
            card.data = project;
            container.appendChild(card);
        });

        console.log('Loaded', projects.length, 'projects from My JSON Server');
    } catch (error) {
        console.error('Failed to load remote data:', error);
        container.innerHTML = '<p>Failed to load remote projects. Please try again later.</p>';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize localStorage with default data
    initLocalStorage();

    // Add event listeners to buttons
    const loadLocalBtn = document.getElementById('load-local-btn');
    const loadRemoteBtn = document.getElementById('load-remote-btn');

    if (loadLocalBtn) {
        loadLocalBtn.addEventListener('click', loadLocal);
    }

    if (loadRemoteBtn) {
        loadRemoteBtn.addEventListener('click', loadRemote);
    }
});
