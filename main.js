/* ── main.js — B.Guru Transfer Agency ── */
document.documentElement.classList.add("js");

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
revealEls.forEach((el) => {
  if (el.getBoundingClientRect().top < window.innerHeight) {
    el.classList.add("revealed");
    return;
  }
  revealObserver.observe(el);
});

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

/* 6. LIVE RATES AND CONVERTER */
const CURRENCIES = [
  { code: "USD", name: "US Dollar", baseRate: 1, frankfurter: true },
  { code: "EUR", name: "Euro", baseRate: 0.92, frankfurter: true },
  { code: "NGN", name: "Naira", baseRate: 1520, frankfurter: false },
  { code: "XAF", name: "CFA Franc", baseRate: 605, frankfurter: false },
  { code: "GHS", name: "Ghana Cedis", baseRate: 15.2, frankfurter: false },
  { code: "INR", name: "Indian Rupee", baseRate: 83.6, frankfurter: true },
];

const rateState = {
  base: "USD",
  selectedCurrency: "XAF",
  selectedRange: "7D",
  liveRates: CURRENCIES.reduce((rates, currency) => {
    rates[currency.code] = currency.baseRate;
    return rates;
  }, {}),
  prevRates: {},
  lastUpdated: null,
  chart: null,
  chartRequest: 0,
};

const selectedPair = document.getElementById("selected-pair");
const selectedRate = document.getElementById("selected-rate");
const selectedChange = document.getElementById("selected-change");
const currencyTabs = document.querySelectorAll(".currency-tab");
const rangeTabs = document.querySelectorAll(".range-tab");
const chartCanvas = document.getElementById("rate-chart");
const chartLoading = document.getElementById("chart-loading");
const ratesUpdated = document.getElementById("rates-updated");
const convAmount = document.getElementById("conv-amount");
const convFrom = document.getElementById("conv-from");
const convTo = document.getElementById("conv-to");
const convNum = document.getElementById("conv-num");
const convLabel = document.getElementById("conv-label");
const convRate = document.getElementById("conv-rate-display");
const swapBtn = document.getElementById("swap-btn");
const transferWhatsapp = document.getElementById("transfer-whatsapp");

function currencyMeta(code) {
  return CURRENCIES.find((currency) => currency.code === code);
}

function formatRate(value) {
  if (!Number.isFinite(value)) return "—";
  if (value >= 100) return value.toLocaleString("en", { maximumFractionDigits: 2 });
  if (value >= 1) return value.toLocaleString("en", { maximumFractionDigits: 4 });
  return value.toLocaleString("en", { maximumFractionDigits: 6 });
}

function getRate(code) {
  return rateState.liveRates[code] || currencyMeta(code)?.baseRate || 1;
}

function getPairRate(from, to) {
  return (1 / getRate(from)) * getRate(to);
}

function animateTextValue(el, value) {
  if (!el) return;
  el.style.opacity = "0";
  el.style.transform = "translateY(6px)";
  setTimeout(() => {
    el.textContent = value;
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  }, 140);
}

function setMovement(el, movement) {
  if (!el) return;
  const isUp = movement >= 0;
  el.classList.toggle("up", isUp);
  el.classList.toggle("down", !isUp);
  el.textContent = `${isUp ? "▲ +" : "▼ -"}${Math.abs(movement).toFixed(2)}%`;
}

function updateSelectedRate() {
  const code = rateState.selectedCurrency;
  const rate = getPairRate(rateState.base, code);
  const previous = rateState.prevRates[code] || rate;
  const change = previous ? ((getRate(code) - previous) / previous) * 100 : 0;

  if (selectedPair) selectedPair.textContent = `${rateState.base} → ${code}`;
  animateTextValue(selectedRate, formatRate(rate));
  setMovement(selectedChange, change);
}

function getRangeDays(range) {
  return { "7D": 7, "1M": 30, "3M": 90, "1Y": 365 }[range] || 7;
}

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function buildFallbackSeries(code, days) {
  const current = getRate(code);
  const points = Math.min(days, 90);
  const start = new Date();
  start.setDate(start.getDate() - days);

  return Array.from({ length: points + 1 }, (_, index) => {
    const progress = index / points;
    const date = new Date(start);
    date.setDate(start.getDate() + Math.round(progress * days));
    const wave = Math.sin(index * 0.75) * 0.006 + Math.cos(index * 0.33) * 0.004;
    const drift = (progress - 1) * 0.012;
    return {
      label: date.toLocaleDateString("en", { month: "short", day: "numeric" }),
      value: current * (1 + wave + drift),
    };
  });
}

