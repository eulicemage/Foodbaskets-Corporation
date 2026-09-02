/**
 * FoodBaskets Corporation (FBC) - Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initServiceTabs();
  initMenuFilters();
  initQuoteCalculator();
  initInquiryForm();
  initBackToTop();
  initHeaderScroll();
});

/* Mobile Menu */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('close-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  function toggleMenu(show) {
    if (show) {
      mobileMenu.classList.remove('hidden');
      setTimeout(() => {
        mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
        mobileMenu.classList.add('opacity-100');
      }, 10);
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.classList.remove('opacity-100');
      mobileMenu.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
      }, 300);
      document.body.style.overflow = '';
    }
  }

  menuBtn.addEventListener('click', () => toggleMenu(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });
}

/* Header Scroll Glass Effect */
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('shadow-md');
    } else {
      header.classList.remove('shadow-md');
    }
  });
}

/* Service Tabs */
function initServiceTabs() {
  const tabButtons = document.querySelectorAll('.service-tab-btn');
  const tabContents = document.querySelectorAll('.service-tab-content');

  if (!tabButtons.length) return;

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-target');

      tabButtons.forEach(btn => {
        btn.classList.remove('active', 'bg-orange-600', 'text-white');
        btn.classList.add('bg-white', 'text-slate-700', 'hover:bg-slate-50');
      });

      button.classList.add('active', 'bg-orange-600', 'text-white');
      button.classList.remove('bg-white', 'text-slate-700', 'hover:bg-slate-50');

      tabContents.forEach(content => {
        if (content.id === target) {
          content.classList.remove('hidden');
          content.classList.add('animate-fadeIn');
        } else {
          content.classList.add('hidden');
          content.classList.remove('animate-fadeIn');
        }
      });
    });
  });
}

/* Menu Filter */
function initMenuFilters() {
  const filterBtns = document.querySelectorAll('.menu-filter-btn');
  const menuCards = document.querySelectorAll('.menu-item-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');

      filterBtns.forEach(b => {
        b.classList.remove('bg-orange-600', 'text-white', 'border-orange-600');
        b.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
      });

      btn.classList.add('bg-orange-600', 'text-white', 'border-orange-600');
      btn.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');

      menuCards.forEach(card => {
        const itemCategory = card.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.classList.add('hidden');
          }, 200);
        }
      });
    });
  });
}

/* Instant Quote / RFP Calculator */
function initQuoteCalculator() {
  const serviceTypeSelect = document.getElementById('calc-service');
  const headcountInput = document.getElementById('calc-headcount');
  const tierSelect = document.getElementById('calc-tier');
  const frequencySelect = document.getElementById('calc-frequency');
  const applyBtn = document.getElementById('apply-quote-btn');

  const unitCostEl = document.getElementById('est-unit-cost');
  const totalCostEl = document.getElementById('est-total-cost');
  const tierDescEl = document.getElementById('est-tier-desc');

  if (!serviceTypeSelect || !headcountInput || !unitCostEl || !totalCostEl) return;

  function calculate() {
    const service = serviceTypeSelect.value;
    const count = Math.max(10, parseInt(headcountInput.value) || 50);
    const tier = tierSelect ? tierSelect.value : 'standard';
    const frequency = frequencySelect ? frequencySelect.value : 'daily';

    let baseRate = 145; // Base PHP per meal/unit

    if (service === 'catering') {
      baseRate = tier === 'executive' ? 380 : tier === 'premium' ? 240 : 160;
    } else if (service === 'concession') {
      baseRate = tier === 'executive' ? 220 : tier === 'premium' ? 160 : 120;
    } else if (service === 'commissary') {
      baseRate = tier === 'executive' ? 190 : tier === 'premium' ? 140 : 95;
    } else if (service === 'trade') {
      baseRate = tier === 'executive' ? 150 : tier === 'premium' ? 110 : 80;
    }

    // Volume discount
    if (count > 500) {
      baseRate *= 0.90;
    } else if (count > 200) {
      baseRate *= 0.94;
    }

    const roundedUnit = Math.round(baseRate);
    let multiplier = 1;
    let periodText = 'per event / batch';

    if (frequency === 'daily') {
      multiplier = 1;
      periodText = 'per single day';
    } else if (frequency === 'monthly') {
      multiplier = 22; // approx 22 working days
      periodText = 'per month (22 corporate days)';
    }

    const totalEstimate = roundedUnit * count * multiplier;

    unitCostEl.textContent = `₱${roundedUnit.toLocaleString()}`;
    totalCostEl.textContent = `₱${totalEstimate.toLocaleString()}`;
    if (tierDescEl) {
      tierDescEl.textContent = `Estimated for ${count.toLocaleString()} pax/units (${periodText})`;
    }
  }

  [serviceTypeSelect, headcountInput, tierSelect, frequencySelect].forEach(el => {
    if (el) {
      el.addEventListener('input', calculate);
      el.addEventListener('change', calculate);
    }
  });

  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const inquiryService = document.getElementById('inquiry-service');
      const inquiryHeadcount = document.getElementById('inquiry-headcount');
      const inquiryNotes = document.getElementById('inquiry-message');

      if (inquiryService) inquiryService.value = serviceTypeSelect.value;
      if (inquiryHeadcount) inquiryHeadcount.value = headcountInput.value;
      if (inquiryNotes) {
        inquiryNotes.value = `Calculated Estimate Details: Tier: ${tierSelect.value.toUpperCase()}, Frequency: ${frequencySelect.value.toUpperCase()}. Ready to discuss customized corporate package.`;
      }

      // Scroll to contact form smoothly
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        showToast('Calculator parameters transferred to RFP form below!', 'success');
      }
    });
  }

  calculate();
}

/* Inquiry Form Submission */
function initInquiryForm() {
  const form = document.getElementById('rfp-inquiry-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('inquiry-name');
    const emailInput = document.getElementById('inquiry-email');
    const companyInput = document.getElementById('inquiry-company');

    if (!nameInput.value.trim() || !emailInput.value.trim()) {
      showToast('Please provide your name and contact email.', 'error');
      return;
    }

    // Success simulation
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Submitting RFP...`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      showToast('Thank you! Your proposal request has been received. An FBC Account Executive will reach out shortly.', 'success');
      form.reset();
    }, 1200);
  });
}

/* Toast System */
function showToast(message, type = 'success') {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 transition-all duration-300 transform hide';
    document.body.appendChild(toast);
  }

  const isSuccess = type === 'success';
  toast.className = `fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 text-white transition-all duration-300 transform ${
    isSuccess ? 'bg-emerald-700 border-l-4 border-emerald-400' : 'bg-red-700 border-l-4 border-red-400'
  }`;

  toast.innerHTML = `
    <i class="fa-solid ${isSuccess ? 'fa-circle-check text-xl' : 'fa-triangle-exclamation text-xl'}"></i>
    <span class="text-sm font-medium">${message}</span>
  `;

  toast.classList.remove('hide');
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
  }, 4500);
}

/* Back to Top */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.remove('opacity-0', 'pointer-events-none');
      btn.classList.add('opacity-100');
    } else {
      btn.classList.add('opacity-0', 'pointer-events-none');
      btn.classList.remove('opacity-100');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

