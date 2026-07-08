(function () {
  'use strict';

  /* ---- horizontal slide menu ---- */
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var menuPanel = document.querySelector('[data-menu-panel]');
  var navBar = document.querySelector('.nav-bar');
  if (menuToggle && menuPanel && navBar) {
    menuToggle.addEventListener('click', function () {
      var isOpen = menuPanel.classList.toggle('is-open');
      navBar.classList.toggle('menu-open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  /* ---- hero entrance ---- */
  window.addEventListener('load', function () {
    setTimeout(function () {
      document.querySelectorAll('[data-hero-fade]').forEach(function (el) {
        el.classList.add('in');
      });
    }, 60);
  });

  /* ---- reveal-on-scroll ---- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- scroll progress / back-to-top ---- */
  var progressBtn = document.querySelector('[data-scroll-progress]');
  if (progressBtn) {
    var circle = progressBtn.querySelector('.scroll-progress-bar');
    var label = progressBtn.querySelector('.scroll-progress-label');
    var circumference = 2 * Math.PI * 24;
    circle.setAttribute('stroke-dasharray', circumference);

    var onScroll = function () {
      var doc = document.documentElement;
      var scrollTop = doc.scrollTop || document.body.scrollTop;
      var height = doc.scrollHeight - doc.clientHeight;
      var pct = height > 0 ? Math.min(1, Math.max(0, scrollTop / height)) : 0;
      circle.setAttribute('stroke-dashoffset', circumference * (1 - pct));
      if (pct >= 0.995) {
        label.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 13 L8 3 M3 7 L8 2 L13 7" stroke="#F15A26" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
      } else {
        label.textContent = Math.round(pct * 100) + '%';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    progressBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- membership carousel ---- */
  var memTrack = document.querySelector('[data-mem-track]');
  if (memTrack) {
    var memPages = memTrack.querySelectorAll('.mem-page');
    var memPageCount = memPages.length;
    var memPage = 0;
    var memPrevBtn = document.querySelector('[data-mem-prev]');
    var memNextBtn = document.querySelector('[data-mem-next]');
    var memLabel = document.querySelector('[data-mem-page-label]');

    memTrack.style.width = (memPageCount * 100) + '%';
    memPages.forEach(function (p) { p.style.flexBasis = (100 / memPageCount) + '%'; });

    function renderMem() {
      memTrack.style.transform = 'translateX(-' + (memPage * (100 / memPageCount)) + '%)';
      memPrevBtn.disabled = memPage === 0;
      memNextBtn.disabled = memPage === memPageCount - 1;
      memPrevBtn.style.opacity = memPage === 0 ? 0.35 : 1;
      memNextBtn.style.opacity = memPage === memPageCount - 1 ? 0.35 : 1;
      memLabel.textContent = (memPage + 1) + ' / ' + memPageCount;
    }
    memPrevBtn.addEventListener('click', function () {
      memPage = Math.max(0, memPage - 1);
      renderMem();
    });
    memNextBtn.addEventListener('click', function () {
      memPage = Math.min(memPageCount - 1, memPage + 1);
      renderMem();
    });
    renderMem();
  }

  /* ---- testimonials carousel ---- */
  var testRoot = document.querySelector('[data-testimonials]');
  if (testRoot) {
    var testimonials = [
      {
        quote: '“I moved my whole freelance business into a dedicated desk here. The building alone makes client meetings feel like an event.”',
        name: 'Sara Delgado', role: 'Dedicated Desk member',
        bg: '#FFFFFF', fg: '#080A0A', quoteColor: '#33352F', border: '1px solid #ECEADD',
        avatarBg: '#EFE7D2', avatarColor: '#6E7072', roleColor: '#6E7072'
      },
      {
        quote: '“Our small team rents a private office in the Newark building. 24/7 access means we come in when it actually works for us.”',
        name: 'Marcus Fields', role: 'Private office, team of 3',
        bg: '#207028', fg: '#F8F9F2', quoteColor: '#E7F1E7', border: 'none',
        avatarBg: 'rgba(248,249,242,0.18)', avatarColor: '#D9E8D9', roleColor: '#CDE7CF'
      },
      {
        quote: '“The community events turned into real client referrals. I didn’t expect to build a network just by working from here.”',
        name: 'Priya Nair', role: 'Hot desk member',
        bg: '#FFFFFF', fg: '#080A0A', quoteColor: '#33352F', border: '1px solid #ECEADD',
        avatarBg: '#EFE7D2', avatarColor: '#6E7072', roleColor: '#6E7072'
      },
      {
        quote: '“We needed a space that could flex with a growing team. NeWork let us go from two desks to a full office without switching buildings.”',
        name: 'Devon Wu', role: 'Private office, team of 8',
        bg: '#207028', fg: '#F8F9F2', quoteColor: '#E7F1E7', border: 'none',
        avatarBg: 'rgba(248,249,242,0.18)', avatarColor: '#D9E8D9', roleColor: '#CDE7CF'
      }
    ];

    var testTrack = testRoot.querySelector('[data-test-track]');
    var testDots = testRoot.querySelector('[data-test-dots]');
    var testPrevBtn = testRoot.querySelector('[data-test-prev]');
    var testNextBtn = testRoot.querySelector('[data-test-next]');
    var perPage1Btn = testRoot.querySelector('[data-test-perpage1]');
    var perPage2Btn = testRoot.querySelector('[data-test-perpage2]');

    var state = { index: 0, perPage: 2 };

    function pageCount() { return Math.ceil(testimonials.length / state.perPage); }
    function clampIndex(i) {
      var pc = pageCount();
      return ((i % pc) + pc) % pc;
    }

    function cardHtml(card) {
      return (
        '<div class="test-card" style="background:' + card.bg + '; color:' + card.fg + '; border:' + card.border + ';">' +
          '<div class="test-stars">★★★★★</div>' +
          '<div class="test-quote" style="color:' + card.quoteColor + ';">' + card.quote + '</div>' +
          '<div class="test-person">' +
            '<div class="test-avatar" style="background:' + card.avatarBg + '; color:' + card.avatarColor + ';">Photo</div>' +
            '<div>' +
              '<div class="test-name">' + card.name + '</div>' +
              '<div class="test-role" style="color:' + card.roleColor + ';">' + card.role + '</div>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }

    function render() {
      var pc = pageCount();
      var pages = [];
      for (var i = 0; i < pc; i++) {
        var start = i * state.perPage;
        var cards = testimonials.slice(start, start + state.perPage);
        while (cards.length < state.perPage) cards.push(cards[0]);
        pages.push(cards);
      }

      testTrack.style.width = (pc * 100) + '%';
      testTrack.innerHTML = pages.map(function (cards) {
        var gridTemplate = state.perPage === 1 ? '1fr' : '1fr 1fr';
        return (
          '<div class="test-page" style="width:' + (100 / pc) + '%; grid-template-columns:' + gridTemplate + ';">' +
            cards.map(cardHtml).join('') +
          '</div>'
        );
      }).join('');
      testTrack.style.transform = 'translateX(-' + (state.index * (100 / pc)) + '%)';

      testDots.innerHTML = '';
      for (var d = 0; d < pc; d++) {
        var dot = document.createElement('button');
        dot.setAttribute('aria-label', 'Go to slide ' + (d + 1));
        dot.style.background = d === state.index ? '#207028' : '#DAD6C4';
        (function (idx) {
          dot.addEventListener('click', function () {
            state.index = idx;
            render();
          });
        })(d);
        testDots.appendChild(dot);
      }

      perPage1Btn.style.background = state.perPage === 1 ? '#207028' : 'transparent';
      perPage1Btn.style.color = state.perPage === 1 ? '#F8F9F2' : '#33352F';
      perPage2Btn.style.background = state.perPage === 2 ? '#207028' : 'transparent';
      perPage2Btn.style.color = state.perPage === 2 ? '#F8F9F2' : '#33352F';
    }

    testPrevBtn.addEventListener('click', function () {
      state.index = clampIndex(state.index - 1);
      render();
    });
    testNextBtn.addEventListener('click', function () {
      state.index = clampIndex(state.index + 1);
      render();
    });
    perPage1Btn.addEventListener('click', function () {
      state.perPage = 1;
      state.index = 0;
      render();
    });
    perPage2Btn.addEventListener('click', function () {
      state.perPage = 2;
      state.index = 0;
      render();
    });

    render();
  }
})();
