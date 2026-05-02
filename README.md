# B.Guru - Global Money Exchange Platform 🚀💰

A complete, responsive frontend website for **B.Guru (Bitcoin Guru)** - a modern, trust-building lead-generation platform for international money exchange services.

[![B.Guru Demo](https://via.placeholder.com/1200x600/8b5cf6/ffffff?text=B.Guru+-+Live+Demo)](http://localhost:3000)

## ✨ Features

### 🎨 **Design & UX**

- **Modern Fintech Design** with light/dark purple gradient theme
- **Fully Responsive** (Mobile, Tablet, Desktop) - Mobile-first approach
- **Smooth Animations** - Fade-ins, hover effects, sticky navigation
- **Professional Typography** using Segoe UI / system fonts

### 📱 **Core Pages** (3 Pages)

1. **index.html** - Hero, Features, Currencies, Live Rates, Converter
2. **testimonials.html** - Multi-language customer testimonials
3. **contact.html** - Contact form + WhatsApp integration

### ⚡ **Interactive JavaScript Features**

```
✅ Sticky header (hide on scroll down, show on scroll up)
✅ Smooth scrolling navigation
✅ Scroll-triggered fade-in animations
✅ Real-time currency converter with 6 currencies
✅ Live exchange rates table (auto-updates every 5s)
✅ Mobile hamburger menu
✅ WhatsApp integration (pre-filled messages)
✅ Form validation & submission handling
```

### 🌍 **Business Features**

- **6 Major Currencies**: USD, CAD, NGN, GHS, INR, EUR
- **Live Rates Simulation**: USD→NGN, USD→INR, USD→GHS, EUR→GHS
- **Multi-language Testimonials**: English, French, Hindi
- **Lead Generation**: WhatsApp CTAs throughout
- **Trust Elements**: Security badges, customer stories, competitive rates

## 📁 File Structure

```
BitCoinGuru/
├── index.html          # Homepage (Hero + Features + Converter)
├── testimonials.html   # Customer testimonials
├── contact.html        # Contact form + WhatsApp
├── styles.css          # Complete responsive styles
├── script.js           # All interactive features
├── TODO.md             # Development tracking (completed)
├── README.md           # This file
└── assets/             # Images (hero.png)
```

## 🚀 Quick Start

### 1. **Live Server** (Recommended)

```bash
npx serve .
```

**URL**: http://localhost:3000

### 2. **VS Code Live Server**

- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

### 3. **Static Hosting** (Production)

```
- Netlify: Drag & drop folder
- Vercel: `vercel --prod`
- GitHub Pages: Push to gh-pages branch
```

## 🎯 Key Business Components

### **Conversion Funnel**

```
Hero CTA → Live Rates → Currency Converter → WhatsApp Chat
                                    ↓
                            Contact Form Backup
```

### **WhatsApp Integration**

- Floating WhatsApp button (bottom-right)
- All CTA buttons open: `https://wa.me/1234567890`
- **Pre-filled message**: "Hello, I want to exchange currency"
- **Easy customization** - Update phone number in `script.js`

### **Live Rates Table** (index.html)

| Pair    | Simulated Rate | Auto-updates |
| ------- | -------------- | ------------ |
| USD→NGN | 1600.45        | Every 5s     |
| USD→INR | 83.72          | Every 5s     |
| USD→GHS | 15.28          | Every 5s     |

## 🔧 Customization Guide

### **1. WhatsApp Number**

```javascript
// script.js line ~120
const phoneNumber = "1234567890"; // ← Update this
```

### **2. Exchange Rates**

```javascript
// script.js - rates object
const rates = {
  "USD-NGN": 1600, // ← Update live rates here
  "USD-INR": 83.5,
  // ... add more pairs
};
```

### **3. Add Currencies**

1. Update converter dropdowns (index.html)
2. Add rates to `rates` object (script.js)
3. Add currency cards (index.html)

### **4. Brand Colors**

```css
/* styles.css :root */
--primary-purple: #8b5cf6; /* ← Customize */
--dark-purple: #6d28d9;
```

### **5. Hero Image**

```css
/* styles.css .hero */
background-image: url("assets/hero.png"); /* ← Update */
```

## 📱 Responsive Breakpoints

```
Mobile:     0-768px    (1 column, hamburger menu)
Tablet:    769-1024px  (2 columns)
Desktop:  1025px+      (Full grid layouts)
```

## 🛠 Development Notes

### **Tech Stack**

- **HTML5** Semantic structure
- **CSS3** Flexbox/Grid, CSS Custom Properties, Animations
- **Vanilla JS** No frameworks (lightweight)
- **Font Awesome 6** Icons
- **No Build Tools** - Pure static files

### **Performance**

- **Zero Dependencies** (except Font Awesome CDN)
- **95+ Lighthouse Score** expected
- **<50KB total size**
- **Progressive Enhancement**

### **Browser Support**

| Browser     | Support |
| ----------- | ------- |
| Chrome 90+  | ✅      |
| Firefox 88+ | ✅      |
| Safari 14+  | ✅      |
| Edge 90+    | ✅      |

## 🎨 Design System

```
Colors:
- Primary: #8b5cf6 (Purple)
- Dark: #6d28d9
- Gold: #f59e0b
- WhatsApp: #25d366

Typography:
- Headings: 2.5rem-4rem
- Body: 1rem (16px)
- Line-height: 1.6

Spacing:
- Sections: 5rem padding
- Cards: 2rem padding
- Margins: 8px scale
```

## 🚀 Deployment Checklist

- [ ] Update WhatsApp number
- [ ] Replace placeholder images
- [ ] Update real exchange rates API
- [ ] Add Google Analytics
- [ ] Custom domain
- [ ] SSL certificate

## 📞 Support

**WhatsApp**: [Start Chat](https://wa.me/1234567890?text=Hello%20B.Guru%20Team!)
**Email**: support@bguru.com

---

**⭐ Made with ❤️ for Bitcoin Guru - Exchange money globally, effortlessly!**
