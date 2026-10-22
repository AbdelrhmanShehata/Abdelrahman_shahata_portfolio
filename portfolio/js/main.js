/**
 * ABDELRAHMAN SHEHATA ELSAYED - PORTFOLIO
 * MAIN SCRIPT - NAVIGATION, CV MODAL, CLIPBOARD & FORMS
 */

(function () {
  'use strict';

  // --- Mobile Menu Toggle ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // --- Active Link Scrollspy ---
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.pageYOffset;

    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    allNavLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // --- CV Modal ---
  const cvModal = document.getElementById('cv-modal');
  const openCvBtn = document.getElementById('open-cv-btn');
  const closeCvBtn = document.getElementById('close-cv-modal');
  const cvBackdrop = document.getElementById('cv-backdrop');

  function openModal() {
    if (cvModal) {
      cvModal.classList.add('active');
      cvModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeModal() {
    if (cvModal) {
      cvModal.classList.remove('active');
      cvModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (openCvBtn) openCvBtn.addEventListener('click', openModal);
  if (closeCvBtn) closeCvBtn.addEventListener('click', closeModal);
  if (cvBackdrop) cvBackdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cvModal && cvModal.classList.contains('active')) {
      closeModal();
    }
  });

  // --- Toast Notifications ---
  window.showToast = function (message, iconName = 'check') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i data-lucide="${iconName}" class="toast-icon"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) {
      lucide.createIcons({ root: toast });
    }

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 2800);
  };

  // --- Copy to Clipboard ---
  window.copyText = function (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied: ${text}`, 'check');
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  };

  function fallbackCopy(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast(`Copied: ${text}`, 'check');
  }

  // --- Contact Form ---
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('#c-name').value;
      const email = contactForm.querySelector('#c-email').value;
      const subject = contactForm.querySelector('#c-subject').value;
      const message = contactForm.querySelector('#c-message').value;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending...</span>`;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <i data-lucide="send" class="btn-icon"></i>
            <span>Send Message</span>
          `;
          if (window.lucide) lucide.createIcons();
        }

        if (formStatus) {
          formStatus.className = 'form-status success';
          formStatus.style.display = 'block';
          formStatus.innerHTML = `Thank you, ${name}! Your message has been prepared for dispatch.`;
        }

        showToast('Message sent successfully!', 'check');
        contactForm.reset();

        // Direct mailto link fallback
        const mailto = `mailto:abdoshehatalil9@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Sender: " + name + "\nEmail: " + email + "\n\n" + message)}`;
        const link = document.createElement('a');
        link.href = mailto;
        link.target = '_blank';
        link.click();
      }, 800);
    });
  }

  // --- Smooth Security Scroll Reveal Observer ---
  const revealElements = document.querySelectorAll('.glass-card, .profile-card, .timeline-row, .section-header');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealElements.forEach((el) => {
      el.classList.add('reveal-on-scroll');
      observer.observe(el);
    });
  }

  // --- Cyber Theme Mouse Pointer Effect ---
  const cursorDot = document.getElementById('cyber-cursor-dot');
  const cursorRing = document.getElementById('cyber-cursor-ring');
  const cursorGlow = document.getElementById('cyber-cursor-glow');

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isHovering = false;
    let isClicking = false;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        document.body.classList.add('cursor-active');
      }
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) ${isHovering ? 'scale(1.4)' : 'scale(1)'}`;
      if (cursorGlow) {
        cursorGlow.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      document.body.classList.remove('cursor-active');
    });

    document.addEventListener('mouseenter', () => {
      isVisible = true;
      document.body.classList.add('cursor-active');
    });

    window.addEventListener('mousedown', () => {
      isClicking = true;
      cursorRing.classList.add('cursor-clicking');
    });

    window.addEventListener('mouseup', () => {
      isClicking = false;
      cursorRing.classList.remove('cursor-clicking');
    });

    // Hover state on all interactive elements
    const interactiveElements = 'a, button, input, textarea, .glass-card, .skill-badge-card, .nav-link, .meta-pill, .tag, .timeline-card, .gpa-badge, .gpa-highlight-card';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveElements)) {
        isHovering = true;
        cursorRing.classList.add('cursor-hover');
        cursorDot.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveElements)) {
        isHovering = false;
        cursorRing.classList.remove('cursor-hover');
        cursorDot.classList.remove('cursor-hover');
      }
    });

    // High performance RAF loop for the trailing ring
    function renderCursor() {
      if (isVisible) {
        ringX += (mouseX - ringX) * 0.16;
        ringY += (mouseY - ringY) * 0.16;
        cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) ${isClicking ? 'scale(0.85)' : ''}`;
      }
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);
  }

})();
