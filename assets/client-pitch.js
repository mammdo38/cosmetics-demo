/**
 * Scale Studio - Client Personalization & Pitch Engine
 * Detects URL parameters (?for=..., ?client=..., ?brand=..., ?name=...)
 * Renders a floating luxury glassmorphic greeting bar and personalizes page title.
 */
(function() {
  function initClientPitch() {
    try {
      const params = new URLSearchParams(window.location.search);
      const rawName = params.get('for') || params.get('client') || params.get('brand') || params.get('name') || params.get('to');
      if (!rawName) return;

      const clientName = decodeURIComponent(rawName).trim().replace(/[_+]/g, ' ');
      if (!clientName) return;

      // Update page title
      const baseTitle = document.title;
      document.title = `پیش‌پروژه اختصاصی «${clientName}» | استودیو اسکیل`;

      // Check if banner already exists
      if (document.getElementById('scaleClientPitchBanner')) return;

      // Create styling
      const style = document.createElement('style');
      style.id = 'scaleClientPitchStyles';
      style.textContent = `
        .scale-pitch-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 999999;
          background: rgba(18, 18, 22, 0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
          color: #f3f3f5;
          font-family: 'IRANYekan', 'Vazirmatn', -apple-system, BlinkMacSystemFont, sans-serif;
          direction: rtl;
          text-align: right;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          animation: scalePitchSlideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes scalePitchSlideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .scale-pitch-main {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .scale-pitch-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 9999px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #34d399;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: -0.2px;
        }
        .scale-pitch-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
          display: inline-block;
          animation: scalePitchPulse 2s infinite;
        }
        @keyframes scalePitchPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        .scale-pitch-text {
          font-size: 0.88rem;
          font-weight: 500;
          color: #f3f3f5;
          line-height: 1.5;
        }
        .scale-pitch-text strong {
          color: #ffffff;
          font-weight: 800;
          text-decoration: underline;
          text-decoration-color: #10b981;
          text-underline-offset: 4px;
        }
        .scale-pitch-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .scale-pitch-btn-wa {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #10b981;
          color: #ffffff;
          padding: 7px 14px;
          border-radius: 10px;
          font-size: 0.78rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
        }
        .scale-pitch-btn-wa:hover {
          background: #059669;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
        }
        .scale-pitch-close {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 1.1rem;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .scale-pitch-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }
        body.has-pitch-bar {
          padding-top: 54px !important;
        }
        @media (max-width: 768px) {
          .scale-pitch-bar {
            padding: 8px 12px;
          }
          .scale-pitch-text {
            font-size: 0.78rem;
          }
          .scale-pitch-btn-wa span {
            display: none;
          }
          body.has-pitch-bar {
            padding-top: 50px !important;
          }
        }
      `;
      document.head.appendChild(style);

      // Create Banner Element
      const banner = document.createElement('div');
      banner.id = 'scaleClientPitchBanner';
      banner.className = 'scale-pitch-bar';

      const waMsg = encodeURIComponent(`سلام و درود، پیش‌پروژه اختصاصی طراحی‌شده برای «${clientName}» را در استودیو اسکیل مشاهده کردم.`);
      const waUrl = `https://wa.me/989197073922?text=${waMsg}`;

      banner.innerHTML = `
        <div class="scale-pitch-main">
          <span class="scale-pitch-badge">
            <span class="scale-pitch-dot"></span>
            <span>پروتوتایپ اختصاصی استودیو اسکیل</span>
          </span>
          <span class="scale-pitch-text">
            آماده‌سازی شده برای بررسی و توسعه برند: <strong>${escapeHtml(clientName)}</strong>
          </span>
        </div>
        <div class="scale-pitch-actions">
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="scale-pitch-btn-wa" title="گفتگو و مشاوره در واتساپ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.311.045-.698.067-2.221-.564-1.879-.778-3.093-2.695-3.188-2.82-.094-.125-.76-1.012-.76-1.932 0-.92.482-1.371.654-1.558.172-.187.375-.234.5-.234.125 0 .25.002.359.007.115.006.269-.043.421.323.157.377.537 1.311.584 1.407.047.095.078.207.016.333-.063.125-.094.204-.187.313-.094.11-.198.245-.282.329-.094.094-.192.196-.083.383.11.187.488.805 1.047 1.303.72.642 1.326.84 1.514.934.188.094.297.079.406-.047.11-.125.469-.546.594-.734.125-.187.25-.156.422-.094.172.063 1.094.516 1.281.609.187.094.312.141.359.219.047.078.047.453-.097.858z"/>
            </svg>
            <span>شروع گفتگو در واتساپ</span>
          </a>
          <button class="scale-pitch-close" onclick="closeScalePitch()" title="بستن پیام">✕</button>
        </div>
      `;

      document.body.appendChild(banner);
      document.body.classList.add('has-pitch-bar');
    } catch (err) {
      console.warn('ScalePitchEngine notice:', err);
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  window.closeScalePitch = function() {
    const banner = document.getElementById('scaleClientPitchBanner');
    if (banner) {
      banner.style.transition = 'all 0.3s ease';
      banner.style.transform = 'translateY(-100%)';
      banner.style.opacity = '0';
      setTimeout(() => {
        banner.remove();
        document.body.classList.remove('has-pitch-bar');
      }, 300);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClientPitch);
  } else {
    initClientPitch();
  }
})();
