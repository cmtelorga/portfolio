/* Lucas Lorga — portfolio interactions. No dependencies. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Language (EN default, PT optional) ---------- */
  var LANG_KEY = "ll-lang";
  function getStoredLang() {
    try { return localStorage.getItem(LANG_KEY); } catch (e) { return null; }
  }
  function storeLang(l) {
    try { localStorage.setItem(LANG_KEY, l); } catch (e) { /* storage unavailable: ignore */ }
  }
  function applyLang(l) {
    var html = document.documentElement;
    html.setAttribute("lang", l === "pt" ? "pt-BR" : "en");
    document.querySelectorAll("[data-title-en]").forEach(function (el) {
      el.textContent = l === "pt" ? el.getAttribute("data-title-pt") : el.getAttribute("data-title-en");
    });
    document.querySelectorAll(".lang-toggle").forEach(function (btn) {
      btn.setAttribute("aria-label", l === "pt" ? "Switch to English" : "Mudar para português");
      btn.innerHTML = l === "pt" ? "<b>PT</b> / EN" : "<b>EN</b> / PT";
    });
  }
  var params = new URLSearchParams(window.location.search);
  var initial = params.get("lang") === "pt" ? "pt" : params.get("lang") === "en" ? "en" : (getStoredLang() || "en");
  applyLang(initial);
  document.querySelectorAll(".lang-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("lang") === "en" ? "pt" : "en";
      applyLang(next);
      storeLang(next);
    });
  });

  /* ---------- Year in footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Reveal on scroll + animated bars ---------- */
  var revealEls = document.querySelectorAll(".reveal, .bar__fill");
  function show(el) {
    el.classList.add("is-in");
    if (el.classList.contains("bar__fill")) el.style.width = el.getAttribute("data-value") + "%";
  }
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(show);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Case study: chapter scrollspy + progress ---------- */
  var chapters = Array.prototype.slice.call(document.querySelectorAll(".chapter[id]"));
  if (chapters.length) {
    var links = Array.prototype.slice.call(document.querySelectorAll(".toc a, .toc-mobile a"));
    var progress = document.querySelector(".toc__progress span");
    var mobileDetails = document.querySelector(".toc-mobile details");
    var mobileCurrent = document.querySelector(".toc-mobile [data-current]");

    function setCurrent(id) {
      links.forEach(function (a) {
        if (a.getAttribute("href") === "#" + id) {
          a.setAttribute("aria-current", "true");
          if (mobileCurrent && a.closest(".toc-mobile")) mobileCurrent.innerHTML = a.innerHTML;
        } else {
          a.removeAttribute("aria-current");
        }
      });
    }
    function onScroll() {
      var y = window.scrollY + 140;
      var current = chapters[0].id;
      for (var i = 0; i < chapters.length; i++) {
        if (chapters[i].offsetTop <= y) current = chapters[i].id;
      }
      setCurrent(current);
      if (progress) {
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        progress.style.width = (max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0) + "%";
      }
    }
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(function () { onScroll(); ticking = false; }); ticking = true; }
    }, { passive: true });
    onScroll();

    // Close the mobile chapter list after choosing a chapter
    document.querySelectorAll(".toc-mobile a").forEach(function (a) {
      a.addEventListener("click", function () { if (mobileDetails) mobileDetails.open = false; });
    });
    // Move focus to the chapter heading for keyboard / screen-reader users
    links.forEach(function (a) {
      a.addEventListener("click", function () {
        var target = document.querySelector(a.getAttribute("href"));
        if (!target) return;
        var h = target.querySelector("h2");
        if (h) { h.setAttribute("tabindex", "-1"); setTimeout(function () { h.focus({ preventScroll: true }); }, 350); }
      });
    });
  }

  /* ---------- Hero FX: neural network + radar sweep ---------- */
  var canvas = document.getElementById("fx-canvas");
  if (canvas && !reduceMotion && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, nodes = [], angle = 0, running = true, raf;

    function resize() {
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(Math.min(70, Math.max(26, (W * H) / 22000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.6 + 0.6
        });
      }
    }

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);

      // network
      var maxD = 130;
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxD) {
            ctx.strokeStyle = "rgba(95,212,255," + (0.16 * (1 - d / maxD)).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (var k = 0; k < nodes.length; k++) {
        ctx.fillStyle = "rgba(160,230,255,0.7)";
        ctx.beginPath(); ctx.arc(nodes[k].x, nodes[k].y, nodes[k].r, 0, Math.PI * 2); ctx.fill();
      }

      // radar sweep (right side)
      var cx = W * 0.82, cy = H * 0.55, R = Math.min(W, H) * 0.42;
      ctx.strokeStyle = "rgba(95,212,255,0.10)";
      for (var c = 1; c <= 3; c++) { ctx.beginPath(); ctx.arc(cx, cy, (R / 3) * c, 0, Math.PI * 2); ctx.stroke(); }
      angle += 0.008;
      var grad = ctx.createLinearGradient(cx, cy, cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
      grad.addColorStop(0, "rgba(95,212,255,0.0)");
      grad.addColorStop(1, "rgba(95,212,255,0.28)");
      ctx.strokeStyle = grad; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R); ctx.stroke();
      ctx.fillStyle = "rgba(95,212,255,0.05)";
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, angle - 0.5, angle); ctx.closePath(); ctx.fill();

      raf = window.requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", function () { resize(); });
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running) { window.cancelAnimationFrame(raf); draw(); }
    });
  }
})();
