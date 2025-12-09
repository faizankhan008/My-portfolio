/* Portfolio site interactivity:
   - Mobile menu toggle
   - Filters for portfolio
   - Modal video player
   - Contact form basic validation (no backend)
   - Smooth scrolling and other niceties
*/

document.addEventListener('DOMContentLoaded', () => {
  // year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  menuToggle.addEventListener('click', () => {
    const shown = nav.style.display === 'flex';
    nav.style.display = shown ? '' : 'flex';
    if (!shown) nav.style.flexDirection = 'column';
  });

  // Smooth links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        if (window.innerWidth < 1000) { nav.style.display = ''; } // close mobile menu
      }
    });
  });

  // Portfolio filters
  const filters = document.querySelectorAll('.filter');
  const cards = document.querySelectorAll('#portfolioGrid .card');
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.getAttribute('data-filter');
    cards.forEach(c => {
      const cat = c.getAttribute('data-category');
      if (f === '*' || f === cat) {
        c.style.display = '';
        // small entrance
        c.style.opacity = 0;
        setTimeout(()=> c.style.opacity = 1, 20);
      } else {
        c.style.display = 'none';
      }
    });
  }));

  // Modal video player
  const modal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-video');
      const title = card.querySelector('h4')?.textContent || 'Project';
      const desc = card.querySelector('p')?.textContent || '';

      if (!src) return alert('Video not provided for this project.');

      modalVideo.src = src;
      modalVideo.currentTime = 0;
      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      modal.setAttribute('aria-hidden', 'false');
      modalVideo.play().catch(()=>{ /* autoplay may be blocked; user can press play */});
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    try { modalVideo.pause(); modalVideo.removeAttribute('src'); } catch(e){/*ignore*/}
  }

  // Basic contact form validation (client side only)
  const form = document.getElementById('contactForm');
  const notice = document.getElementById('formNotice');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) {
      notice.textContent = 'Please fill all fields.';
      notice.style.color = '#ff8aa1';
      return;
    }
    // simple email regex
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      notice.textContent = 'Please enter a valid email.';
      notice.style.color = '#ff8aa1';
      return;
    }

    // Here you would POST to your backend. We'll simulate success.
    notice.textContent = 'Message sent — I will contact you soon. (Demo only)';
    notice.style.color = '#7ef0d1';
    form.reset();
  });

  // Optional: lazy-load thumbnails if many (tiny example)
  const imgs = document.querySelectorAll('img');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          const img = ent.target;
          const src = img.getAttribute('data-src');
          if (src) { img.src = src; img.removeAttribute('data-src'); }
          io.unobserve(img);
        }
      });
    }, {rootMargin:'100px'});
    imgs.forEach(i => {
      if (i.dataset.src) io.observe(i);
    });
  }
});

