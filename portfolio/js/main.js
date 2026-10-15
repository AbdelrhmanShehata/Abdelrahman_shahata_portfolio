/**
 * ABDELRAHMAN SHEHATA ELSAYED - CYBER PORTFOLIO
 * MAIN CONTROLLER & APPLICATION LOGIC
 * Manages typewriter, telemetry, audio synthesis, skills filter, CV modal, and clipboard toasts.
 */

(function () {
  'use strict';

  // ==========================================
  // 1. WEB AUDIO API SYNTHESIZER (Cyber SFX)
  // ==========================================
  let audioEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playCyberBeep(freq = 880, type = 'sine', duration = 0.05, gainLevel = 0.03) {
    if (!audioEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainLevel, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (err) {
      // Audio autoplay policy fallback
    }
  }

  // Toggle audio button
  const audioToggleBtn = document.getElementById('toggle-audio-btn');
  const audioIcon = document.getElementById('audio-icon');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      if (audioEnabled) {
        audioToggleBtn.querySelector('.btn-label').textContent = 'AUDIO: ON';
        showToast('Cyber UI Audio Enabled', 'volume-2');
        playCyberBeep(920, 'sine', 0.08, 0.05);
      } else {
        audioToggleBtn.querySelector('.btn-label').textContent = 'AUDIO: OFF';
        showToast('Cyber UI Audio Muted', 'volume-x');
      }
    });
  }

  // Bind clicks on cyber buttons to subtle SFX
  document.addEventListener('click', (e) => {
    if (e.target.closest('.cyber-btn') || e.target.closest('.nav-link') || e.target.closest('.filter-btn')) {
      playCyberBeep(750, 'sine', 0.04, 0.02);
    }
  });

  // ==========================================
  // 2. LIVE UTC TELEMETRY CLOCK
  // ==========================================
  const clockEl = document.getElementById('clock-display');
  function updateUtcClock() {
    if (!clockEl) return;
    const now = new Date();
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}:${seconds} UTC`;
  }
  setInterval(updateUtcClock, 1000);
  updateUtcClock();

  // ==========================================
  // 3. TYPEWRITER EFFECT IN HERO
  // ==========================================
  const typewriterEl = document.getElementById('typewriter-text');
  const phrases = [
    'Cybersecurity & SOC Analyst',
    'Computer & Control Systems Engineering Student',
    'Detection Engineering & SIEM Architect',
    'MITRE ATT&CK & Incident Response Specialist',
    'Local AI & SOAR Workflow Developer'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 70;
  const deleteSpeed = 35;
  const pauseEnd = 2000;

  function typeStep() {
    if (!typewriterEl) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let nextTimeout = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentPhrase.length) {
      nextTimeout = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      nextTimeout = 400;
    }

    setTimeout(typeStep, nextTimeout);
  }
  typeStep();

  // ==========================================
  // 4. LIVE SOC RADAR TELEMETRY STREAM & EPS
  // ==========================================
  const epsCounterEl = document.getElementById('live-eps-counter');
  const logFeedEl = document.getElementById('soc-log-feed');

  // Realistic EPS fluctuation
  setInterval(() => {
    if (!epsCounterEl) return;
    const baseEps = 1450;
    const fluctuation = Math.floor(Math.random() * 120) - 60;
    epsCounterEl.textContent = `${(baseEps + fluctuation).toLocaleString()} EPS`;
  }, 2200);

  // Periodic log streamer simulation
  const sampleLogs = [
    { type: 'info', svc: 'WAZUH-AGENT', msg: 'File integrity monitoring checksum verified for /etc/shadow.' },
    { type: 'warn', svc: 'SURICATA', msg: 'DNS tunneling probe detected from external IP 185.220.101.4.' },
    { type: 'alert', svc: 'SPLUNK-ES', msg: 'Correlation Alert: Potential Pass-The-Hash activity (T1550.002).' },
    { type: 'ok', svc: 'THEHIVE-SOAR', msg: 'Case #4092 auto-created; assigned to Tier-1 Analyst Queue.' },
    { type: 'info', svc: 'ZEEK-IDS', msg: 'SSL/TLS handshake analysis: JA3 signature verified benign.' },
    { type: 'ok', svc: 'OLLAMA-AI', msg: 'Natural language alert synopsis enriched with ATT&CK context.' }
  ];

  let logIndex = 0;
  setInterval(() => {
    if (!logFeedEl) return;
    const log = sampleLogs[logIndex];
    logIndex = (logIndex + 1) % sampleLogs.length;

    const now = new Date();
    const timeStr = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;

    const row = document.createElement('div');
    row.className = `log-row ${log.type}`;
    row.innerHTML = `<span class="log-ts">${timeStr}</span> <span class="log-svc">${log.svc}:</span> ${log.msg}`;

    logFeedEl.appendChild(row);

    // Keep max 5 rows
    while (logFeedEl.children.length > 5) {
      logFeedEl.removeChild(logFeedEl.firstChild);
    }
  }, 4200);

  // ==========================================
  // 5. SKILLS MATRIX FILTERING
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || filter === cat) {
          card.style.display = 'block';
          // Trigger progress bar reanimation
          const bars = card.querySelectorAll('.skill-progress');
          bars.forEach((bar) => {
            const w = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => { bar.style.width = w; }, 50);
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // 6. CV QUICK VIEW MODAL
  // ==========================================
  const cvModal = document.getElementById('cv-quick-modal');
  const viewCvBtn = document.getElementById('view-cv-btn');
  const closeCvBtn = document.getElementById('close-cv-modal');
  const cvBackdrop = document.getElementById('cv-backdrop');

  function openCvModal() {
    if (cvModal) {
      cvModal.classList.add('active');
      cvModal.setAttribute('aria-hidden', 'false');
      playCyberBeep(600, 'sine', 0.06, 0.03);
    }
  }

  function closeCvModal() {
    if (cvModal) {
      cvModal.classList.remove('active');
      cvModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (viewCvBtn) viewCvBtn.addEventListener('click', openCvModal);
  if (closeCvBtn) closeCvBtn.addEventListener('click', closeCvModal);
  if (cvBackdrop) cvBackdrop.addEventListener('click', closeCvModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cvModal && cvModal.classList.contains('active')) {
      closeCvModal();
    }
  });

  // ==========================================
  // 7. TOAST NOTIFICATIONS & CLIPBOARD
  // ==========================================
  window.showToast = function (message, iconName = 'check-circle') {
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
    }, 3200);
  };

  window.copyToClipboard = function (text, btnElement) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied to clipboard: ${text}`, 'clipboard-check');
        playCyberBeep(1040, 'triangle', 0.05, 0.04);
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  };

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(`Copied: ${text}`, 'check');
  }

  // ==========================================
  // 8. MOBILE MENU TOGGLE
  // ==========================================
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    // Close when clicking any nav link
    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  // ==========================================
  // 9. ACTIVE NAVIGATION SCROLLSPY
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================
  // 10. TRANSMISSION DISPATCH FORM HANDLER
  // ==========================================
  const contactForm = document.getElementById('contact-dispatch-form');
  const feedbackEl = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('dispatch-submit-btn');

      const name = contactForm.querySelector('#sender-name').value;
      const email = contactForm.querySelector('#sender-email').value;
      const subject = contactForm.querySelector('#subject-matter').value;
      const message = contactForm.querySelector('#message-payload').value;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>ENCRYPTING & DISPATCHING...</span>`;
      }

      // Simulate secure transmission handshake
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <i data-lucide="send" class="btn-icon"></i>
            <span>DISPATCH TRANSMISSION</span>
          `;
          if (window.lucide) lucide.createIcons();
        }

        if (feedbackEl) {
          feedbackEl.className = 'form-feedback success';
          feedbackEl.style.display = 'block';
          feedbackEl.innerHTML = `
            <strong>[TRANSMISSION ENCRYPTED & LOGGED]:</strong> Thank you, ${name}. Direct alert has been forwarded to <strong>abdoshehatalil9@gmail.com</strong>.
          `;
        }

        showToast('Secure Comms Dispatched!', 'send');
        playCyberBeep(1200, 'sine', 0.1, 0.04);
        contactForm.reset();

        // Also prepare mailto fallback link in case user wants instant email client
        const mailtoUri = `mailto:abdoshehatalil9@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Sender: " + name + "\nEmail: " + email + "\n\n" + message)}`;
        const autoLink = document.createElement('a');
        autoLink.href = mailtoUri;
        autoLink.target = '_blank';
        autoLink.click();
      }, 1000);
    });
  }

})();
