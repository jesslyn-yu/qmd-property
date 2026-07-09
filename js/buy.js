/* =============================================================================
   QMD Property — Buy page (live Mantis data via the QMD Worker).
   Fetches listings + search fields from the Worker, then filters, sorts and
   paginates client-side (12 per page).
   ========================================================================== */
(function () {
  "use strict";

  var grid = document.getElementById("listings-grid");
  if (!grid || typeof QMDApi === "undefined") return;

  var PER_PAGE = 12;
  var currentPage = 1;
  var allListings = [];   // everything fetched for the current listingType
  var filtered = [];

  var els = {
    keyword: document.getElementById("f-keyword"),
    suburb: document.getElementById("f-suburb"),
    type: document.getElementById("f-type"),
    listingType: document.getElementById("f-listing-type"),
    beds: document.getElementById("f-beds"),
    price: document.getElementById("f-price"),
    sort: document.getElementById("f-sort"),
    count: document.getElementById("results-count"),
    pagination: document.getElementById("pagination"),
    reset: document.getElementById("f-reset"),
  };

  function listingTypeLabel() {
    return (els.listingType && els.listingType.value) === "rental" ? "For Rent" : "For Sale";
  }

  function cardHTML(l) {
    var photo = l.photos[0] ? l.photos[0].mid : "https://placehold.co/800x560/0d2240/ff7a1a?text=QMD+Property";
    var loc = [l.suburb, l.state].filter(Boolean).join(", ");
    return (
      '<a class="card property reveal in" href="listing.html?id=' + l.id + "&type=" + encodeURIComponent(l.listingType) + '">' +
        '<div class="property__media">' +
          '<img src="' + photo + '" alt="' + (l.heading || l.type) + '" loading="lazy">' +
          '<span class="property__type">' + l.type + " · " + listingTypeLabel() + "</span>" +
          (l.underContract ? '<span class="property__yield">Under Offer</span>' : "") +
        "</div>" +
        '<div class="property__body">' +
          '<span class="property__suburb">◴ ' + (loc || "Sydney") + "</span>" +
          '<span class="property__name">' + (l.heading || l.type) + "</span>" +
          '<span class="property__price">' + QMDApi.formatPrice(l) + "</span>" +
          '<div class="property__specs">' +
            "<span>⌂ " + l.bedrooms + " bd</span>" +
            "<span>⊹ " + l.bathrooms + " ba</span>" +
            "<span>⊞ " + l.parking + " car</span>" +
          "</div>" +
          '<span class="btn btn--ghost btn--block property__cta">View details</span>' +
        "</div>" +
      "</a>"
    );
  }

  function applyFilters() {
    var kw = (els.keyword && els.keyword.value || "").trim().toLowerCase();
    var suburb = els.suburb && els.suburb.value;
    var type = els.type && els.type.value;
    var minBeds = els.beds && els.beds.value ? Number(els.beds.value) : 0;
    var maxPrice = els.price && els.price.value ? Number(els.price.value) : Infinity;

    filtered = allListings.filter(function (l) {
      if (kw && (l.heading + " " + l.suburb + " " + l.type + " " + l.address).toLowerCase().indexOf(kw) === -1) return false;
      if (suburb && l.suburb !== suburb) return false;
      if (type && l.type !== type) return false;
      if (minBeds && l.bedrooms < minBeds) return false;
      if (maxPrice !== Infinity && (l.price === 0 || l.price > maxPrice)) return false;
      return true;
    });

    var sort = els.sort && els.sort.value;
    if (sort === "price-asc") filtered.sort(function (a, b) { return a.price - b.price; });
    else if (sort === "price-desc") filtered.sort(function (a, b) { return b.price - a.price; });
    else if (sort === "beds-desc") filtered.sort(function (a, b) { return b.bedrooms - a.bedrooms; });

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
      els.count.textContent = total
        ? total + (total === 1 ? " property" : " properties") + " · showing " + (start + 1) + "–" + (start + pageItems.length)
        : "No properties found";
    }

    grid.innerHTML = pageItems.length
      ? pageItems.map(cardHTML).join("")
      : '<div class="empty-state" style="grid-column:1/-1"><h3>No properties match your filters</h3><p>Try widening your price range or clearing a filter.</p></div>';

    renderPagination(pages);
    if (grid.offsetTop) window.scrollTo({ top: grid.offsetTop - 120, behavior: "smooth" });
  }

  function renderPagination(pages) {
    if (!els.pagination) return;
    if (pages <= 1) { els.pagination.innerHTML = ""; return; }
    var html = '<button data-go="' + (currentPage - 1) + '"' + (currentPage === 1 ? " disabled" : "") + ">‹ Prev</button>";
    for (var p = 1; p <= pages; p++) {
      html += '<button data-go="' + p + '" class="' + (p === currentPage ? "active" : "") + '">' + p + "</button>";
    }
    html += '<button data-go="' + (currentPage + 1) + '"' + (currentPage === pages ? " disabled" : "") + ">Next ›</button>";
    els.pagination.innerHTML = html;
  }

  function setSelectOptions(select, keepFirst, items, valueKey, labelKey) {
    if (!select) return;
    var first = keepFirst ? select.options[0] : null;
    select.innerHTML = "";
    if (first) select.appendChild(first);
    items.forEach(function (it) {
      var o = document.createElement("option");
      o.value = valueKey ? it[valueKey] : it;
      o.textContent = labelKey ? it[labelKey] : it;
      select.appendChild(o);
    });
  }

  /* Fetch listings + search fields for the currently selected listingType. */
  async function load() {
    var listingType = (els.listingType && els.listingType.value) || "residential";
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><h3>Loading listings…</h3></div>';

    try {
      var sf = await QMDApi.searchFields(listingType);
      if (sf && sf.categoryList) {
        setSelectOptions(els.type, true, sf.categoryList, "name", "name");
      }
      if (sf && sf.suburbList) {
        var suburbs = sf.suburbList.map(function (s) { return s.name; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort();
        setSelectOptions(els.suburb, true, suburbs);
      }
    } catch (e) { /* dropdowns stay minimal if search-fields fails */ }

    try {
      var res = await QMDApi.listings({ listingType: listingType });
      allListings = res.listings || [];
      applyFilters();
    } catch (e) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><h3>Couldn\'t load listings</h3><p>Please refresh, or contact us at info@qmdproperty.com.</p></div>';
    }
  }

  /* Events */
  ["keyword", "suburb", "type", "beds", "price", "sort"].forEach(function (k) {
    var el = els[k];
    if (!el) return;
    el.addEventListener(el.tagName === "SELECT" ? "change" : "input", applyFilters);
  });
  if (els.listingType) els.listingType.addEventListener("change", load); // refetch on sale/rent switch

  if (els.reset) {
    els.reset.addEventListener("click", function () {
      ["keyword", "suburb", "type", "beds", "price", "sort"].forEach(function (k) { if (els[k]) els[k].value = ""; });
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

  /* Pre-select listing type from URL (e.g. from the home search bar) */
  (function prefill() {
    var params = new URLSearchParams(window.location.search);
    if (params.get("listingType") && els.listingType) els.listingType.value = params.get("listingType");
  })();

  load();
})();
