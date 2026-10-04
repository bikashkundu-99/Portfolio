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

    // Hide all project detail subviews
    document.querySelectorAll('.project-detail-item').forEach(item => {
        item.style.display = 'none';
    });

    // Reveal the selected project subview
    const targetDetail = document.getElementById(`detail-${projectId}`);
    if (targetDetail) {
        targetDetail.style.display = 'block';
    }

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

// Dynamic 3D Tilt Effect for Cards
const tiltCards = document.querySelectorAll('.glass-card, .ach-card, .contest');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation angles (max 8 degrees for elegance)
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = ''; // Removes inline transform to let CSS hover state resolve back correctly
        card.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
    });

    card.addEventListener('mouseenter', () => {
        // Remove transition to allow instant tracking with mouse
        card.style.transition = 'none';
    });
});