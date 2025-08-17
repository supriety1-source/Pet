document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('optin');
  const emailInput = document.getElementById('email');

  form.addEventListener('submit', submitEmail);

  const stickyBtn = document.querySelector('.sticky-cta .btn');
  if (stickyBtn) {
    stickyBtn.addEventListener('click', () => {
      document.getElementById('optin').scrollIntoView({ behavior: 'smooth' });
      emailInput.focus();
    });
  }

  const countEl = document.querySelector('[data-countup]');
  if (countEl) {
    const seed = parseInt(countEl.dataset.countup, 10) || 0;
    const extra = parseInt(localStorage.getItem('trees') || '0', 10);
    const target = seed + extra;
    let current = 0;
    const step = () => {
      current += 1;
      countEl.textContent = current;
      if (current < target) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
});

function submitEmail(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  if (email) {
    localStorage.setItem('supriety_email', email);
  }
  const trees = parseInt(localStorage.getItem('trees') || '0', 10);
  localStorage.setItem('trees', trees + 1);
  // Placeholder: swap to Beehive/Netlify form action
  window.location.href = 'thank-you.html';
}
