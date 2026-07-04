/* =============================================================================
   QMD Property — Buy page: render listings, search, filters, pagination.
   Reads from the global QMD_LISTINGS (see js/listings-data.js).
   ========================================================================== */
(function () {
  "use strict";

  var grid = document.getElementById("listings-grid");
  if (!grid || typeof QMD_LISTINGS === "undefined") return;

  var PER_PAGE = 12;
  var currentPage = 1;
  var filtered = QMD_LISTINGS.slice();

  var els = {
    keyword: document.getElementById("f-keyword"),
    suburb: document.getElementById("f-suburb"),
    type: document.getElementById("f-type"),
    listingType: document.getElementById("f-listing-type"),
    price: document.getElementById("f-price"),
    roi: document.getElementById("f-roi"),
    sort: document.getElementById("f-sort"),
    count: document.getElementById("results-count"),
    pagination: document.getElementById("pagination"),
    reset: document.getElementById("f-reset")
  };

  /* Populate suburb dropdown from the data */
  (function populateSuburbs() {
    if (!els.suburb) return;
    var suburbs = QMD_LISTINGS.map(function (l) { return l.suburb; })
      .filter(function (v, i, a) { return a.indexOf(v) === i; })
      .sort();
    suburbs.forEach(function (s) {
      var o = document.createElement("option");
      o.value = s; o.textContent = s;
      els.suburb.appendChild(o);
    });
  })();

  function cardHTML(l) {
    return (
      '<a class="card property reveal in" href="listing.html?id=' + l.id + '">' +
        '<div class="property__media">' +
          '<img src="' + l.photo + '" alt="' + l.name + ', ' + l.suburb + '" loading="lazy">' +
          '<span class="property__type">' + l.type + " · " + l.listingType + "</span>" +
          '<span class="property__yield">' + l.rentalYield.toFixed(1) + "% yield</span>" +
        "</div>" +
        '<div class="property__body">' +
          '<span class="property__suburb">◴ ' + l.suburb + ", Sydney</span>" +
          '<span class="property__name">' + l.name + "</span>" +
          '<span class="property__price">' + QMD.formatPrice(l.price) + "</span>" +
          '<div class="property__specs">' +
            "<span>⌂ " + l.bedrooms + " bd</span>" +
            "<span>⊹ " + l.bathrooms + " ba</span>" +
            "<span>⊞ " + l.parking + " car</span>" +
          "</div>" +
          '<div class="property__stats">' +
            '<div class="stat-pill"><div class="v">' + l.capRate.toFixed(1) + "%</div><div class=\"k\">Cap rate</div></div>" +
            '<div class="stat-pill"><div class="v">' + l.roi.toFixed(1) + "%</div><div class=\"k\">ROI</div></div>" +
            '<div class="stat-pill"><div class="v">' + l.rentalYield.toFixed(1) + "%</div><div class=\"k\">Yield</div></div>" +
          "</div>" +
        "</div>" +
      "</a>"
    );
  }

  function applyFilters() {
    var kw = (els.keyword && els.keyword.value || "").trim().toLowerCase();
    var suburb = els.suburb && els.suburb.value;
    var type = els.type && els.type.value;
    var lt = els.listingType && els.listingType.value;
    var maxPrice = els.price && els.price.value ? Number(els.price.value) : Infinity;
    var minRoi = els.roi && els.roi.value ? Number(els.roi.value) : 0;

    filtered = QMD_LISTINGS.filter(function (l) {
      if (kw && (l.name + " " + l.suburb + " " + l.type).toLowerCase().indexOf(kw) === -1) return false;
      if (suburb && l.suburb !== suburb) return false;
      if (type && l.type !== type) return false;
      if (lt && l.listingType !== lt) return false;
      if (l.price > maxPrice) return false;
      if (l.roi < minRoi) return false;
      return true;
    });

    var sort = els.sort && els.sort.value;
    if (sort === "price-asc") filtered.sort(function (a, b) { return a.price - b.price; });
    else if (sort === "price-desc") filtered.sort(function (a, b) { return b.price - a.price; });
    else if (sort === "yield-desc") filtered.sort(function (a, b) { return b.rentalYield - a.rentalYield; });
    else if (sort === "roi-desc") filtered.sort(function (a, b) { return b.roi - a.roi; });

    currentPage = 1;
    render();
  }

  function render() {
    var total = filtered.length;
    var pages = Math.max(1, Math.ceil(total / PER_PAGE));
    if (currentPage > pages) currentPage = pages;
    var start = (currentPage - 1) * PER_PAGE;
    var pageItems = filtered.slice(start, start + PER_PAGE);

    if (els.count) {
      els.count.textContent =
        total + (total === 1 ? " property" : " properties") +
        (total ? " · showing " + (start + 1) + "–" + (start + pageItems.length) : "");
    }

    if (!pageItems.length) {
      grid.innerHTML =
        '<div class="empty-state" style="grid-column:1/-1">' +
        "<h3>No properties match your filters</h3>" +
        "<p>Try widening your price range or clearing a filter.</p></div>";
    } else {
      grid.innerHTML = pageItems.map(cardHTML).join("");
    }

    renderPagination(pages);
    window.scrollTo({ top: grid.offsetTop - 120, behavior: "smooth" });
  }

  function renderPagination(pages) {
    if (!els.pagination) return;
    if (pages <= 1) { els.pagination.innerHTML = ""; return; }
    var html = "";
    html += '<button data-go="' + (currentPage - 1) + '"' + (currentPage === 1 ? " disabled" : "") + ">‹ Prev</button>";
    for (var p = 1; p <= pages; p++) {
      html += '<button data-go="' + p + '" class="' + (p === currentPage ? "active" : "") + '">' + p + "</button>";
    }
    html += '<button data-go="' + (currentPage + 1) + '"' + (currentPage === pages ? " disabled" : "") + ">Next ›</button>";
    els.pagination.innerHTML = html;
  }

  /* Events */
  ["keyword", "suburb", "type", "listingType", "price", "roi", "sort"].forEach(function (k) {
    var el = els[k];
    if (!el) return;
    var evt = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(evt, applyFilters);
  });

  if (els.reset) {
    els.reset.addEventListener("click", function () {
      ["keyword", "suburb", "type", "listingType", "price", "roi", "sort"].forEach(function (k) {
        if (els[k]) els[k].value = "";
      });
      applyFilters();
    });
  }

  if (els.pagination) {
    els.pagination.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-go]");
      if (!btn || btn.disabled) return;
      currentPage = Number(btn.getAttribute("data-go"));
      render();
    });
  }

  /* Pre-fill from URL (e.g. coming from the home search bar) */
  (function prefillFromURL() {
    var params = new URLSearchParams(window.location.search);
    if (params.get("type") && els.type) els.type.value = params.get("type");
    if (params.get("listingType") && els.listingType) els.listingType.value = params.get("listingType");
    if (params.get("suburb") && els.suburb) els.suburb.value = params.get("suburb");
  })();

  applyFilters();
})();
