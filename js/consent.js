(function(){
  // Google Analytics 4 with Consent Mode v2 (basic): nothing is sent to Google
  // until the visitor clicks Accept. Ad-related consent stays denied for good;
  // only analytics_storage is granted on Accept.
  var ID = 'G-07YNM6M4EL', KEY = 'sb-consent', LEAD = 'sb-form-page', loaded = false, bar = null;

  function get(){ try { return localStorage.getItem(KEY); } catch(e){ return null; } }
  function set(v){ try { localStorage.setItem(KEY, v); } catch(e){} }

  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'
  });

  // Loads gtag.js only after consent.
  function load(){
    if(loaded) return;
    loaded = true;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(s);
    lead();
  }

  // Events only once consent is given, so nothing queued earlier is sent later.
  function track(name, params){ if(loaded) gtag('event', name, params); }

  // /thank-you: one generate_lead per form submit (the form stores its page).
  function lead(){
    if(location.pathname.replace(/\.html$/, '') !== '/thank-you') return;
    try {
      var p = sessionStorage.getItem(LEAD);
      if(p !== null){ sessionStorage.removeItem(LEAD); track('generate_lead', { form_page: p || 'unknown' }); }
    } catch(e){}
  }

  function clearGaCookies(){
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function(c){
      var n = c.split('=')[0].trim();
      if(n.indexOf('_ga') === 0){
        document.cookie = n + '=; Max-Age=0; path=/';
        document.cookie = n + '=; Max-Age=0; path=/; domain=.' + host;
      }
    });
  }

  function choose(v){
    set(v);
    hide();
    if(v === 'granted') load();
    else {
      if(loaded) gtag('consent', 'update', { analytics_storage: 'denied' });
      clearGaCookies();
    }
  }

  // Banner: fixed at the bottom (no layout shift), added after load. While it is
  // shown, the body gets bottom padding so nothing stays hidden behind it.
  function show(){
    if(!bar){
      bar = document.createElement('div');
      bar.className = 'consent';
      bar.setAttribute('role', 'region');
      bar.setAttribute('aria-label', 'Cookie consent');
      bar.innerHTML = '<p>I use Google Analytics to see which pages are useful, only if you allow it. <a href="/privacy">Privacy</a></p>'
        + '<div class="consent-actions">'
        + '<button type="button" class="btn btn-ghost" data-consent="denied">Decline</button>'
        + '<button type="button" class="btn btn-ghost" data-consent="granted">Accept</button>'
        + '</div>';
      document.body.appendChild(bar);
    }
    bar.hidden = false;
    document.body.style.paddingBottom = (bar.offsetHeight + 24) + 'px';
  }
  function hide(){
    if(bar) bar.hidden = true;
    document.body.style.paddingBottom = '';
  }

  document.addEventListener('click', function(e){
    var a = e.target.closest ? e.target.closest('a, button') : null;
    if(!a) return;
    if(a.hasAttribute('data-consent')){ choose(a.getAttribute('data-consent')); return; }
    if(a.hasAttribute('data-consent-open')){ show(); return; }
    var href = a.getAttribute('href') || '';
    var type = /linkedin\.com/.test(href) ? 'linkedin'
      : /upwork\.com/.test(href) ? 'upwork'
      : /Svitlana_Biletska_CV\.pdf/.test(href) ? 'cv' : '';
    if(type) track('outbound_click', { link_type: type, link_url: a.href, page: location.pathname });
    else if(a.classList.contains('btn')) track('cta_click', {
      cta_text: a.textContent.replace(/[→←↓]/g, '').replace(/\s+/g, ' ').trim(),
      page: location.pathname
    });
  });

  var choice = get();
  if(choice === 'granted') load();
  else if(!choice){
    if(document.readyState === 'complete') show();
    else window.addEventListener('load', function(){ show(); });
  }
})();
