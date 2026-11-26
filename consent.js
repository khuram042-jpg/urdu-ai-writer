
(() => {
  const ID = 'G-T06FSF9KHK';
  const KEY = 'urdu_ai_cookie_consent';
  let loaded = false;

  function getConsent() {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  }

  function saveConsent(value) {
    try {
      localStorage.setItem(KEY, value);
    } catch {}
  }

  function enableAnalytics() {
    if (loaded) return;
    loaded = true;

    window['ga-disable-' + ID] = false;
    window.dataLayer = window.dataLayer || [];

    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });

    window.gtag('js', new Date());

    window.gtag('config', ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });

    const script = document.createElement('script');
    script.async = true;
    script.src =
      'https://www.googletagmanager.com/gtag/js?id=' + ID;

    document.head.appendChild(script);
  }

  function disableAnalytics() {
    window['ga-disable-' + ID] = true;

    const domains = [''];
    const parts = location.hostname.split('.');

    for (let i = 0; i < parts.length - 1; i++) {
      domains.push(parts.slice(i).join('.'));
    }

    const names = new Set([
      '_ga',
      '_ga_' + ID.replace('G-', ''),
      '_gid',
      '_gat'
    ]);

    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();

      if (
        name === '_ga' ||
        name.startsWith('_ga_') ||
        name === '_gid' ||
        name.startsWith('_gat')
      ) {
        names.add(name);
      }
    });

    names.forEach(name => {
      domains.forEach(domain => {
        document.cookie =
          name +
          '=; Max-Age=0;' +
          ' Expires=Thu, 01 Jan 1970 00:00:00 GMT;' +
          ' Path=/;' +
          (domain ? ' Domain=' + domain + ';' : '') +
          ' Secure; SameSite=Lax';
      });
    });
  }

  function init() {
    const banner = document.createElement('div');

    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie preferences');

    banner.style.cssText = `
      position:fixed;
      bottom:20px;
      left:50%;
      transform:translateX(-50%);
      width:calc(100% - 32px);
      max-width:540px;
      box-sizing:border-box;
      background:#ffffff;
      color:#1f2937;
      padding:22px;
      border-radius:16px;
      border:1px solid #dddddd;
      box-shadow:0 8px 30px rgba(0,0,0,.18);
      z-index:99999;
      text-align:center;
      font-family:Arial,sans-serif;
    `;

    banner.innerHTML = `
      <h3 style="margin:0 0 12px">
        🍪 Cookie Preferences
      </h3>

      <p dir="ltr" style="font-size:14px;line-height:1.7">
        We use optional analytics cookies to
        improve our website.
      </p>

      <p dir="rtl" style="font-size:15px;line-height:1.8">
        ہم ویب سائٹ کو بہتر بنانے کے لیے
        اختیاری اینالیٹکس کوکیز استعمال کرتے ہیں۔
      </p>

      <div style="display:flex;gap:10px;
                  justify-content:center;flex-wrap:wrap">

        <button type="button" id="cookie-reject"
          style="background:#ffffff;color:#166534;
          padding:12px 20px;border:1px solid #166534;
          border-radius:8px;cursor:pointer">
          Reject All
        </button>

        <button type="button" id="cookie-accept"
          style="background:#166534;color:#ffffff;
          padding:12px 20px;border:1px solid #166534;
          border-radius:8px;cursor:pointer">
          Accept Analytics
        </button>

      </div>
    `;

    document.body.appendChild(banner);

    const settings = document.createElement('button');
    settings.type = 'button';
    settings.textContent = '🍪 Cookie Settings';

    settings.style.cssText = `
      position:fixed;
      bottom:10px;
      left:10px;
      background:#ffffff;
      color:#166534;
      border:1px solid #166534;
      padding:7px 12px;
      border-radius:8px;
      font-size:12px;
      cursor:pointer;
      z-index:99998;
    `;

    document.body.appendChild(settings);

    settings.onclick = () => {
      banner.style.display = 'block';
    };

    document.getElementById('cookie-accept').onclick = () => {
      saveConsent('accepted');
      banner.style.display = 'none';
      enableAnalytics();
    };

    document.getElementById('cookie-reject').onclick = () => {
      saveConsent('rejected');
      disableAnalytics();
      banner.style.display = 'none';

      if (loaded) location.reload();
    };

    const consent = getConsent();

    if (consent === 'accepted') {
      banner.style.display = 'none';
      enableAnalytics();
    } else {
      disableAnalytics();

      if (consent === 'rejected') {
        banner.style.display = 'none';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
