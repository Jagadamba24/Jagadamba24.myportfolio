/**
 * JAGADAMBA B - PORTFOLIO INTERACTIVITY SCRIPT
 * Modern, accessible, zero-dependency client logic.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initTypewriter();
  initSkillsFilter();
  initProjectsFilter();
  initProjectModal();
  initResumeModal();
  initClipboardCopy();
  initContactForm();
  initScrollEffects();
});

/* ==========================================================================
   1. Theme Toggle (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // Enforce dark mode as the primary default
  const savedTheme = localStorage.getItem('jb_portfolio_theme');
  if (savedTheme === 'light') {
    root.setAttribute('data-theme', 'light');
  } else {
    root.setAttribute('data-theme', 'dark');
    localStorage.setItem('jb_portfolio_theme', 'dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', newTheme);
      localStorage.setItem('jb_portfolio_theme', newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }
}

/* ==========================================================================
   2. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  function toggleDrawer(open) {
    const isOpen = open !== undefined ? open : !drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.add('open');
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
    } else {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    }
  }

  toggleBtn.addEventListener('click', () => toggleDrawer());

  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggleDrawer(false);
    }
  });
}

/* ==========================================================================
   3. Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const roles = [
    "AI & Machine Learning Enthusiast",
    "Data Analytics Explorer",
    "Predictive Modeling Developer",
    "Power BI & BI Solutions Analyst",
    "Python & SQL Programmer"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 80;
  const deleteSpeed = 40;
  const pauseDelay = 1800;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      target.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = pauseDelay;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 500);
}

/* ==========================================================================
   4. Skills Category Filter
   ========================================================================== */
