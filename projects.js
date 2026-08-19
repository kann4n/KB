const projects = [
    {
        title: "SDL3_Projects",
        image: "assets/project-logos/sdl3-001.png",
        alt: "SDL3 Projects Preview",
        link: "https://github.com/kann4n/SDL_Projects"
    },
    {
        title: "Tedi",
        image: "assets/project-logos/tedi-logo.png",
        alt: "Tedi Project Preview",
        link: "https://github.com/kann4n/tedi"
    },
    {
        title: "Imger",
        image: "assets/project-logos/imager.png",
        alt: "Imger Project Preview",
        link: "https://github.com/kann4n/imger"
    },
    {
        title: "To-ASCII",
        image: "assets/project-logos/to-ascii.png",
        alt: "To-ASCII Project Preview",
        link: "https://github.com/kann4n/to-ascci"
    },
    {
        title: "Self-Driving Car",
        image: "assets/project-logos/self-driving-car.png",
        alt: "Self-Driving Car Preview",
        link: "https://github.com/kann4n/self-driveing-car"
    },
    {
        title: "Dark Knight",
        image: "assets/project-logos/dark-knight.png",
        alt: "Dark Knight Project Preview",
        link: "https://github.com/kann4n/Dark-Knight"
    },
    {
        title: "Fractal Tree",
        image: "assets/project-logos/fractal-tree.png",
        alt: "Fractal Tree Preview",
        link: "https://github.com/kann4n/Fractal-Tree"
    },
    {
        title: "Pastebin",
        image: "assets/project-logos/pastebin.png",
        alt: "Pastebin Preview",
        link: "https://github.com/kann4n/pastebin"
    }
];

function renderProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    
    if (!projectsGrid) return; 

    const html = projects.map(project => `
        <li class="project-card">
            <img src="${project.image}" alt="${project.alt}" />
            <div class="project-info">
                <h3>${project.title}</h3>
                <a href="${project.link}" target="_blank" rel="noopener" class="hover-color-invert">
                    View Source Code →
                </a>
            </div>
        </li>
    `).join('');

    projectsGrid.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', renderProjects);