/* ── main.js — B.Guru Transfer Agency ── */

/* ── 1. MOBILE NAV ── */
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobile-nav");
const mobileOverlay = document.getElementById("mobile-overlay");
const mobileClose = document.getElementById("mobile-close");

function openNav() {
  hamburger.classList.add("open");
  mobileNav.classList.add("open");
  mobileOverlay.classList.add("visible");
  document.body.style.overflow = "hidden";
}
function closeNav() {
  hamburger.classList.remove("open");
  mobileNav.classList.remove("open");
  mobileOverlay.classList.remove("visible");
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", () => {
  mobileNav.classList.contains("open") ? closeNav() : openNav();
});
mobileClose.addEventListener("click", closeNav);
mobileOverlay.addEventListener("click", closeNav);
document
  .querySelectorAll(".mob-link")
  .forEach((link) => link.addEventListener("click", closeNav));

/* ── 2. STICKY NAV SCROLL EFFECT ── */
const nav = document.querySelector("nav");
window.addEventListener(
  "scroll",
  () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  },
  { passive: true },
);

/* ── 3. REVEAL ON SCROLL ── */
const revealEls = document.querySelectorAll("[data-reveal]");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);
revealEls.forEach((el) => revealObserver.observe(el));

/* ── 4. COUNT-UP ANIMATION ── */
function animateCount(el, target, suffix = "") {
  const duration = 1600;
  const start = performance.now();
  const isDecimal = String(target).includes(".");

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = ease * target;
    el.textContent = isDecimal
      ? value.toFixed(1)
      : Math.floor(value).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else
      el.textContent = isDecimal
        ? target.toFixed(1)
        : Number(target).toLocaleString();
  }
  requestAnimationFrame(step);
}

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const val = parseFloat(el.dataset.count);
        animateCount(el, val);
        countObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.4 },
);
document
  .querySelectorAll("[data-count]")
  .forEach((el) => countObserver.observe(el));

/* ── 5. RATING BAR ANIMATION ── */
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".rs-bar-fill").forEach((bar) => {
          const w = bar.style.width;
          bar.style.width = "0";
          setTimeout(() => {
            bar.style.width = w;
          }, 100);
        });
        barObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 },
);
const reviewStats = document.querySelector(".review-stats");
if (reviewStats) barObserver.observe(reviewStats);

/* ── 6. LIVE RATES TABLE ── */

// Currency data for the 6 supported currencies (vs USD)
const CURRENCIES = [
  { code: "EUR", name: "Euro", flag: "🇪🇺", baseRate: 0.92 },
  { code: "NGN", name: "Naira", flag: "🇳🇬", baseRate: 1520 },
  { code: "XAF", name: "CFA Franc", flag: "🇨🇲", baseRate: 605 },
  { code: "GHS", name: "Ghana Cedis", flag: "🇬🇭", baseRate: 15.2 },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳", baseRate: 83.6 },
];

let liveRates = {}; // code -> rate (vs USD)
let prevRates = {};

// Try to get real rates from a free, no-key-required API
async function fetchRates() {
  try {
    const codes = CURRENCIES.map((c) => c.code).join(",");
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=USD&to=${codes}`,
      { signal: AbortSignal.timeout(5000) },
    );
    if (!res.ok) throw new Error("API fail");
    const data = await res.json();
    prevRates = { ...liveRates };
    liveRates = { USD: 1, ...data.rates };
  } catch {
    // Fallback: simulate slight drift from base rates
    prevRates = { ...liveRates };
    CURRENCIES.forEach((c) => {
      const prev = liveRates[c.code] || c.baseRate;
      const drift = (Math.random() - 0.5) * prev * 0.002;
      liveRates[c.code] = parseFloat((prev + drift).toFixed(4));
    });
    liveRates["USD"] = 1;
  }
  renderRatesTable();
  updateConverter();
}

function renderRatesTable() {
  const tbody = document.getElementById("rates-body");
  if (!tbody) return;
  tbody.innerHTML = "";
  CURRENCIES.forEach((c) => {
    const rate = liveRates[c.code];
    if (!rate) return;
    const prev = prevRates[c.code] || rate;
    const change = ((rate - prev) / prev) * 100;
    const changeStr =
      change >= 0
        ? `<span class="rate-change up">▲ ${change.toFixed(3)}%</span>`
        : `<span class="rate-change down">▼ ${Math.abs(change).toFixed(3)}%</span>`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.flag} ${c.name}</td>
      <td><strong>${c.code}</strong></td>
      <td class="rate-num">${rate >= 1 ? rate.toFixed(2) : rate.toFixed(4)}</td>
      <td>${changeStr}</td>
    `;
    // Flash animation on update
    tr.style.animation = "none";
    tbody.appendChild(tr);
    requestAnimationFrame(() => {
      tr.style.transition = "background 0.6s";
      tr.style.background = "rgba(196,168,232,0.2)";
      setTimeout(() => (tr.style.background = ""), 800);
    });
  });
}

