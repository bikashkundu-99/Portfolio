// Scroll progress bar
const progress = document.querySelector('.progress');
function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
}

// Nav highlight based on the section currently in view
const sections = document.querySelectorAll('.section-content');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
    let current = sections[0].id;
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 200) current = section.id;
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}

window.addEventListener('scroll', () => {
    updateProgress();
    updateActiveNav();
}, { passive: true });

updateProgress();
updateActiveNav();

// Reveal elements when they come into view
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Project Detail full-screen view
function openProjectDetail(projectId) {
    const detailView = document.getElementById('project-detail-view');
    if (!detailView) return;
    detailView.style.display = 'block';
    detailView.scrollTop = 0;
    document.body.classList.add('no-scroll');
}

function closeProjectDetail() {
    const detailView = document.getElementById('project-detail-view');
    if (!detailView) return;
    detailView.style.display = 'none';
    document.body.classList.remove('no-scroll');
}

function backToProjects() {
    closeProjectDetail();
    const projects = document.getElementById('projects');
    if (projects) {
        const top = projects.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: top, behavior: 'smooth' });
    }
}

// Clicking any nav menu item while a project is open: close it, then the link scrolls to its section
navLinks.forEach(link => link.addEventListener('click', closeProjectDetail));

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeProjectDetail();
});