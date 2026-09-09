/**
 * JAGADAMBA B - PORTFOLIO INTERACTIVITY SCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initProjectFiltering();
  initProjectModals();
  initResumeModal();
  initInteractiveSimulations();
  initContactInteractions();
  initScrollEffects();
});

/* =========================================================
   1. THEME SWITCHER (Dark / Light)
   ========================================================= */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  
  // Check localStorage or preferred color scheme
  const savedTheme = localStorage.getItem('jb_portfolio_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = savedTheme || (prefersDark ? 'dark' : 'dark'); // default to dark
  setTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      localStorage.setItem('jb_portfolio_theme', newTheme);
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
      themeToggleBtn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }
  }
}

/* =========================================================
   2. MOBILE NAVIGATION & ACTIVE LINK TRACKING
   ========================================================= */
function initNavigation() {
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');

  if (mobileToggleBtn && navLinks) {
    mobileToggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('nav-open');
      const isOpen = navLinks.classList.contains('nav-open');
      mobileToggleBtn.setAttribute('aria-expanded', isOpen);
      mobileToggleBtn.textContent = isOpen ? '✕' : '☰';
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('nav-open');
        mobileToggleBtn.textContent = '☰';
      });
    });
  }

  // Active section observer
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));
}

/* =========================================================
   3. PROJECT FILTERING
   ========================================================= */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* =========================================================
   4. PROJECT MODALS DATA & BEHAVIOR
   ========================================================= */
const PROJECT_DETAILS = {
  atm: {
    title: "ATM Cash Demand Forecasting Using ML",
    category: "Machine Learning & Forecasting",
    icon: "🏧",
    description: "A machine learning pipeline to accurately predict daily ATM cash requirements using time-series features, seasonal demand shifts, holiday spikes, and geographic transaction clustering.",
    problem: "Financial institutions face high operational penalties for both ATM cash dry-outs and unnecessary idle capital locked in cash cassettes.",
    solution: "Trained predictive regression models on historical transaction datasets. Engineered dynamic features (day of week, holiday indicators, proximity to pay-days, seasonal trends) to generate reliable cash dispensing forecasts.",
    outcomes: [
      "Reduced forecast error margins and helped prevent cash run-outs during peak paydays.",
      "Optimized replenishment dispatch cycles, reducing logistics overhead.",
      "Enabled actionable analytics for branch managers through forecast confidence bands."
    ],
    techStack: ["Python", "Pandas", "Scikit-learn", "NumPy", "Matplotlib", "Seaborn"],
    interactiveType: "atm-slider"
  },
  bitcoin: {
    title: "Bitcoin Transaction Verification & Double-Spending Prevention",
    category: "Blockchain & Cryptography",
    icon: "⛓️",
    description: "A cryptographic transaction verification and ledger integrity model preventing double-spending vulnerabilities through UTXO validation and hash chain consensus logic.",
    problem: "Digital peer-to-peer currencies face the existential risk of malicious actors attempting to duplicate digital tokens or double-spend the same unspent transaction output.",
    solution: "Constructed an algorithmic verification model using SHA-256 cryptographic hashing, digital signature validation, and historical transaction graph traversal to ensure transactions cannot be spent more than once.",
    outcomes: [
      "Deterministic verification of transaction chains back to genesis or validated blocks.",
      "Instant detection and rejection of conflicting double-spend candidate transactions.",
      "Deep understanding of distributed ledger protocols, cryptographic signing, and consensus rules."
    ],
    techStack: ["Blockchain", "Bitcoin Architecture", "Cryptography", "SHA-256", "Python", "Data Structures"],
    interactiveType: "crypto-verify"
  },
  bmw: {
    title: "BMW Sales Analysis & Executive Dashboard",
    category: "Business Intelligence & Analytics",
    icon: "📊",
    description: "An interactive executive business intelligence dashboard analyzing multi-year BMW vehicle sales metrics, customer demographics, trim popularity, and regional market profitability.",
    problem: "Disparate automotive sales spreadsheets provided no cohesive visibility into model performance, inventory velocity, or geographical revenue distribution.",
    solution: "Designed a relational data model in Power BI, created custom DAX KPIs (YoY Revenue Growth, Average Transaction Value, Model Contribution %), and built dynamic drill-through filters for region, year, and fuel type.",
    outcomes: [
      "Real-time visual monitoring of high-margin EV and SUV series versus traditional sedans.",
      "Interactive slicing by regional dealerships allowing executive trend forecasting.",
      "Automated summary reports replacing manual Excel reporting tasks."
    ],
    techStack: ["Power BI", "DAX", "Microsoft Excel", "Data Modeling", "KPI Architecture", "Data Cleaning"],
    interactiveType: "sales-kpi"
  }
};

