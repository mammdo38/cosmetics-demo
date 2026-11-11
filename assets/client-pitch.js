/**
 * Scale Studio - Dynamic Brand Personalizer
 * Detects URL query parameters (?for=..., ?name=..., ?brand=..., ?client=..., ?to=...)
 * Dynamically changes the ACTUAL website brand name, logo text, logo initial mark,
 * page title, and footer directly on the page without ANY extra banners or clutter.
 */
(function() {
  'use strict';

  function getClientName() {
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get('for') || params.get('name') || params.get('brand') || params.get('client') || params.get('to');
      if (!raw) return null;
      const clean = decodeURIComponent(raw).trim().replace(/[_+]/g, ' ');
      return clean || null;
    } catch (e) {
      return null;
    }
  }

  function applyPersonalization() {
    const clientName = getClientName();
    if (!clientName) return;

    // ۱. حذف قطعی هرگونه بنر شناور برای جلوگیری از شلوغی بصری
    const legacyBanner = document.getElementById('scaleClientPitchBanner');
    if (legacyBanner) legacyBanner.remove();
    document.body.classList.remove('has-pitch-bar');

    // مخفی کردن بنر دموی اختصاصی قدیمی
    const demoBar = document.getElementById('exclusiveDemoBar');
    if (demoBar) demoBar.style.display = 'none';

    // ۲. تغییر عنوان تب مرورگر (Page Title)
    const oldTitle = document.title;
    const defaultBrands = /رویال پرفیوم|اسکیل کازمتیک|لورین بگ|گالری کیف لورین|بادیز|Badiz Villa/gi;
    if (defaultBrands.test(oldTitle)) {
      document.title = oldTitle.replace(defaultBrands, clientName);
    } else {
      document.title = `فروشگاه آنلاین ${clientName}`;
    }

    // ۳. تغییر نام اصلی برند در هدر و لوگو
    const shopNameEls = document.querySelectorAll('#shopNameText, .shop-name-text, #clientShopName');
    shopNameEls.forEach(el => {
      el.textContent = clientName;
    });

    // ۴. تغییر حرف اول لوگو مارک بر اساس نام مشتری
    const initial = clientName.charAt(0);
    const logoMarks = document.querySelectorAll('#logoMark, .logo-mark');
    logoMarks.forEach(el => {
      el.innerHTML = `<span>${initial}</span>`;
    });

    // ۵. تغییر نام برند در فوتر و متن درباره ما و کپی‌رایت
    const footerName = document.getElementById('footerShopName');
    if (footerName) footerName.textContent = clientName;

    const footerAbout = document.getElementById('footerShopAbout');
    if (footerAbout) {
      footerAbout.textContent = `${clientName}؛ تخصصی‌ترین مرکز ارائه محصولات اصل با ارسال سریع و پشتیبانی به سراسر کشور.`;
    }

    const footerCopy = document.getElementById('footerCopy');
    if (footerCopy) {
      footerCopy.textContent = `© ۱۴۰۳ تمامی حقوق این وب‌سایت برای «${clientName}» محفوظ است. طراحی و توسعه اختصاصی.`;
    }

    // ۶. تنظیمات اختصاصی دموی املاک (Real Estate / Badiz)
    const realEstateLogoWrap = document.querySelector('.header-logo-wrap');
    if (realEstateLogoWrap && (window.location.pathname.includes('/realestate') || document.querySelector('.badiz-logo-svg'))) {
      realEstateLogoWrap.innerHTML = `
        <a href="#hero" style="display:flex; align-items:center; gap:10px; text-decoration:none;">
          <div style="width:38px; height:38px; border-radius:10px; background:var(--color-orange, #f97316); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:1.2rem; box-shadow:0 4px 12px rgba(249,115,22,0.35);">
            ${initial}
          </div>
          <div style="display:flex; flex-direction:column;">
            <span style="font-weight:900; font-size:1.15rem; color:var(--color-dark, #18181b); line-height:1.2;">${clientName}</span>
            <span style="font-size:0.75rem; color:var(--color-gray-mid, #71717a); font-weight:600;">دپارتمان تخصصی املاک و ویلا</span>
          </div>
        </a>
      `;

      const heroPill = document.querySelector('.hero-pills-row .hero-pill:last-child span:last-child');
      if (heroPill) heroPill.textContent = `دپارتمان تخصصی ${clientName}`;

      const heroSubtitle = document.querySelector('.hero-subtitle');
      if (heroSubtitle) {
        heroSubtitle.textContent = `گروه مشاورین املاک ${clientName}، مرجع تخصصی خرید، فروش و سرمایه‌گذاری ملکی در مناطق لوکس و ییلاقی کردان، سهیلیه و تهراندشت.`;
      }

      const footerBrandSpan = document.querySelector('.footer-col span[style*="font-weight: 900"]');
      if (footerBrandSpan) {
        footerBrandSpan.textContent = `دپارتمان املاک ${clientName}`;
      }
    }

    // ۷. به‌روزرسانی پیکربندی فروشگاه در حافظه جاوااسکریپت
    if (window.SHOP_CONFIG && window.SHOP_CONFIG.shop) {
      window.SHOP_CONFIG.shop.name = clientName;
      window.SHOP_CONFIG.shop.showExclusiveBanner = false;
    }
  }

  // اجرا بلافاصله و پس از لود DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyPersonalization);
  } else {
    applyPersonalization();
  }

  // اجرای ایمن پس از رندر کدهای اختصاصی هر دمو
  setTimeout(applyPersonalization, 80);
  setTimeout(applyPersonalization, 300);
})();
