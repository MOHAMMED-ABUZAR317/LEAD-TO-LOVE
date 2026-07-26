/* ==========================================================================
   LEAD TO LOVE — interactions
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Scroll progress bar ---------- */
  const scrollProgress = document.getElementById('scrollProgress');
  const header = document.getElementById('siteHeader');
  const toTopBtn = document.getElementById('toTop');

  function onScroll(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';

    header.classList.toggle('scrolled', scrollTop > 12);
    toTopBtn.classList.toggle('show', scrollTop > 500);

    updatePathDraw();
    updateActiveNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Mobile nav ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  }));

  /* ---------- Active nav link highlight ---------- */
  const sections = ['causes', 'path', 'give', 'stories', 'join']
    .map(id => document.getElementById(id)).filter(Boolean);
  const navLinks = document.querySelectorAll('.nav-link');
  function updateActiveNav(){
    let current = null;
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 140 && rect.bottom >= 140) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  /* ---------- Reveal-on-scroll (fade/slide up) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const causeBars = document.querySelectorAll('.cause-bar span');
  causeBars.forEach(bar => { bar.dataset.target = bar.style.width; bar.style.width = '0%'; });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        const bar = entry.target.querySelector && entry.target.querySelector('.cause-bar span');
        if (bar) setTimeout(() => { bar.style.width = bar.dataset.target; }, 200);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated impact counters ---------- */
  const counters = document.querySelectorAll('.impact-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el){
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString('en-IN') + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString('en-IN') + suffix;
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Path draw-on-scroll (SVG signature element) ---------- */
  const pathTrack = document.querySelector('.path-track');
  const drawPath = document.getElementById('drawPath');
  const PATH_LENGTH = 1400;
  function updatePathDraw(){
    if (!pathTrack || !drawPath) return;
    const rect = pathTrack.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height + vh * 0.6;
    const traveled = vh * 0.85 - rect.top;
    let progress = traveled / total;
    progress = Math.max(0, Math.min(1, progress));
    drawPath.style.strokeDashoffset = PATH_LENGTH * (1 - progress);
  }

  /* ---------- Cause filter ---------- */
  const filterChips = document.querySelectorAll('.filter-chip');
  const causeCards = document.querySelectorAll('.cause-card');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;
      causeCards.forEach(card => {
        const match = filter === 'all' || card.dataset.cat === filter;
        card.classList.toggle('hide', !match);
      });
    });
  });

  /* ---------- Button ripple effect ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e){
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-el';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------- Donation calculator ---------- */
  const amountSlider = document.getElementById('amountSlider');
  const amountInput = document.getElementById('amountInput');
  const chips = document.querySelectorAll('.chip');
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  const impactCount = document.getElementById('impactCount');
  const impactLabel = document.getElementById('impactLabel');
  const impactEmoji = document.querySelector('.impact-emoji');
  const donateBtn = document.getElementById('donateBtn');
  const btnLabel = donateBtn.querySelector('.btn-label');

  let frequency = 'once';

  function tierFor(amount){
    if (amount < 800)   return { emoji: '🍲', per: 10,  label: 'warm meals' };
    if (amount < 2200)  return { emoji: '📚', per: 300, label: 'school-day kits' };
    if (amount < 4000)  return { emoji: '🩺', per: 500, label: 'clinic visits' };
    return { emoji: '🏠', per: 1200, label: 'nights of shelter' };
  }

  function updateImpact(amount){
    amount = Math.max(100, Math.min(100000, amount));
    const tier = tierFor(amount);
    const count = Math.max(1, Math.round(amount / tier.per));
    impactEmoji.textContent = tier.emoji;
    impactCount.textContent = count;
    impactLabel.textContent = tier.label + (frequency === 'monthly' ? ' every month' : ' for a family this week');
    const freqWord = frequency === 'monthly' ? '/mo' : '';
    btnLabel.textContent = `Confirm ₹${amount.toLocaleString('en-IN')}${freqWord} gift`;
  }

  function setAmount(amount){
    amount = Math.max(100, Math.min(100000, Math.round(amount)));
    amountSlider.value = Math.min(10000, amount);
    amountInput.value = amount;
    chips.forEach(c => c.classList.toggle('active', parseInt(c.dataset.amount, 10) === amount));
    updateImpact(amount);
  }

  amountSlider.addEventListener('input', () => setAmount(parseInt(amountSlider.value, 10)));
  amountInput.addEventListener('input', () => {
    const val = parseInt(amountInput.value, 10) || 0;
    setAmount(val);
  });
  chips.forEach(chip => chip.addEventListener('click', () => setAmount(parseInt(chip.dataset.amount, 10))));
  toggleBtns.forEach(btn => btn.addEventListener('click', () => {
    toggleBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    frequency = btn.dataset.freq;
    updateImpact(parseInt(amountInput.value, 10));
  }));

  setAmount(1500);

  const toast = document.getElementById('donateToast');
  const toastTitle = document.getElementById('toastTitle');
  const toastBody = document.getElementById('toastBody');
  donateBtn.addEventListener('click', () => {
    const amount = parseInt(amountInput.value, 10) || 0;
    const tier = tierFor(amount);
    const count = Math.max(1, Math.round(amount / tier.per));
    toastTitle.textContent = 'Thank you for walking this path!';
    toastBody.textContent = `₹${amount.toLocaleString('en-IN')} is on its way to become ${count} ${tier.label}.`;
    showToast();
  });

  let toastTimer;
  function showToast(){
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
  }

  /* ---------- Testimonial carousel ---------- */
  const track = document.getElementById('carouselTrack');
  const dotsWrap = document.getElementById('carouselDots');
  const slides = track.children.length;
  let current = 0;
  let autoTimer;

  for (let i = 0; i < slides; i++){
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  }
  const dots = dotsWrap.children;

  function goTo(index){
    current = (index + slides) % slides;
    track.style.transform = `translateX(-${current * 100}%)`;
    Array.from(dots).forEach((d, i) => d.classList.toggle('active', i === current));
  }
  function autoAdvance(){ goTo(current + 1); }
  function resetAuto(){ clearInterval(autoTimer); autoTimer = setInterval(autoAdvance, 5500); }

  document.getElementById('nextStory').addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  document.getElementById('prevStory').addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  resetAuto();

  /* ---------- Join form validation ---------- */
  const joinForm = document.getElementById('joinForm');
  const joinSuccess = document.getElementById('joinSuccess');
  joinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const nameField = document.getElementById('fname');
    const emailField = document.getElementById('femail');

    toggleFieldError(nameField, nameField.value.trim().length > 1);
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim());
    toggleFieldError(emailField, emailOk);

    if (nameField.value.trim().length <= 1) valid = false;
    if (!emailOk) valid = false;

    if (valid){
      joinSuccess.classList.add('show');
      joinForm.reset();
      setTimeout(() => joinSuccess.classList.remove('show'), 5000);
    }
  });

  function toggleFieldError(input, isValid){
    const field = input.closest('.field');
    field.classList.toggle('invalid', !isValid);
  }

  /* ---------- Newsletter form ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailField = document.getElementById('newsEmail');
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim());
    if (!emailOk){
      emailField.style.borderColor = 'var(--rose)';
      return;
    }
    emailField.style.borderColor = '';
    toastTitle.textContent = "You're on the list!";
    toastBody.textContent = "Look out for your first update from the field soon.";
    showToast();
    newsletterForm.reset();
  });

});