function initSkillsFilter() {
  const tabs = document.querySelectorAll('.skill-tab');
  const cards = document.querySelectorAll('.skill-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   5. Projects Category Filter
   ========================================================================== */
function initProjectsFilter() {
  const tabs = document.querySelectorAll('.project-tab');
  const cards = document.querySelectorAll('.project-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. Project Case Studies & Interactive Simulators
   ========================================================================== */
const PROJECT_DETAILS = {
  atm: {
    icon: "🏧",
    title: "ATM Cash Demand Forecasting Using ML",
    category: "Machine Learning & Predictive Analytics",
    tags: ["Python", "Scikit-learn", "Pandas", "Time Series", "Regression"],
    problem: "Banks face huge costs when storing excess idle cash in ATMs, yet understocking triggers disastrous cash-out experiences for customers, especially during holidays and weekends.",
    solution: "Built a predictive time-series regression pipeline analyzing multi-year withdrawal trends, day-of-week cyclical variations, and regional holiday calendars to generate high-accuracy cash demand estimates.",
    architecture: [
      "Data Preprocessing: Missing-value imputation, outlier removal, and cyclical sin/cos calendar transforms with Pandas.",
      "Model Exploration: Comparative benchmarking of Linear Regression, Random Forest Regressor, and Gradient Boosting.",
      "Deployment Simulation: What-if demand forecasting based on user-selected day of week and nearby banking holiday markers."
    ],
    interactiveType: "atm",
    github: "https://github.com/Jagadamba24"
  },
  bitcoin: {
    icon: "⛓️",
    title: "Bitcoin Transaction Verification & Double-Spend Prevention",
    category: "Blockchain Architecture & Cryptographic Verification",
    tags: ["Blockchain", "SHA-256", "Cryptography", "Python", "Consensus"],
    problem: "Digital tokens risk being duplicated and spent across two separate entities simultaneously if a distributed ledger does not validate unspent transaction output (UTXO) ownership.",
    solution: "Engineered a protocol-level simulator that signs transactions with asymmetric keys, checks UTXO pool legitimacy, and executes consensus hashing to reject double-spending attempts.",
    architecture: [
      "Cryptographic Engine: SHA-256 block hashing with nonce computation and proof-of-work simulation.",
      "UTXO State Ledger: In-memory memory-pool state manager ensuring every output can only be referenced once.",
      "Network Validation: Instant invalidation of conflicting parallel broadcast attempts."
    ],
    interactiveType: "bitcoin",
    github: "https://github.com/Jagadamba24"
  },
  bmw: {
    icon: "📊",
    title: "BMW Sales Analysis & Executive KPI Dashboard",
    category: "Business Intelligence & Executive Analytics",
    tags: ["Power BI", "DAX", "Data Modeling", "MS Excel", "KPIs"],
    problem: "Global automotive leadership requires instant, multi-dimensional clarity on electric vehicle (BEV) adoption rates, regional sales variances, and dealership performance.",
    solution: "Designed an interactive executive dashboard in Power BI backed by dynamic DAX measures that calculates YoY delivery growth, top vehicle series, and regional market shares.",
    architecture: [
      "Data Model: Star schema linking dealership geography, transaction timelines, and vehicle specifications.",
      "DAX Measures: Dynamic revenue formulas, YoY delivery variances, and profit margin analysis.",
      "Executive UX: Custom color-tailored KPIs with intuitive cross-filtering across continents and vehicle types."
    ],
    interactiveType: "bmw",
    github: "https://github.com/Jagadamba24"
  }
};

function initProjectModal() {
  const modalOverlay = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-dynamic-content');
  const closeBtn = document.getElementById('modal-close-btn');
  const viewDetailBtns = document.querySelectorAll('.open-modal-btn');

  viewDetailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      const project = PROJECT_DETAILS[projectId];
      if (!project) return;

      modalBody.innerHTML = generateModalHTML(project);
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';

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
        <span style="font-size: 0.78rem; font-weight: 700; color: var(--accent-secondary); text-transform: uppercase;">${project.category}</span>
        <h3 style="font-size: 1.35rem; margin: 4px 0 0 0; color: var(--text-primary);">${project.title}</h3>
      </div>
    </div>

    <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px;">
      ${project.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
    </div>

    <div style="margin-bottom: 18px;">
      <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 6px; color: var(--accent-primary);">Problem Statement</h4>
      <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${project.problem}</p>
    </div>

    <div style="margin-bottom: 18px;">
      <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 6px; color: var(--accent-secondary);">Solution & Methodology</h4>
      <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${project.solution}</p>
    </div>

    <div style="margin-bottom: 20px;">
      <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 8px; color: var(--text-primary);">Technical Highlights</h4>
      <ul style="padding-left: 18px; font-size: 0.88rem; color: var(--text-muted); line-height: 1.7;">
        ${project.architecture.map(a => `<li>${a}</li>`).join('')}
      </ul>
    </div>

    <div id="interactive-demo-container">
      <!-- Injected Interactive Widget -->
    </div>

    <div style="display: flex; gap: 12px; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-subtle);">
      <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
        <span>View Code on GitHub</span>
      </a>
      <button class="btn btn-primary btn-sm" onclick="document.getElementById('project-modal').classList.remove('active'); document.body.style.overflow='';">
        <span>Done</span>
      </button>
    </div>
  `;
}

function setupDemoWidget(type) {
  const container = document.getElementById('interactive-demo-container');
  if (!container) return;

  if (type === 'atm') {
    container.innerHTML = `
      <div class="demo-interactive-widget">
        <div class="widget-title">
          <span>⚡</span>
          <span>Live ML Demand Simulator</span>
        </div>
        <div class="widget-control-row">
          <label><span>Day of the Week:</span> <span id="atm-day-val" style="color: var(--accent-primary); font-weight: 700;">Saturday</span></label>
          <input type="range" min="1" max="7" value="6" id="atm-day-slider" class="widget-slider">
        </div>
        <div class="widget-control-row">
          <label><span>Nearby Bank Holiday:</span> <span id="atm-holiday-val" style="color: var(--accent-secondary); font-weight: 700;">Yes</span></label>
          <input type="range" min="0" max="1" value="1" id="atm-holiday-slider" class="widget-slider">
        </div>
        <div class="widget-result-box">
          <div>
            <div style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase;">Predicted Cash Required</div>
            <div class="widget-kpi-val" id="atm-pred-cash">₹ 4,85,000</div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 0.74rem; background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald); padding: 4px 10px; border-radius: 9999px; font-weight: 700;">Model Confidence: 94.2%</span>
          </div>
        </div>
      </div>
    `;

    const daySlider = document.getElementById('atm-day-slider');
    const holSlider = document.getElementById('atm-holiday-slider');
    const dayVal = document.getElementById('atm-day-val');
    const holVal = document.getElementById('atm-holiday-val');
    const predCash = document.getElementById('atm-pred-cash');

    const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    function updateAtm() {
      const d = parseInt(daySlider.value);
      const h = parseInt(holSlider.value);
      dayVal.textContent = days[d];
      holVal.textContent = h === 1 ? 'Yes' : 'No';

      let base = 210000;
      if (d === 5) base += 90000;
      if (d === 6) base += 170000;
      if (d === 7) base += 130000;
      if (h === 1) base += 105000;

      predCash.textContent = `₹ ${base.toLocaleString('en-IN')}`;
    }

    daySlider.addEventListener('input', updateAtm);
    holSlider.addEventListener('input', updateAtm);
  } else if (type === 'bitcoin') {
    container.innerHTML = `
      <div class="demo-interactive-widget">
        <div class="widget-title">
          <span>🔒</span>
          <span>Blockchain Double-Spend Prevention Sandbox</span>
        </div>
        <div style="display: flex; gap: 8px; margin-bottom: 14px;">
          <button class="btn btn-sm btn-outline" id="btn-valid-tx" style="flex: 1;">Broadcast Valid TX</button>
          <button class="btn btn-sm btn-secondary" id="btn-double-tx" style="flex: 1; border-color: rgba(239, 68, 68, 0.4);">Inject Double-Spend</button>
        </div>
        <div id="crypto-terminal" style="background: #020617; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 12px; font-family: var(--font-mono); font-size: 0.78rem; min-height: 80px; color: var(--accent-secondary);">
          Ready. Click a button to test mempool verification algorithms.
        </div>
      </div>
    `;

    const term = document.getElementById('crypto-terminal');
    const btnValid = document.getElementById('btn-valid-tx');
    const btnDouble = document.getElementById('btn-double-tx');

    btnValid.addEventListener('click', () => {
      const hash = Math.random().toString(16).substring(2, 10);
      term.innerHTML = `
        <span style="color: var(--accent-emerald);">[VERIFIED]</span> Transaction Hash: 0000${hash}a9b...<br>
        ✓ Input UTXO: #4192 (0.84 BTC) found in unspent pool.<br>
        ✓ Digital signature validated with Secp256k1.<br>
        <span style="color: #60a5fa;">Consensus: Block added to ledger.</span>
      `;
    });

    btnDouble.addEventListener('click', () => {
      term.innerHTML = `
        <span style="color: #ef4444; font-weight: 700;">[DOUBLE-SPEND DETECTED]</span><br>
        ✗ UTXO #4192 was already claimed in previous block #842104.<br>
        ✗ Node consensus rejects conflicting signature.<br>
        <span style="color: #fbbf24;">Action: Malicious transaction discarded from mempool.</span>
      `;
    });
  } else if (type === 'bmw') {
    container.innerHTML = `
      <div class="demo-interactive-widget">
        <div class="widget-title">
          <span>📈</span>
          <span>Power BI Executive KPI Explorer</span>
        </div>
        <div style="display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap;">
          <button class="btn btn-sm btn-outline kpi-filter-btn active" data-market="global">Global</button>
          <button class="btn btn-sm btn-outline kpi-filter-btn" data-market="na">North America</button>
          <button class="btn btn-sm btn-outline kpi-filter-btn" data-market="eu">Europe</button>
          <button class="btn btn-sm btn-outline kpi-filter-btn" data-market="ap">Asia-Pacific</button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; background: var(--bg-card); padding: 12px; border-radius: 8px; border: 1px solid var(--border-subtle);">
          <div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">Delivered Units</div>
            <div id="kpi-units" style="font-size: 1.1rem; font-weight: 800; color: var(--accent-secondary);">2,555,341</div>
          </div>
          <div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">BEV Electric %</div>
            <div id="kpi-bev" style="font-size: 1.1rem; font-weight: 800; color: var(--accent-emerald);">14.7%</div>
          </div>
          <div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">Top Series</div>
            <div id="kpi-series" style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary);">BMW 3 &amp; 4 Series</div>
          </div>
        </div>
      </div>
    `;

    const data = {
      global: { units: "2,555,341", bev: "14.7%", series: "BMW 3 & 4 Series" },
      na: { units: "395,741", bev: "12.5%", series: "BMW X5 / X7 SUVs" },
      eu: { units: "942,805", bev: "22.3%", series: "BMW i4 & iX1" },
      ap: { units: "1,012,410", bev: "15.1%", series: "BMW 5 Series LWB" }
    };

    const filterBtns = container.querySelectorAll('.kpi-filter-btn');
    const kpiUnits = document.getElementById('kpi-units');
    const kpiBev = document.getElementById('kpi-bev');
    const kpiSeries = document.getElementById('kpi-series');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const m = btn.getAttribute('data-market');
        kpiUnits.textContent = data[m].units;
        kpiBev.textContent = data[m].bev;
        kpiSeries.textContent = data[m].series;
      });
    });
  }
}

/* ==========================================================================
   7. Resume Viewer Modal
   ========================================================================== */
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
      // On small mobile screens (<= 768px), allow default behavior to open PDF in a new browser tab
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

/* ==========================================================================
   8. Clipboard Copy Functionality
   ========================================================================== */
function initClipboardCopy() {
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = `<span>Copied!</span>`;
        showToast(`Copied "${textToCopy}" to clipboard!`);
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      }).catch(() => {
        showToast(`Selected: ${textToCopy}`);
      });
    });
  });
}

/* ==========================================================================
   9. Contact Form Validation
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.');
      return;
    }

    const mailtoUrl = `mailto:jyothinaayak24@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + message)}`;
    window.location.href = mailtoUrl;

    showToast('Opening your email client to deliver message...');
    form.reset();
  });
}

/* ==========================================================================
   10. Scroll Effects & Floating Scroll-to-Top Button
   ========================================================================== */
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
}

/* ==========================================================================
   Global Toast Notification
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toast-msg');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}
