/* ==========================================================================
   AKASHA · IMPECCABLE PASS — 交互层
   只做四件事：滚动入场 / 配色三选一 / 键盘导航 / 内存外的状态复原。
   不接管原有任何逻辑；出错时静默退出，页面照旧可用。
   ========================================================================== */
(function () {
  'use strict';
  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  /* ------------------------------------------------ 1. 配色三选一（记忆） */
  var INKS = [
    { id: 'gold', label: '墨金' },
    { id: 'frost', label: '霜青' },
    { id: 'vermilion', label: '朱砂' }
  ];
  var KEY = 'akasha-ink';
  function readInk() {
    try {
      var v = localStorage.getItem(KEY);
      return INKS.some(function (i) { return i.id === v; }) ? v : 'gold';
    } catch (e) { return 'gold'; }
  }
  function applyInk(id) {
    if (id === 'gold') document.documentElement.removeAttribute('data-ink');
    else document.documentElement.setAttribute('data-ink', id);
    try { localStorage.setItem(KEY, id); } catch (e) {}
    var btns = document.querySelectorAll('.ink-switch button');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-pressed', btns[i].getAttribute('data-ink') === id ? 'true' : 'false');
    }
  }
  function buildSwitch() {
    var wrap = document.createElement('div');
    wrap.className = 'ink-switch';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', '配色方案');
    INKS.forEach(function (ink) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = ink.label;
      b.setAttribute('data-ink', ink.id);
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () { applyInk(ink.id); });
      wrap.appendChild(b);
    });
    document.body.appendChild(wrap);
    applyInk(readInk());
  }

  /* ------------------------------------------------ 2. 滚动入场（渐进增强） */
  var RV_SELECTOR = [
    '.wb-item', '.timeline-card', '.entry-category-tile', '.fs-card',
    '.lb-depth-card', '.node-card', '.divine-type', '.form-grid > .form-field',
    '.pick-row', '.round-step'
  ].join(',');

  function armReveal() {
    if (reduce || !('IntersectionObserver' in window)) return;
    var nodes = document.querySelectorAll(RV_SELECTOR);
    if (!nodes.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });

    var perParent = new Map();
    Array.prototype.forEach.call(nodes, function (el) {
      el.classList.add('rv');
      var p = el.parentElement || document.body;
      var n = (perParent.get(p) || 0);
      perParent.set(p, n + 1);
      if (n < 8) el.style.setProperty('--i', String(n));
      io.observe(el);
    });
  }

  /* ------------------------------------------------ 3. 键盘：← → 章节切换 */
  function armKeys() {
    var btns = Array.prototype.slice.call(document.querySelectorAll('#horizontal-nav .nav-btn'));
    if (btns.length < 2) return;
    document.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var t = e.target;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (t && t.isContentEditable) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var active = document.querySelector('#horizontal-nav .nav-btn.active');
      var idx = active ? btns.indexOf(active) : -1;
      if (idx < 0) {
        idx = 0;
        for (var i = 0; i < btns.length; i++) {
          var href = btns[i].querySelector('a');
          if (href && location.hash === href.getAttribute('href')) { idx = i; break; }
        }
      }
      var next = e.key === 'ArrowRight' ? idx + 1 : idx - 1;
      if (next < 0) next = btns.length - 1;
      if (next >= btns.length) next = 0;
      var target = btns[next];
      if (target) {
        var a = target.querySelector('a');
        if (a) location.hash = a.getAttribute('href');
        else target.click();
        target.focus({ preventScroll: true });
      }
    });
  }


  /* ---------------------------- 4b. 导航：把 <button><a> 折叠成单层锚点
     原站是 <button class="nav-btn"><a href="#x">…</a></button>：
     ① 交互内容嵌套在 button 里，属于无效嵌套；② Tab 会走两次（button + a）。
     这里在运行时替换成等价的 <a class="nav-btn" href="#x">，HTML 源码不动。 */
  function flattenNav() {
    var btns = document.querySelectorAll('#horizontal-nav .nav-btn');
    Array.prototype.forEach.call(btns, function (b) {
      if (b.tagName !== 'BUTTON') return;
      var a = b.querySelector('a');
      if (!a) return;
      var link = document.createElement('a');
      link.className = b.className;
      link.setAttribute('href', a.getAttribute('href'));
      var dt = b.getAttribute('data-target');
      if (dt) link.setAttribute('data-target', dt);
      link.textContent = a.textContent;
      b.parentNode.replaceChild(link, b);
    });
  }

  /* ------------------- 4c. 把视觉上隐藏的覆盖层移出 Tab 序列
     原站 #act3 覆盖页只有 opacity:0; pointer-events:none，却留着 19 个可聚焦控件，
     键盘用户前 18 次 Tab 全部落在看不见的按钮上。 */
  function armInertGuard() {
    var SEL = '#act3,#lb-gate,[data-overlay]';
    function scan() {
      var nodes = document.querySelectorAll(SEL);
      Array.prototype.forEach.call(nodes, function (el) {
        var s = getComputedStyle(el);
        var invisible = s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) < 0.05;
        try {
          if (invisible) { el.inert = true; el.setAttribute('aria-hidden', 'true'); }
          else { el.inert = false; el.removeAttribute('aria-hidden'); }
        } catch (e) {}
      });
    }
    scan();
    try {
      var mo = new MutationObserver(scan);
      ['act3', 'lb-gate'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) mo.observe(el, { attributes: true, attributeFilter: ['class', 'style', 'hidden'] });
      });
      mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      setInterval(scan, 700);
    } catch (e) {}
  }

  /* ------------------------------------------------ 5. 深链：导航同步高亮 */
  function syncActive() {
    var hash = location.hash || '#home';
    var btns = document.querySelectorAll('#horizontal-nav .nav-btn');
    for (var i = 0; i < btns.length; i++) {
      var el = btns[i];
      var href = el.tagName === 'A' ? el.getAttribute('href') : (function () {
        var a = el.querySelector('a'); return a ? a.getAttribute('href') : null;
      })();
      var on = href === hash;
      btns[i].classList.toggle('active', on);
      if (on) btns[i].setAttribute('aria-current', 'page');
      else btns[i].removeAttribute('aria-current');
    }
  }

  /* ------------------------------------------------ 4. 小修：编号与锚点 */
  function polish() {
    // 章节切换后把视口对齐到卡片顶部（sticky 导航不再压住标题）
    window.addEventListener('hashchange', function () {
      var id = location.hash.replace('#', '');
      var sec = id && document.getElementById(id);
      if (!sec) return;
      requestAnimationFrame(function () {
        var top = sec.getBoundingClientRect().top + window.pageYOffset - 72;
        window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  }


  /* ------------------------------------------------ 6. 去掉纯装饰字符（▼），改由 CSS 画线 */
  function stripGlyphs() {
    var nodes = document.querySelectorAll('.wb-arrow,.wb-step');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      for (var j = 0; j < el.childNodes.length; j++) {
        var n = el.childNodes[j];
        if (n.nodeType === 3) {
          var t = n.nodeValue.replace(/^[\s▼▽▾□■◆◇·]+/, '');
          if (t !== n.nodeValue) n.nodeValue = t;
        }
      }
    }
  }

  function boot() {
    try { stripGlyphs(); } catch (e) {}
    try { flattenNav(); } catch (e) {}
    try { armInertGuard(); } catch (e) {}
    try { buildSwitch(); } catch (e) {}
    try { syncActive(); window.addEventListener('hashchange', syncActive); } catch (e) {}
    try { armReveal(); } catch (e) {}
    try { armKeys(); } catch (e) {}
    try { polish(); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
