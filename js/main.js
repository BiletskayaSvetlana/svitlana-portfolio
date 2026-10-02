(function(){
  var root = document.documentElement;
  if(!window.gsap || !window.ScrollTrigger){ root.classList.remove('js'); return; }
  root.classList.add('anim-ready');

  // Start after the first frame is laid out, so GSAP/ScrollTrigger measure a
  // clean layout instead of forcing one right after parsing.
  requestAnimationFrame(function(){ requestAnimationFrame(init); });

  function init(){
  try{
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.registerPlugin(ScrollTrigger);

    var lines = gsap.utils.toArray('.hero-line span');
    var headLines = gsap.utils.toArray('.reveal-line span');
    var stage = document.getElementById('stackStage');
    var cards = gsap.utils.toArray('.stack-card');
    var pinStack = !!(stage && cards.length && !reduce && window.innerWidth > 700);
    var deck = pinStack ? stage.closest('section') : null;

    // Reveals are collected first and applied in two phases below: all start
    // states are written in one batch, then the ScrollTriggers (which read
    // layout) are created — so DOM writes and reads don't interleave.
    var reveals = [];
    function reveal(trigger, layers){
      if(reduce || !trigger) return;
      reveals.push({ trigger:trigger, layers:layers });
    }

    gsap.utils.toArray('.section-head').forEach(function(head){
      reveal(head, [
        { targets:head.querySelectorAll(':scope > div > .eyebrow') },
        { targets:head.querySelectorAll(':scope > p'), at:.25 }
      ]);
    });

    if(deck){
      reveal(stage, [{ targets:cards[0].querySelectorAll('.num, h3, p, .stack-tag'), y:16, stagger:.1 }]);
    } else {
      cards.forEach(function(card){
        reveal(card, [
          { targets:card },
          { targets:card.querySelectorAll('.num, h3, p, .stack-tag'), y:16, stagger:.08, at:.15 }
        ]);
      });
    }

    var priceCards = gsap.utils.toArray('.price-card');
    if(priceCards.length){
      reveal(priceCards[0].parentNode, [
        { targets:priceCards, stagger:.14 },
        { targets:priceCards[0].parentNode.querySelectorAll('.price-card > *'), y:16, stagger:.08, at:.2 }
      ]);
    }

    var priceNote = document.querySelector('.price-note');
    if(priceNote) reveal(priceNote, [{ targets:priceNote.children, y:16, stagger:.15 }]);

    var cases = gsap.utils.toArray('.case');
    if(cases.length){
      reveal(cases[0].parentNode, [
        { targets:cases, stagger:.15 },
        { targets:cases[0].parentNode.querySelectorAll('.case-body > *'), y:16, stagger:.08, at:.3 }
      ]);
    }

    gsap.utils.toArray('.case-hero-shot, .case-pdp-shot').forEach(function(shot){
      reveal(shot, [{ targets:shot, y:48, duration:.9, at:shot.classList.contains('case-hero-shot') ? .2 : 0 }]);
    });

    var overview = document.querySelector('.case-overview');
    if(overview){
      reveal(overview, [
        { targets:overview.querySelectorAll(':scope > div:first-child > *'), stagger:.15 },
        { targets:overview.querySelectorAll('.case-meta > .row'), y:16, stagger:.08, at:.2 }
      ]);
    }

    gsap.utils.toArray('.fix').forEach(function(fix){
      reveal(fix, [
        { targets:fix.querySelectorAll('.fix-point'), y:16, stagger:.12 },
        { targets:fix.querySelectorAll('.shot-pair > .shot, :scope > .shot, :scope > .code-frame'), stagger:.15, at:.15 }
      ]);
    });

    var metrics = gsap.utils.toArray('.metric');
    if(metrics.length){
      reveal(metrics[0].parentNode, [{ targets:metrics, y:16, stagger:.1 }]);
    }

    var stackList = document.querySelector('.stack-list');
    if(stackList) reveal(stackList, [{ targets:stackList.children, y:12, stagger:.06 }]);

    gsap.utils.toArray('.fix-wide').forEach(function(wide){
      reveal(wide, [{ targets:wide.children, stagger:.15 }]);
    });

    var about = document.querySelector('.about-content');
    if(about){
      reveal(about, [
        { targets:about.querySelector('.hero-photo'), x:-64, duration:.9 },
        { targets:about.querySelectorAll(':scope > div:not(.hero-photo) > *'), stagger:.15, at:.2 }
      ]);
    }

    var steps = gsap.utils.toArray('.process-step');
    if(steps.length){
      reveal(steps[0].parentNode, [
        { targets:steps, stagger:.12 },
        { targets:steps[0].parentNode.querySelectorAll('.process-step > *'), y:16, stagger:.06, at:.15 }
      ]);
    }

    var band = document.querySelector('.cta-band');
    if(band){
      reveal(band, [
        { targets:band, y:32 },
        { targets:band.querySelectorAll(':scope > .eyebrow, :scope > p, :scope > .btn, :scope > div'), y:16, stagger:.25, at:.2 }
      ]);
    }

    var form = document.getElementById('contactForm');
    if(form){
      reveal(form.parentNode, [
        { targets:form.querySelectorAll(':scope > .field, :scope > [type="submit"]'), y:16, stagger:.08 },
        { targets:form.parentNode.querySelectorAll('.contact-direct > *'), y:16, stagger:.1, at:.15 }
      ]);
    }

    // Phase 1 — writes only.
    if(reduce){
      lines.concat(headLines).forEach(function(el){ el.style.transform='none'; });
    } else {
      gsap.set(lines.concat(headLines), {yPercent:110, opacity:0});
    }

    if(pinStack){
      gsap.set(cards, {
        yPercent:0, scale:1, transformOrigin:'center top',
        zIndex:function(i){ return i+1; }
      });
    } else {
      gsap.set(cards, {clearProps:'all'});
    }

    var hidden = [], offsets = [];
    reveals.forEach(function(r){
      r.layers.forEach(function(layer){
        layer.list = gsap.utils.toArray(layer.targets);
        layer.list.forEach(function(el){
          var i = hidden.indexOf(el);
          if(i < 0){ i = hidden.length; hidden.push(el); }
          offsets[i] = { x:layer.x || 0, y:layer.x ? 0 : (layer.y || 24) };
        });
      });
    });
    if(hidden.length){
      gsap.set(hidden, {
        opacity:0,
        x:function(i){ return offsets[i].x; },
        y:function(i){ return offsets[i].y; }
      });
    }

    // Phase 2 — tweens and ScrollTriggers (these measure layout).
    if(!reduce){
      gsap.to(lines, {
        yPercent:0, opacity:1, duration:.9, ease:'expo.out',
        stagger:.09, delay:.15
      });
      headLines.forEach(function(el){
        gsap.to(el, {
          yPercent:0, opacity:1, duration:.85, ease:'expo.out',
          scrollTrigger:{ trigger: el.closest('.reveal-line'), start:'top 88%' }
        });
      });
    }

    if(pinStack){
      var tl = gsap.timeline({
        scrollTrigger:{
          trigger: deck,
          start:'top top',
          end:'+=' + (cards.length-1) * 500,
          scrub:.6,
          pin:true,
          anticipatePin:1
        }
      });
      cards.forEach(function(card, i){
        if(i===0) return;
        tl.fromTo(card, {yPercent:14, opacity:0, scale:.96},
                         {yPercent:0, opacity:1, scale:1, duration:1, ease:'power2.out'}, i-1);
        tl.to(cards[i-1], {scale:.94, opacity:.35, duration:1, ease:'power2.out'}, i-1);
      });
    }

    reveals.forEach(function(r){
      var st = { trigger:r.trigger, start:'top 88%' };
      if(deck && deck !== r.trigger && deck.contains(r.trigger)) st.pinnedContainer = deck;
      var rtl = gsap.timeline({ scrollTrigger:st });
      r.layers.forEach(function(layer){
        if(!layer.list.length) return;
        rtl.to(layer.list, {
          opacity:1, x:0, y:0, duration:layer.duration || .8, ease:'expo.out',
          stagger:layer.stagger || .12
        }, layer.at || 0);
      });
    });
  } catch(e){ root.classList.remove('js'); }
  }
})();
