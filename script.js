// script.js — B.Guru Interactive Features

// ── DOM refs ──────────────────────────────────────────────────
const navLinks  = document.querySelector(".nav-links");
const hamburger = document.getElementById("hamburger");
const mainHeader = document.getElementById("main-header");
const fadeElements = document.querySelectorAll(".fade-in");

// ── Header: add .scrolled class on scroll ─────────────────────
window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    mainHeader?.classList.add("scrolled");
  } else {
    mainHeader?.classList.remove("scrolled");
  }
}, { passive: true });

// On page load (for inner pages that start scrolled)
if (mainHeader && window.scrollY > 40) mainHeader.classList.add("scrolled");
// Always add scrolled on non-index pages (nav needs dark bg from top)
if (mainHeader && !document.getElementById("home")) {
  mainHeader.classList.add("scrolled");
}

// ── Mobile menu toggle ────────────────────────────────────────
if (hamburger) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks?.classList.toggle("active");
    document.body.style.overflow = navLinks?.classList.contains("active") ? "hidden" : "";
  });
}

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger?.classList.remove("open");
    navLinks?.classList.remove("active");
    document.body.style.overflow = "";
  });
});

// ── Smooth scroll for anchor links ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ── Fade-in on scroll (Intersection Observer) ─────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

fadeElements.forEach(el => observer.observe(el));

// Trigger once on load too
function handleScrollAnimation() {
  fadeElements.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add("visible");
    }
  });
}
handleScrollAnimation();

// ── Currency Converter ────────────────────────────────────────
const converterForm = document.getElementById("converter-form");
const convertBtn    = document.getElementById("convert-btn");
const resultDiv     = document.getElementById("conversion-result");

const rates = {
  "USD-NGN": 1600,   "USD-INR": 83.5,   "USD-GHS": 15.2,
  "USD-CAD": 1.38,   "USD-EUR": 0.92,
  "EUR-GHS": 16.5,   "EUR-INR": 91,     "EUR-NGN": 1740,
  "NGN-USD": 0.000625, "INR-USD": 0.012,
  "GHS-USD": 0.066,  "CAD-USD": 0.725,  "EUR-USD": 1.087,
  "CAD-NGN": 1159,   "CAD-INR": 60.5,
};

function getRate(from, to) {
  if (from === to) return 1;
  const pair = `${from}-${to}`;
  const rev  = `${to}-${from}`;
  if (rates[pair]) return rates[pair];
  if (rates[rev])  return 1 / rates[rev];
  // try via USD
  const toUSD   = rates[`${from}-USD`] || (rates[`USD-${from}`] ? 1/rates[`USD-${from}`] : null);
  const fromUSD = rates[`USD-${to}`]   || (rates[`${to}-USD`]   ? 1/rates[`${to}-USD`]   : null);
  if (toUSD && fromUSD) return toUSD * fromUSD;
  return null;
}

if (converterForm) {
  converterForm.addEventListener("submit", e => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById("amount").value);
    const from   = document.getElementById("from-currency").value;
    const to     = document.getElementById("to-currency").value;

    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const rate = getRate(from, to);
    if (!rate) {
      resultDiv.innerHTML = "Rate unavailable for this pair.";
      resultDiv.style.display = "block";
      return;
    }

    const converted = (amount * rate).toLocaleString(undefined, { maximumFractionDigits: 2 });
    resultDiv.innerHTML = `${amount.toLocaleString()} ${from} ≈ <strong>${converted} ${to}</strong>`;
    resultDiv.style.display = "block";
    resultDiv.style.animation = "none";
    resultDiv.offsetHeight;
    resultDiv.style.animation = "fadeInUp 0.4s ease";
  });
}

// ── Live Rates Simulation ─────────────────────────────────────
const baseRates = [1600.45, 83.72, 15.28, 16.52, 1.38];

function updateLiveRates() {
  const rateEls   = document.querySelectorAll(".rate-value");
  const changeEls = document.querySelectorAll(".rate-change");

  rateEls.forEach((el, i) => {
    const base   = baseRates[i % baseRates.length];
    const delta  = (Math.random() - 0.5) * base * 0.001;
    const newVal = (base + delta).toFixed(base > 100 ? 2 : 4);
    el.textContent = newVal;

    const changeEl = changeEls[i];
    if (!changeEl) return;
    const pct = ((delta / base) * 100).toFixed(3);
    if (delta > 0) {
      changeEl.textContent = `+${pct}%`;
      changeEl.className = "rate-change positive";
    } else {
      changeEl.textContent = `${pct}%`;
      changeEl.className = "rate-change negative";
    }
  });
}

setInterval(updateLiveRates, 5000);
updateLiveRates();

// ── Contact Form ──────────────────────────────────────────────
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    const btn = contactForm.querySelector(".submit-btn");
    btn.textContent = "✓ Message Sent!";
    btn.style.background = "var(--green)";
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> &nbsp;Send Message';
      btn.style.background = "";
      contactForm.reset();
    }, 3000);
  });
}

// ── WhatsApp CTA ──────────────────────────────────────────────
const WA_NUMBER = "1234567890"; // ← replace with real number

document.querySelectorAll(".cta-whatsapp").forEach(btn => {
  // skip the FAB which is a different element
  if (btn.classList.contains("whatsapp-btn")) return;
  btn.addEventListener("click", e => {
    e.preventDefault();
    const msg = encodeURIComponent("Hello, I want to exchange currency with B.Guru!");
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  });
});

document.querySelectorAll(".whatsapp-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    const msg = encodeURIComponent("Hello, I want to exchange currency with B.Guru!");
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  });
});
