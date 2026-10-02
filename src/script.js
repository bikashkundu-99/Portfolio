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


// ===== Wow pass =====
const rootEl = document.documentElement;
window.addEventListener('pointermove', e => {
    rootEl.style.setProperty('--mx', e.clientX + 'px');
    rootEl.style.setProperty('--my', e.clientY + 'px');
}, { passive: true });

// per-card spotlight and tilt
document.querySelectorAll('.glass-card, .ach-card, .contest, .skill-tile').forEach(card => {
    card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        card.style.setProperty('--x', x + 'px');
        card.style.setProperty('--y', y + 'px');
        if (card.matches('.ach-card')) {
            card.style.setProperty('--ry', ((x / r.width - 0.5) * 10) + 'deg');
            card.style.setProperty('--rx', (-(y / r.height - 0.5) * 10) + 'deg');
        }
    });
    card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
    });
});

// typing role line
const roleEl = document.querySelector('.profile-card .role');
if (roleEl && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const words = ['Backend Engineer', 'Competitive Programmer', 'Distributed Systems', 'Codeforces Master'];
    const text = document.createElement('span'), caret = document.createElement('span');
    caret.className = 'caret';
    roleEl.textContent = '';
    roleEl.append(text, caret);
    let w = 0, i = 0, del = false;
    (function tick() {
        const word = words[w];
        text.textContent = word.slice(0, i);
        if (!del && i === word.length) { del = true; return setTimeout(tick, 1600); }
        if (del && i === 0) { del = false; w = (w + 1) % words.length; }
        i += del ? -1 : 1;
        setTimeout(tick, del ? 35 : 75);
    })();
}

// trailing cursor ring (mouse devices only)
if (matchMedia('(pointer: fine)').matches) {
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.append(ring);
    let x = 0, y = 0, tx = 0, ty = 0;
    window.addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; ring.classList.add('on'); }, { passive: true });
    document.addEventListener('pointerover', e => ring.classList.toggle('big', !!e.target.closest('a, button, .ach-card')));
    (function loop() {
        x += (tx - x) * 0.18; y += (ty - y) * 0.18;
        ring.style.transform = `translate(${x}px, ${y}px)`;
        requestAnimationFrame(loop);
    })();
}
