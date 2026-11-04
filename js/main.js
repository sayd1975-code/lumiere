/* Lumière — interakcje: nawigacja, animacje scroll, lightbox, formularz, podgląd SPA */
(function () {
  "use strict";

  var body = document.body;
  var isSPA = body.dataset.spa === "true";
  var isPWA = body.dataset.pwa === "true";

  /* ---------- Rok w stopce ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Skip link do treści ---------- */
  var skip = document.querySelector(".skip-link");
  if (skip) {
    skip.addEventListener("click", function (e) {
      e.preventDefault();
      var m = document.querySelector("main:not([hidden])") || document.querySelector("main");
      if (m) {
        m.setAttribute("tabindex", "-1");
        m.focus();
        m.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  /* ---------- Nawigacja mobilna ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", body.classList.contains("nav-open") ? "true" : "false");
    });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        body.classList.remove("nav-open");
      });
    });
  }

  /* ---------- Aktywny link (wersja wielostronicowa) ---------- */
  if (!isSPA) {
    var file = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav a").forEach(function (a) {
      if ((a.getAttribute("href") || "").indexOf(file) !== -1) a.classList.add("is-active");
    });
  }

  /* ---------- Pojawianie się elementów przy przewijaniu ---------- */
  var io = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("inview");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
  }

  function watchReveals(scope) {
    var els = (scope || document).querySelectorAll(".reveal:not(.inview)");
    if (!io) {
      els.forEach(function (el) { el.classList.add("inview"); });
      return;
    }
    els.forEach(function (el) { io.observe(el); });
  }

  watchReveals(document);

  /* ---------- Lightbox galerii ---------- */
  var lightbox = document.querySelector(".lightbox");

  function openLightbox(art, caption) {
    if (!lightbox) return;
    var inner = lightbox.querySelector(".lightbox__inner");
    inner.innerHTML =
      '<div class="art">' + art.innerHTML + "</div>" +
      '<div class="lightbox__caption">' + caption + "</div>";
    lightbox.classList.add("open");
    body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    body.style.overflow = "";
  }

  document.querySelectorAll(".g-item").forEach(function (item) {
    item.addEventListener("click", function () {
      var art = item.querySelector(".g-item__art");
      var cap = item.querySelector(".g-item__caption");
      if (art && cap) openLightbox(art, cap.innerHTML);
    });
  });
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target.closest(".lightbox__close")) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }

  /* ---------- Formularz kontaktowy (demo) ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;

      function check(id, allowEmpty) {
        var field = document.getElementById(id);
        if (!field) return;
        var wrap = field.closest(".field");
        var bad = allowEmpty && !field.value ? false : !field.value || !field.checkValidity();
        if (bad) ok = false;
        wrap.classList.toggle("has-error", bad);
      }

      check("f-name");
      check("f-email");
      check("f-phone", true);
      check("f-service");
      check("f-message");

      var consent = document.getElementById("f-consent");
      var consentWrap = consent ? consent.closest(".consent") : null;
      var consentOk = consent ? consent.checked : true;
      if (consentWrap) consentWrap.classList.toggle("has-error", !consentOk);
      if (!consentOk) ok = false;

      if (!ok) return;

      /* Demo: brak backendu — pokazujemy stan sukcesu.
         Po podpięciu backendu (np. Formspree) tu trafia fetch(). */
      form.style.display = "none";
      var success = document.querySelector(".form-success");
      if (success) success.classList.add("show");
    });
  }

  /* ---------- Router podglądu SPA (tylko wersja demo w jednym pliku) ---------- */
  if (isSPA) {
    var pages = document.querySelectorAll("main.page");
    var titles = {
      home: "Lumière — Studio Urody",
      "o-nas": "O nas — Lumière",
      oferta: "Oferta i cennik — Lumière",
      galeria: "Galeria — Lumière",
      kontakt: "Kontakt — Lumière"
    };

    function showPage(name, push) {
      var found = false;
      pages.forEach(function (p) {
        var match = p.dataset.page === name;
        if (match) found = true;
        p.hidden = !match;
      });
      if (!found) return;
      document.title = titles[name] || titles.home;
      document.querySelectorAll(".nav a").forEach(function (a) {
        a.classList.toggle("is-active", a.dataset.page === name);
      });
      var current = document.querySelector('main.page[data-page="' + name + '"]');
      current.querySelectorAll(".reveal").forEach(function (el) {
        el.classList.remove("inview");
      });
      watchReveals(current);
      window.scrollTo({ top: 0, behavior: "auto" });
      if (push && location.hash !== "#" + name) location.hash = name;
    }

    document.querySelectorAll('a[data-page]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        showPage(a.dataset.page, true);
      });
    });

    var initial = (location.hash || "#home").slice(1);
    showPage(initial, false);
    window.addEventListener("hashchange", function () {
      showPage((location.hash || "#home").slice(1), false);
    });
  }

  /* ---------- Service worker (wersja na GitHub Pages) ---------- */
  if (isPWA && "serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }
})();
