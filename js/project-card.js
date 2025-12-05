/**
 * ProjectCard Custom Element
 * A reusable web component for displaying project information
 * Content is placed directly inside the element, which gets wrapped in an article
 */
class ProjectCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        // Get the existing innerHTML content
        const content = this.innerHTML;

        // Wrap it in an article with the project-card class
        this.innerHTML = `
            <article class="project-card">
                ${content}
            </article>
        `;
    }
}

customElements.define('project-card', ProjectCard);
