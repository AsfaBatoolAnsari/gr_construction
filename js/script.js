const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');
const yearElement = document.getElementById('year');
const lightbox = document.getElementById('project-lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxCaption = lightbox?.querySelector('p');
const estimateForm = document.getElementById('estimate-form');
const formStatus = document.getElementById('form-status');

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!motionPreference.matches && 'IntersectionObserver' in window) {
  const revealSelectors = [
    '.about-heading',
    '.about-grid',
    '.services .section-intro > *',
    '.service-card',
    '.additional-services > *',
    '.projects .section-intro > *',
    '.project-item',
    '.why-story',
    '.reasons > li',
    '.process-heading',
    '.process-steps > li',
    '.estimate-copy > div',
    '.estimate-photo',
    '.contact-info',
    '.estimate-form',
    '.footer-main > *',
  ];
  const revealTargets = [...document.querySelectorAll(revealSelectors.join(','))];
  const staggerGroups = [
    '.services .section-intro > *',
    '.service-cards > *',
    '.additional-services > *',
    '.projects .section-intro > *',
    '.project-gallery > *',
    '.project-pair > *',
    '.reasons > *',
    '.process-steps > *',
    '.footer-main > *',
  ];

  staggerGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${Math.min(index * 70, 280)}ms`);
    });
  });

  revealTargets.forEach((element) => {
    element.dataset.reveal = '';
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -32px 0px' },
  );

  document.documentElement.classList.add('motion-ready');
  revealTargets.forEach((element) => revealObserver.observe(element));
}

if (menuToggle && primaryNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      primaryNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    if (primaryNav.classList.contains('is-open')) {
      primaryNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.focus();
    }

    if (lightbox?.open) {
      lightbox.close();
    }
  });
}

if (lightbox && lightboxImage && lightboxCaption) {
  document.querySelectorAll('[data-lightbox]').forEach((button) => {
    button.addEventListener('click', () => {
      lightboxImage.src = button.dataset.lightbox;
      lightboxImage.alt = button.querySelector('img')?.alt ?? '';
      lightboxCaption.textContent = button.dataset.caption ?? '';
      lightbox.showModal();
    });
  });

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      lightbox.close();
    }
  });
}

if (estimateForm instanceof HTMLFormElement && formStatus) {
  estimateForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!estimateForm.reportValidity()) {
      return;
    }

    const formData = new FormData(estimateForm);
    const details = [
      `Name: ${formData.get('name')}`,
      `Email: ${formData.get('email')}`,
      `Phone: ${formData.get('phone') || 'Not provided'}`,
      `Project type: ${formData.get('projectType') || 'Not specified'}`,
      `Project location: ${formData.get('location') || 'Not provided'}`,
      `Estimated budget: ${formData.get('budget') || 'Prefer not to say'}`,
      '',
      'Project description:',
      String(formData.get('description') || ''),
    ].join('\n');

    formStatus.textContent = 'Opening your email app with the project details. If it does not open, email grcontractorsllc21@gmail.com.';
    window.location.href = `mailto:grcontractorsllc21@gmail.com?subject=${encodeURIComponent('Project estimate request')}&body=${encodeURIComponent(details)}`;
  });
}
