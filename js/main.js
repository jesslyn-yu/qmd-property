/* =============================================================================
   QMD Property — shared site behaviour
   Navigation, scroll reveals, hero parallax, featured slideshow, helpers.
   Kept dependency-free for fast load.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------- helpers */
  window.QMD = window.QMD || {};

  QMD.formatPrice = function (n) {
    return "$" + Number(n).toLocaleString("en-AU");
  };

  /* ---------------------------------------------------------------- mobile nav */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") links.classList.remove("open");
    });
  }

  /* nav background on scroll */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------- scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("in"); });
    }
  }

  /* ---------------------------------------------------------------- hero parallax */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var parallaxLayers = document.querySelectorAll(".parallax-layer");
  if (parallaxLayers.length && !reduceMotion) {
    var ticking = false;
    var applyParallax = function () {
      var y = window.scrollY;
      parallaxLayers.forEach(function (layer) {
        var speed = parseFloat(layer.getAttribute("data-speed")) || 0.15;
        layer.style.transform = "translate3d(0," + y * speed + "px,0)";
      });
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(applyParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ---------------------------------------------------------------- featured slideshow */
  var slideshow = document.querySelector("[data-slideshow]");
  if (slideshow) {
    var track = slideshow.querySelector(".slideshow__track");
    var slides = slideshow.querySelectorAll(".slideshow__slide");
    var dotsWrap = slideshow.querySelector(".slideshow__dots");
    var prevBtn = slideshow.querySelector("[data-prev]");
    var nextBtn = slideshow.querySelector("[data-next]");
    var index = 0;

    var perView = function () {
      if (window.innerWidth <= 620) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    };

    var maxIndex = function () {
      return Math.max(0, slides.length - perView());
    };

    var dots = [];
    var buildDots = function () {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      dots = [];
      var pages = maxIndex() + 1;
      for (var i = 0; i < pages; i++) {
        (function (i) {
          var b = document.createElement("button");
          b.setAttribute("aria-label", "Go to slide " + (i + 1));
          b.addEventListener("click", function () { go(i); });
          dotsWrap.appendChild(b);
          dots.push(b);
        })(i);
      }
    };

    var update = function () {
      var slideW = slides[0].getBoundingClientRect().width;
      track.style.transform = "translateX(" + -(index * slideW) + "px)";
      dots.forEach(function (d, i) { d.classList.toggle("active", i === index); });
    };

    var go = function (i) {
      index = Math.max(0, Math.min(i, maxIndex()));
      update();
    };

    if (prevBtn) prevBtn.addEventListener("click", function () { go(index - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () {
      index = index >= maxIndex() ? 0 : index + 1;
      update();
    });

    var resizeT;
    window.addEventListener("resize", function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(function () { buildDots(); go(index); }, 150);
    });

    buildDots();
    update();

    /* gentle autoplay, pauses on hover */
    if (!reduceMotion) {
      var timer = setInterval(function () {
        index = index >= maxIndex() ? 0 : index + 1;
        update();
      }, 5000);
      slideshow.addEventListener("mouseenter", function () { clearInterval(timer); });
    }
  }

  /* ---------------------------------------------------------------- year stamp */
  var yearEl = document.querySelectorAll("[data-year]");
  yearEl.forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------------------------------------------------------------- Formspree AJAX
     Progressive enhancement: forms still submit normally if JS fails, but when
     JS is available we POST via fetch and show an inline success message. */
  var ajaxForms = document.querySelectorAll("form[data-formspree]");
  ajaxForms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      var action = form.getAttribute("action") || "";
      // If the Formspree endpoint hasn't been configured yet, just simulate success.
      var notConfigured = action.indexOf("your-form-id") !== -1 || action === "";
      e.preventDefault();
      var success = form.querySelector(".form-success");
      var btn = form.querySelector("button[type=submit]");
      var done = function (ok) {
        if (ok && success) {
          success.classList.add("show");
          form.reset();
        }
        if (btn) { btn.disabled = false; btn.textContent = btn.getAttribute("data-label") || "Send"; }
      };
      if (btn) { btn.setAttribute("data-label", btn.textContent); btn.disabled = true; btn.textContent = "Sending…"; }

      if (notConfigured) {
        setTimeout(function () { done(true); }, 500);
        return;
      }
      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (r) { done(r.ok); })
        .catch(function () { done(false); });
    });
  });
})();