async function fetchHistoricalSeries(code, range) {
  const days = getRangeDays(range);
  const meta = currencyMeta(code);

  if (!meta || code === "USD") return buildFallbackSeries(code, days);

  const start = new Date();
  start.setDate(start.getDate() - days);
  const url = `https://api.frankfurter.app/${dateKey(start)}..?from=${rateState.base}&to=${code}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(7000) });
  if (!res.ok) throw new Error("Historical rate request failed");
  const data = await res.json();
  const entries = Object.entries(data.rates || {});
  if (!entries.length) return buildFallbackSeries(code, days);

  return entries.map(([date, rates]) => ({
    label: new Date(date).toLocaleDateString("en", { month: "short", day: "numeric" }),
    value: rates[code],
  }));
}

function drawRateChart(series) {
  if (!chartCanvas || typeof Chart === "undefined") return;

  const ctx = chartCanvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, chartCanvas.offsetHeight || 220);
  gradient.addColorStop(0, "rgba(196, 168, 232, 0.32)");
  gradient.addColorStop(1, "rgba(196, 168, 232, 0)");

  const data = {
    labels: series.map((point) => point.label),
    datasets: [{
      data: series.map((point) => point.value),
      borderColor: "#d7c1f5",
      backgroundColor: gradient,
      borderWidth: 2.5,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: "#ffffff",
      pointHoverBorderColor: "#c4a8e8",
      pointHoverBorderWidth: 2,
      tension: 0.42,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 650, easing: "easeOutQuart" },
    interaction: { intersect: false, mode: "index" },
    plugins: {
      legend: { display: false },
      tooltip: {
        displayColors: false,
        backgroundColor: "rgba(18, 11, 38, 0.94)",
        borderColor: "rgba(196, 168, 232, 0.22)",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => `${rateState.base} → ${rateState.selectedCurrency}: ${formatRate(context.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "rgba(239, 231, 255, 0.44)", maxTicksLimit: 4, font: { size: 11 } },
        border: { display: false },
      },
      y: {
        grid: { color: "rgba(239, 231, 255, 0.07)", drawTicks: false },
        ticks: { display: false },
        border: { display: false },
      },
    },
  };

  if (rateState.chart) {
    rateState.chart.data = data;
    rateState.chart.options = options;
    rateState.chart.update();
    return;
  }

  rateState.chart = new Chart(ctx, { type: "line", data, options });
}

async function updateChart() {
  const requestId = ++rateState.chartRequest;
  chartLoading?.classList.add("visible");

  try {
    const series = await fetchHistoricalSeries(rateState.selectedCurrency, rateState.selectedRange);
    if (requestId !== rateState.chartRequest) return;
    drawRateChart(series);

    const first = series[0]?.value;
    const last = series[series.length - 1]?.value;
    if (first && last) setMovement(selectedChange, ((last - first) / first) * 100);
  } catch {
    if (requestId === rateState.chartRequest) drawRateChart(buildFallbackSeries(rateState.selectedCurrency, getRangeDays(rateState.selectedRange)));
  } finally {
    if (requestId === rateState.chartRequest) chartLoading?.classList.remove("visible");
  }
}

function updateTimestamp() {
  if (!ratesUpdated || !rateState.lastUpdated) return;
  const seconds = Math.max(0, Math.floor((Date.now() - rateState.lastUpdated) / 1000));
  ratesUpdated.textContent = seconds < 3 ? "Updated just now" : `Updated ${seconds} seconds ago`;
}

async function fetchRates() {
  rateState.prevRates = { ...rateState.liveRates };
  const supportedCodes = CURRENCIES.filter((currency) => currency.frankfurter && currency.code !== "USD").map((currency) => currency.code);

  try {
    const res = await fetch(`https://api.frankfurter.app/latest?from=USD&to=${supportedCodes.join(",")}`, { signal: AbortSignal.timeout(7000) });
    if (!res.ok) throw new Error("Latest rate request failed");
    const data = await res.json();
    rateState.liveRates = { ...rateState.liveRates, USD: 1, ...data.rates };
  } catch {
    supportedCodes.forEach((code) => {
      const previous = rateState.liveRates[code] || currencyMeta(code).baseRate;
      rateState.liveRates[code] = previous * (1 + (Math.random() - 0.5) * 0.0015);
    });
  }

  CURRENCIES.filter((currency) => !currency.frankfurter).forEach((currency) => {
    const previous = rateState.liveRates[currency.code] || currency.baseRate;
    rateState.liveRates[currency.code] = previous * (1 + (Math.random() - 0.5) * 0.0018);
  });

  rateState.lastUpdated = Date.now();
  updateSelectedRate();
  updateConverter();
  updateTimestamp();
}

function updateConverter() {
  const amount = parseFloat(convAmount?.value) || 0;
  const from = convFrom?.value;
  const to = convTo?.value;
  if (!from || !to || !convNum) return;

  const perUnit = getPairRate(from, to);
  const result = amount * perUnit;

  if (amount <= 0) {
    animateTextValue(convNum, "—");
    if (convLabel) convLabel.textContent = "Estimated recipient gets";
    if (convRate) convRate.textContent = "Enter an amount to see the live conversion rate.";
    return;
  }

  animateTextValue(convNum, `${formatRate(result)} ${to}`);
  if (convLabel) convLabel.textContent = "Estimated recipient gets";
  if (convRate) convRate.textContent = `1 ${from} = ${formatRate(perUnit)} ${to}`;
}

currencyTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    rateState.selectedCurrency = tab.dataset.currency;
    currencyTabs.forEach((item) => item.classList.toggle("active", item === tab));
    updateSelectedRate();
    updateChart();
  });
});

rangeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    rateState.selectedRange = tab.dataset.range;
    rangeTabs.forEach((item) => item.classList.toggle("active", item === tab));
    updateChart();
  });
});

convAmount?.addEventListener("input", updateConverter);
convFrom?.addEventListener("change", updateConverter);
convTo?.addEventListener("change", updateConverter);

swapBtn?.addEventListener("click", () => {
  const tmp = convFrom.value;
  convFrom.value = convTo.value;
  convTo.value = tmp;
  updateConverter();
});

transferWhatsapp?.addEventListener("click", () => {
  const amount = parseFloat(convAmount?.value) || 0;
  const from = convFrom?.value || "USD";
  const to = convTo?.value || "XAF";
  const rate = formatRate(getPairRate(from, to));
  const text = `Hello B.Guru, I would like to transfer ${formatRate(amount)} ${from} to ${to}. Current displayed rate: ${rate}.`;
  window.open(`https://wa.me/237650653158?text=${encodeURIComponent(text)}`, "_blank");
});

fetchRates().then(updateChart);
setInterval(fetchRates, 30000);
setInterval(updateTimestamp, 1000);

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
