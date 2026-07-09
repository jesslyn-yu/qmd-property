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
  QMD.initSlideshow = function () {
    var slideshow = document.querySelector("[data-slideshow]");
    if (!slideshow) return;
    var track = slideshow.querySelector(".slideshow__track");
    var slides = slideshow.querySelectorAll(".slideshow__slide");
    if (!slides.length || slideshow.getAttribute("data-init") === "1") return; // wait for async data / avoid double init
    slideshow.setAttribute("data-init", "1");
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
  };
  QMD.initSlideshow();

  /* ---------------------------------------------------------------- year stamp */
  var yearEl = document.querySelectorAll("[data-year]");
  yearEl.forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------------------------------------------------------------- Lead forms
     Forms tagged with data-qmd-form POST to the QMD Worker (Mantis). Success or
     failure is decided by the `status` field Mantis returns ("Success"/"Error"),
     never silently swallowed. Field names read from the form:
       name, email, phone, message, investment_budget, property_address,
       listingID, listingType (hidden, set per listing)
     Form attributes:
       data-qmd-form="enquiry" | "appraisal"
       data-source="..."         (label stored against the lead)
       data-listing-type="..."   (appraisal default listingType) */
  var leadForms = document.querySelectorAll("form[data-qmd-form]");
  leadForms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (typeof QMDApi === "undefined") return;

      var kind = form.getAttribute("data-qmd-form");
      var success = form.querySelector(".form-success");
      var btn = form.querySelector("button[type=submit]");
      var val = function (n) {
        var el = form.querySelector('[name="' + n + '"]');
        return el ? String(el.value).trim() : "";
      };

      var showError = function (msg) {
        var box = form.querySelector(".form-error");
        if (!box) {
          box = document.createElement("div");
          box.className = "form-error";
          box.setAttribute("role", "alert");
          form.insertBefore(box, form.firstChild);
        }
        box.textContent = msg || "Sorry, we couldn't send your message. Please try again, or email us at info@qmdproperty.com.";
        box.classList.add("show");
      };
      var done = function (ok, msg) {
        var errorBox = form.querySelector(".form-error");
        if (ok) {
          if (success) success.classList.add("show");
          if (errorBox) errorBox.classList.remove("show");
          form.reset();
        } else {
          showError(msg);
        }
        if (btn) { btn.disabled = false; btn.textContent = btn.getAttribute("data-label") || "Send"; }
      };
      if (btn) { btn.setAttribute("data-label", btn.textContent); btn.disabled = true; btn.textContent = "Sending…"; }

      var name = qmdSplitName(val("name"));
      var payload = { firstName: name.firstName, lastName: name.lastName, email: val("email"), phone: val("phone") };
      var notes = [];
      if (val("message")) notes.push(val("message"));
      if (val("investment_budget")) notes.push("Investment budget: " + val("investment_budget"));

      var apiCall;
      if (kind === "appraisal") {
        payload.listingAddress = val("property_address");
        payload.listingType = form.getAttribute("data-listing-type") || "residential";
        payload.notes = notes.join("\n");
        apiCall = QMDApi.appraisal(payload);
      } else {
        if (val("property_address")) notes.push("Property address: " + val("property_address"));
        payload.notes = notes.join("\n");
        var src = form.getAttribute("data-source");
        if (src) payload.source = src;
        if (val("listingID")) payload.listingID = val("listingID");
        if (val("listingType")) payload.listingType = val("listingType");
        apiCall = QMDApi.enquiry(payload);
      }

      apiCall
        .then(function (resp) {
          if (resp && resp.status === "Success") return done(true);
          var msg = resp && resp.errors && resp.errors[0] && resp.errors[0].message;
          done(false, msg ? "Couldn't send: " + msg : undefined);
        })
        .catch(function () { done(false); });
    });
  });
})();
