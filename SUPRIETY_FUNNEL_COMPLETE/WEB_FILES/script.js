document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initSliders();
  initPromptCopy();
  initRevealAnimations();
  initPayWhatYouWant();
});

function initCountdown() {
  const countdowns = document.querySelectorAll('[data-countdown]');
  if (!countdowns.length) return;

  const STORAGE_KEY = 'suprietyCountdownEnd';
  const now = new Date();
  let endTimestamp = localStorage.getItem(STORAGE_KEY);

  if (!endTimestamp || Number(endTimestamp) < now.getTime()) {
    const threeDaysLater = now.getTime() + 3 * 24 * 60 * 60 * 1000;
    endTimestamp = threeDaysLater;
    localStorage.setItem(STORAGE_KEY, String(endTimestamp));
  }

  const updateTimer = () => {
    const current = Date.now();
    let distance = Number(endTimestamp) - current;

    if (distance < 0) {
      const reset = current + 3 * 24 * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, String(reset));
      distance = reset - current;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    countdowns.forEach((countdown) => {
      countdown.querySelectorAll('[data-time-part]').forEach((box) => {
        const part = box.dataset.timePart;
        const valueEl = box.querySelector('.value');
        if (!part || !valueEl) return;
        const mapping = { days, hours, minutes };
        valueEl.textContent = String(mapping[part]).padStart(2, '0');
      });
    });
  };

  updateTimer();
  setInterval(updateTimer, 60000);
}

function initSliders() {
  const sliders = document.querySelectorAll('.slider');
  sliders.forEach((slider) => {
    const track = slider.querySelector('.slider-track');
    const slides = slider.querySelectorAll('.slider-item');
    const prevBtn = slider.querySelector('[data-slider-prev]');
    const nextBtn = slider.querySelector('[data-slider-next]');
    if (!track || slides.length === 0 || !prevBtn || !nextBtn) return;

    let index = 0;

    const updatePosition = () => {
      const offset = -index * 100;
      track.style.transform = `translateX(${offset}%)`;
    };

    prevBtn.addEventListener('click', () => {
      index = (index - 1 + slides.length) % slides.length;
      updatePosition();
    });

    nextBtn.addEventListener('click', () => {
      index = (index + 1) % slides.length;
      updatePosition();
    });
  });
}

function initPromptCopy() {
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const prompt = btn.dataset.prompt;
      if (!prompt) return;
      navigator.clipboard.writeText(prompt).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copied to clipboard!';
        setTimeout(() => {
          btn.textContent = original;
        }, 1800);
      }).catch(() => {
        btn.textContent = 'Copy not supported';
        setTimeout(() => {
          btn.textContent = 'Copy prompt';
        }, 1800);
      });
    });
  });
}

function initRevealAnimations() {
  const elements = document.querySelectorAll('.fade-up');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  elements.forEach((el) => observer.observe(el));
}

function initPayWhatYouWant() {
  const containers = document.querySelectorAll('[data-pay-what-you-want]');
  if (!containers.length) return;

  containers.forEach((container) => {
    const inputs = container.querySelectorAll('input[name="pwyw"]');
    const customField = container.querySelector('[data-custom-amount]');
    const display = container.querySelector('[data-selected-price]');
    const button = container.querySelector('[data-pay-btn]');
    const payhipLink = container.dataset.payhipBase || '';
    const donationNote = container.querySelector('[data-donation-note]');
    let selectedAmount = 8.97;

    const updateUI = () => {
      if (display) {
        display.textContent = `$${selectedAmount.toFixed(2)}`;
      }
      if (button) {
        button.textContent = `${button.dataset.ctaLabel ? button.dataset.ctaLabel : 'Add This To My Recovery Toolkit'} – $${selectedAmount.toFixed(2)}`;
        if (payhipLink) {
          const separator = payhipLink.includes('?') ? '&' : '?';
          button.setAttribute('href', `${payhipLink}${separator}amount=${selectedAmount.toFixed(2)}`);
        }
      }
      if (donationNote) {
        const reinvest = (selectedAmount * 0.3).toFixed(2);
        donationNote.textContent = `With this choice, $${reinvest} immediately fuels Supriety™️ outreach.`;
      }
    };

    inputs.forEach((input) => {
      input.addEventListener('change', () => {
        if (input.value === 'custom') {
          customField?.removeAttribute('disabled');
          customField?.focus();
        } else {
          if (customField) {
            customField.value = '';
            customField.setAttribute('disabled', 'true');
          }
          selectedAmount = parseFloat(input.value);
          updateUI();
        }
      });
    });

    if (customField) {
      customField.addEventListener('input', () => {
        const value = parseFloat(customField.value);
        if (!isNaN(value) && value > 0) {
          selectedAmount = value;
          updateUI();
        }
      });
    }

    updateUI();
  });
}
