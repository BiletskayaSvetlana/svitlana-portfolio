(function(){
  // Scroll reveal for the pages without GSAP (audits, product photography).
  // Same feel as the GSAP reveal on the case studies. Blocks already on the
  // first screen are never hidden; without JS nothing is hidden at all.
  if(!('IntersectionObserver' in window)) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var pending = [];

  // Safety net: if anything fails, show every hidden block.
  function revealAll(){
    pending.forEach(function(el){
      el.classList.remove('reveal-pending', 'is-in');
      el.style.removeProperty('--reveal-delay');
    });
    pending = [];
  }

  function show(el, delay){
    el.style.setProperty('--reveal-delay', delay + 's');
    el.classList.add('is-in');
  }

  try {
    var small = window.innerWidth <= 700;
    var step = (small ? .55 : 1) * .12;   // stagger between blocks shown together
    var targets = document.querySelectorAll([
      '.section-head > *', '#context .grid > p', '.case-meta > .row',
      '.metric', '.metric-note', '.finding', '.scheme-pair > figure',
      '.scheme-wide figure', '.fix-table', '.status-note', '.cta-band',
      '.light-test', '.ba', '.duo-item', '.shoot-tile', '.trial-points > li',
      '#contactForm > .field', '#contactForm > [type="submit"]', '.contact-direct > *'
    ].join(','));

    var io = new IntersectionObserver(function(entries){
      try {
        var count = new Map();   // per parent, for the stagger within one batch
        entries.forEach(function(entry){
          if(!entry.isIntersecting) return;
          var el = entry.target;
          var n = count.get(el.parentNode) || 0;
          count.set(el.parentNode, n + 1);
          show(el, Math.min(n, 4) * step);
          io.unobserve(el);
        });
      } catch(e){
        io.disconnect();
        revealAll();
      }
    }, { rootMargin: small ? '0px 0px -2% 0px' : '0px 0px -12% 0px' });

    var fold = window.innerHeight;
    Array.prototype.forEach.call(targets, function(el){
      if(el.getBoundingClientRect().top < fold) return;   // first screen: leave as is
      el.classList.add('reveal-pending');
      pending.push(el);
      el.addEventListener('transitionend', function done(e){
        if(e.target !== el || e.propertyName !== 'transform') return;
        el.removeEventListener('transitionend', done);
        el.classList.remove('reveal-pending', 'is-in');
        el.style.removeProperty('--reveal-delay');
      });
      io.observe(el);
    });

    // Fallback: 4 s after load, show any block that is in the viewport but
    // still hidden (e.g. the observer missed it).
    function sweep(){
      try {
        var h = window.innerHeight;
        pending.forEach(function(el){
          if(!el.classList.contains('reveal-pending') || el.classList.contains('is-in')) return;
          var r = el.getBoundingClientRect();
          if(r.bottom > 0 && r.top < h){ show(el, 0); io.unobserve(el); }
        });
      } catch(e){ revealAll(); }
    }
    function armSweep(){ setTimeout(sweep, 4000); }
    if(document.readyState === 'complete') armSweep();
    else window.addEventListener('load', armSweep);
  } catch(e){
    revealAll();
  }
})();