function initProjectModals() {
  const modalOverlay = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-dynamic-content');
  const closeBtn = document.getElementById('modal-close-btn');
  const viewDetailBtns = document.querySelectorAll('.view-project-btn');

  viewDetailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      const project = PROJECT_DETAILS[projectId];
      if (!project) return;

      modalBody.innerHTML = generateModalHTML(project);
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Re-initialize demo widgets inside the modal
      setupDemoWidget(project.interactiveType);
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

function generateModalHTML(project) {
  return `
    <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
      <span style="font-size: 2.2rem; background: var(--bg-secondary); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">${project.icon}</span>
      <div>
        <span class="section-tag" style="margin-bottom: 4px; font-size: 0.75rem;">${project.category}</span>
        <h3 style="font-size: 1.5rem; line-height: 1.25;">${project.title}</h3>
      </div>
    </div>
    
    <p style="font-size: 1rem; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.7;">${project.description}</p>
    
    <div style="background: var(--bg-secondary); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 20px;">
      <h4 style="font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-primary); margin-bottom: 6px;">Problem Statement</h4>
      <p style="font-size: 0.92rem; margin-bottom: 14px; color: var(--text-primary);">${project.problem}</p>
      
      <h4 style="font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-secondary); margin-bottom: 6px;">Engineering Solution</h4>
      <p style="font-size: 0.92rem; color: var(--text-primary);">${project.solution}</p>
    </div>

    <h4 style="font-size: 1.05rem; margin-bottom: 10px;">Key Outcomes & Impact</h4>
    <ul style="list-style: none; margin-bottom: 20px;">
      ${project.outcomes.map(item => `
        <li style="font-size: 0.9rem; color: var(--text-secondary); position: relative; padding-left: 20px; margin-bottom: 8px;">
          <span style="position: absolute; left: 0; color: var(--success); font-weight: bold;">✔</span> ${item}
        </li>
      `).join('')}
    </ul>

    <h4 style="font-size: 0.95rem; margin-bottom: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Technologies Used</h4>
    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;">
      ${project.techStack.map(t => `<span class="tech-tag" style="background: var(--bg-card); border: 1px solid var(--border-subtle); color: var(--text-primary); font-size: 0.82rem; padding: 6px 12px;">${t}</span>`).join('')}
    </div>

    <!-- Live Interactive Simulation Sandbox -->
    <div class="demo-interactive-widget" id="demo-widget-container">
      <!-- Injected via setupDemoWidget -->
    </div>
  `;
}

/* =========================================================
   5. INTERACTIVE LIVE SIMULATION WIDGETS
   ========================================================= */
function initInteractiveSimulations() {
  // Helpers available for modal
}

function setupDemoWidget(type) {
  const container = document.getElementById('demo-widget-container');
  if (!container) return;

  if (type === 'atm-slider') {
    container.innerHTML = `
      <div class="widget-title">
        <span>⚡ Interactive ML Demand Simulator</span>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
        Adjust the parameters below to see how the model dynamically recalculates predicted cash requirement for ATM Unit #402.
      </p>
      <div class="widget-control-row">
        <div class="widget-slider-label">
          <span>Day of Week / Traffic</span>
          <span id="day-val" style="color: var(--accent-primary);">Friday (High Peak)</span>
        </div>
        <input type="range" class="widget-slider" id="traffic-slider" min="1" max="7" value="5">
      </div>
      <div class="widget-control-row">
        <div class="widget-slider-label">
          <span>Nearby Holiday / Payday Event</span>
          <span id="holiday-val" style="color: var(--accent-secondary);">Yes (+40%)</span>
        </div>
        <input type="range" class="widget-slider" id="holiday-slider" min="0" max="1" value="1">
      </div>
      <div class="widget-result-box">
        <div>
          <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Model Forecasted Dispense</div>
          <div style="font-size: 1.4rem; font-weight: 800; color: var(--success);" id="atm-prediction-out">₹ 4,85,000</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Confidence Band</div>
          <div style="font-size: 0.95rem; font-weight: 700; color: var(--accent-primary);">96.4% R² Score</div>
        </div>
      </div>
    `;

    const trafficSlider = document.getElementById('traffic-slider');
    const holidaySlider = document.getElementById('holiday-slider');
    const dayVal = document.getElementById('day-val');
    const holidayVal = document.getElementById('holiday-val');
    const predictionOut = document.getElementById('atm-prediction-out');

    const days = ['Monday (Low)', 'Tuesday (Standard)', 'Wednesday (Standard)', 'Thursday (Moderate)', 'Friday (High Peak)', 'Saturday (Weekend Surge)', 'Sunday (Standard)'];
    const baseAmounts = [180000, 210000, 230000, 270000, 350000, 390000, 260000];

    function updateAtm() {
      const idx = parseInt(trafficSlider.value) - 1;
      const hasHoliday = parseInt(holidaySlider.value) === 1;

      dayVal.textContent = days[idx];
      holidayVal.textContent = hasHoliday ? 'Yes (+40%)' : 'No (Normal)';

      let amount = baseAmounts[idx];
      if (hasHoliday) amount = Math.round(amount * 1.38);

      predictionOut.textContent = `₹ ${amount.toLocaleString('en-IN')}`;
    }

    trafficSlider.addEventListener('input', updateAtm);
    holidaySlider.addEventListener('input', updateAtm);
  } else if (type === 'crypto-verify') {
    container.innerHTML = `
      <div class="widget-title">
        <span>⚡ Cryptographic Double-Spend Validator Sandbox</span>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">
        Simulate an incoming transaction verification against the active ledger state.
      </p>
      <div style="display: flex; gap: 10px; margin-bottom: 14px; flex-wrap: wrap;">
        <button class="btn btn-sm btn-outline" id="btn-test-valid" style="flex: 1;">Test Valid UTXO</button>
        <button class="btn btn-sm btn-outline" id="btn-test-double" style="flex: 1; border-color: #ef4444; color: #ef4444;">Simulate Double-Spend Attack</button>
      </div>
      <div class="widget-result-box" id="crypto-result-box" style="display: block;">
        <div style="font-family: monospace; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px;" id="crypto-hash">
          TX_HASH: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
        </div>
        <div style="font-weight: 700; color: var(--success);" id="crypto-status">
          STATUS: ✔ VALID TRANSACTION — UTXO Unspent & Cryptographically Signed
        </div>
      </div>
    `;

    const btnValid = document.getElementById('btn-test-valid');
    const btnDouble = document.getElementById('btn-test-double');
    const cryptoHash = document.getElementById('crypto-hash');
    const cryptoStatus = document.getElementById('crypto-status');
    const resultBox = document.getElementById('crypto-result-box');

    btnValid.addEventListener('click', () => {
      cryptoHash.textContent = 'TX_HASH: ' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
      cryptoStatus.textContent = 'STATUS: ✔ VALID TRANSACTION — UTXO Unspent & Verified In Block #849,201';
      cryptoStatus.style.color = 'var(--success)';
      resultBox.style.borderColor = 'var(--success)';
    });

    btnDouble.addEventListener('click', () => {
      cryptoHash.textContent = 'TX_HASH: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      cryptoStatus.textContent = 'STATUS: 🛑 BLOCKED! DOUBLE-SPENDING DETECTED — UTXO Already Spent In Prior Block';
      cryptoStatus.style.color = '#ef4444';
      resultBox.style.borderColor = '#ef4444';
    });
  } else if (type === 'sales-kpi') {
    container.innerHTML = `
      <div class="widget-title">
        <span>⚡ Interactive Power BI KPI Explorer</span>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">
        Filter by region to observe real-time aggregated sales metrics and best-selling model segment.
      </p>
      <div style="display: flex; gap: 8px; margin-bottom: 14px;">
        <button class="btn btn-sm btn-outline active-kpi-btn" data-reg="global" style="flex: 1; padding: 6px;">Global</button>
        <button class="btn btn-sm btn-outline" data-reg="na" style="flex: 1; padding: 6px;">North America</button>
        <button class="btn btn-sm btn-outline" data-reg="eu" style="flex: 1; padding: 6px;">Europe</button>
        <button class="btn btn-sm btn-outline" data-reg="apac" style="flex: 1; padding: 6px;">Asia-Pacific</button>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div style="background: var(--bg-card); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.75rem; color: var(--text-muted);">Total Units Delivered</div>
          <div style="font-size: 1.25rem; font-weight: 800; color: var(--accent-primary);" id="bmw-units">2,555,341</div>
        </div>
        <div style="background: var(--bg-card); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.75rem; color: var(--text-muted);">Top Performing Segment</div>
          <div style="font-size: 1.1rem; font-weight: 800; color: var(--accent-secondary);" id="bmw-segment">BMW X-Series (SUV)</div>
        </div>
      </div>
    `;

    const regData = {
      global: { units: '2,555,341 Units', segment: 'BMW X-Series (SUV)' },
      na: { units: '392,246 Units', segment: 'BMW X5 & 3 Series' },
      eu: { units: '942,805 Units', segment: 'BMW i4 Electric & 3er' },
      apac: { units: '1,012,490 Units', segment: 'BMW 5 Series & X3' }
    };

    const kpiBtns = container.querySelectorAll('[data-reg]');
    const unitsEl = document.getElementById('bmw-units');
    const segmentEl = document.getElementById('bmw-segment');

    kpiBtns.forEach(b => {
      b.addEventListener('click', () => {
        kpiBtns.forEach(btn => {
          btn.style.background = 'transparent';
          btn.style.color = 'var(--text-primary)';
          btn.style.borderColor = 'var(--border-subtle)';
        });
        b.style.background = 'var(--badge-bg)';
        b.style.color = 'var(--accent-primary)';
        b.style.borderColor = 'var(--accent-primary)';

        const reg = b.getAttribute('data-reg');
        if (regData[reg]) {
          unitsEl.textContent = regData[reg].units;
          segmentEl.textContent = regData[reg].segment;
        }
      });
    });
  }
}

/* =========================================================
   6. CONTACT INTERACTIONS (Copy & Form Simulation)
   ========================================================= */
function initContactInteractions() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toast-msg');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied "${textToCopy}" to clipboard!`);
      }).catch(() => {
        // Fallback
        const tempInput = document.createElement('input');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast(`Copied to clipboard!`);
      });
    });
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Interactive Contact Form Handling
  const contactForm = document.getElementById('portfolio-contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        alert('Please fill out all required fields.');
        return;
      }

      // Show immediate feedback
      if (formStatus) {
        formStatus.textContent = `Thank you, ${name}! Your message has been prepared. Opening your default mail client...`;
        formStatus.classList.add('success');
      }

      // Prepare mailto link for seamless local response
      const mailtoUrl = `mailto:jyothinaayak24@gmail.com?subject=${encodeURIComponent('Inquiry from ' + name + ' via Portfolio')}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')')}`;
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 1000);

      contactForm.reset();
    });
  }
}

/* =========================================================
   7. SCROLL EFFECTS & REVEAL ANIMATIONS
   ========================================================= */
function initScrollEffects() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      if (scrollTopBtn) scrollTopBtn.classList.add('visible');
    } else {
      if (scrollTopBtn) scrollTopBtn.classList.remove('visible');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Reveal on scroll elements
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* =========================================================
   8. RESUME VIEWER MODAL
   ========================================================= */
function initResumeModal() {
  const resumeModal = document.getElementById('resume-modal');
  const closeBtn = document.getElementById('resume-modal-close-btn');
  const triggers = document.querySelectorAll('.view-resume-trigger');

  if (!resumeModal) return;

  function openResume() {
    resumeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeResume() {
    resumeModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // On desktop / tablet screens (> 768px), open embedded modal preview
      // On small mobile screens (<= 768px), allow default behavior to open PDF natively in a new browser tab
      if (window.innerWidth > 768) {
        e.preventDefault();
        openResume();
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeResume);

  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeResume();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
      closeResume();
    }
  });
}