// Fetch immediately and then every 30 seconds
fetchRates();
setInterval(fetchRates, 30000);

/* ── 7. CURRENCY CONVERTER ── */
const convAmount = document.getElementById("conv-amount");
const convFrom = document.getElementById("conv-from");
const convTo = document.getElementById("conv-to");
const convNum = document.getElementById("conv-num");
const convLabel = document.getElementById("conv-label");
const convRate = document.getElementById("conv-rate-display");
const swapBtn = document.getElementById("swap-btn");

function getRate(code) {
  return (
    liveRates[code] || CURRENCIES.find((c) => c.code === code)?.baseRate || 1
  );
}

function updateConverter() {
  const amount = parseFloat(convAmount?.value) || 0;
  const from = convFrom?.value;
  const to = convTo?.value;
  if (!from || !to || !convNum) return;

  // Convert: amount (from) → USD → to
  const rateFrom = getRate(from);
  const rateTo = getRate(to);
  const result = (amount / rateFrom) * rateTo;

  if (amount === 0) {
    convNum.textContent = "—";
    convLabel.textContent = "Enter an amount to convert";
    convRate.textContent = "";
    return;
  }

  // Animate result
  convNum.style.transform = "scale(0.9)";
  convNum.style.opacity = "0";
  setTimeout(() => {
    convNum.textContent =
      result >= 1000
        ? result.toLocaleString("en", { maximumFractionDigits: 2 })
        : result.toFixed(4);
    convLabel.textContent = `${from} → ${to}`;
    convNum.style.transform = "scale(1)";
    convNum.style.opacity = "1";
    convNum.style.transition = "transform 0.25s, opacity 0.25s";
  }, 150);

  const perUnit = (1 / rateFrom) * rateTo;
  convRate.textContent = `1 ${from} = ${perUnit >= 1 ? perUnit.toFixed(4) : perUnit.toFixed(6)} ${to}`;
}

convAmount?.addEventListener("input", updateConverter);
convFrom?.addEventListener("change", updateConverter);
convTo?.addEventListener("change", updateConverter);

swapBtn?.addEventListener("click", () => {
  const tmp = convFrom.value;
  convFrom.value = convTo.value;
  convTo.value = tmp;
  updateConverter();
});

/* ── 8. CONTACT FORM → WHATSAPP ── */
document.getElementById("cf-submit")?.addEventListener("click", () => {
  const name = document.getElementById("cf-name")?.value.trim();
  const phone = document.getElementById("cf-phone")?.value.trim();
  const service = document.getElementById("cf-service")?.value;
  const msg = document.getElementById("cf-msg")?.value.trim();

  if (!name && !msg) {
    alert("Please fill in at least your name and message.");
    return;
  }

  const text = [
    `Hello B.Guru Transfer Agency! 👋`,
    ``,
    `*Name:* ${name || "N/A"}`,
    `*Phone:* ${phone || "N/A"}`,
    `*Service:* ${service || "Not specified"}`,
    `*Message:* ${msg || "N/A"}`,
  ].join("\n");

  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/237650653158?text=${encoded}`, "_blank");
});

/* ── 9. SMOOTH ACTIVE LINK HIGHLIGHTING ── */
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) => {
          a.style.color = "";
          if (a.getAttribute("href") === `#${entry.target.id}`) {
            a.style.color = "#1a0a3a";
          }
        });
      }
    });
  },
  { threshold: 0.4 },
);

sections.forEach((s) => sectionObserver.observe(s));
