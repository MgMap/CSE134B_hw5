/**
 * ProjectCard Custom Element
 * A reusable web component for displaying project information
 * Supports both inline HTML content and programmatic data setting
 */
class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this._rendered = false;
        this._data = null;
    }

    connectedCallback() {
        // Only render if not already rendered
        if (!this._rendered) {
            this.render();
        }
    }

    // Set data programmatically for dynamic creation
    set data(projectData) {
        this._data = projectData;
        this.render();
    }

    get data() {
        return this._data;
    }

    render() {
        this._rendered = true;

        // If data was set programmatically, generate HTML from it
        if (this._data) {
            const d = this._data;
            const featuresHTML = d.features && d.features.length > 0 ? `
                <h3>Key Features:</h3>
                <ul>
                    ${d.features.map(f => `<li>${f}</li>`).join('\n                    ')}
                </ul>
            ` : '';
            const techHTML = d.technologies && d.technologies.length > 0 ?
                `<p><b>Technologies:</b> ${d.technologies.map(t => `<span>${t}</span>`).join(', ')}</p>` : '';

            this.innerHTML = `
                <article class="project-card">
                    <h2>${d.title}</h2>
                    <picture>
                        <img src="${d.image}"
                             alt="${d.alt}"
                             width="400"
                             height="300"
                             loading="lazy"
                             class="project-image">
                    </picture>
                    <p>${d.description}</p>
                    ${featuresHTML}
                    ${techHTML}
                    <a href="${d.link}" target="_blank">
                        <button type="button">${d.linkText || 'GitHub'}</button>
                    </a>
                </article>
            `;
        } else {
            // Wrap existing innerHTML content (for inline HTML usage)
            const content = this.innerHTML;
            this.innerHTML = `
                <article class="project-card">
                    ${content}
                </article>
            `;
        }
    }
}

customElements.define('project-card', ProjectCard);
