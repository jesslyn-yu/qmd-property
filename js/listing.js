/* =============================================================================
   QMD Property — Single listing page (live Mantis data via the QMD Worker).
   Reads ?id=<propertyID>&type=<listingType> from the URL.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.getElementById("listing-root");
  if (!root || typeof QMDApi === "undefined") return;

  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");
  var type = params.get("type") || "residential";

  root.innerHTML = '<div class="empty-state"><h2>Loading property…</h2></div>';

  if (!id) {
    root.innerHTML = '<div class="empty-state"><h2>Property not found</h2><a class="btn btn--primary" href="buy.html">Browse all listings</a></div>';
    return;
  }

  QMDApi.listing(id, type).then(function (l) {
    if (!l) {
      root.innerHTML = '<div class="empty-state"><h2>Property not found</h2><p>This listing may have been sold or withdrawn.</p><a class="btn btn--primary" href="buy.html">Browse all listings</a></div>';
      return;
    }
    render(l);

    // Fire the view-count exactly once per page load (fire-and-forget).
    QMDApi.viewCount(l.listingType, l.id).catch(function () {});
  }).catch(function () {
    root.innerHTML = '<div class="empty-state"><h2>Couldn\'t load this property</h2><p>Please refresh, or contact us at info@qmdproperty.com.</p></div>';
  });

  function render(l) {
    document.title = (l.heading || "Property") + " — QMD Property";

    var forLabel = l.listingType === "rental" ? "For Rent" : "For Sale";
    var images = l.photos.length ? l.photos : [{ full: "https://placehold.co/800x560/0d2240/ff7a1a?text=QMD+Property", mid: "", thumb: "" }];
    var thumbs = images.map(function (p, i) {
      return '<img src="' + (p.thumb || p.mid || p.full) + '" data-src="' + p.full + '" alt="View ' + (i + 1) + '" class="' + (i === 0 ? "active" : "") + '">';
    }).join("");

    var loc = [l.address, l.suburb, l.state, l.postcode].filter(Boolean).join(", ");

    var features = l.features.length
      ? '<div class="section--tight" style="padding-bottom:0"><h2 style="font-size:1.4rem">Features</h2><div class="property__specs" style="flex-wrap:wrap;gap:10px">' +
          l.features.map(function (f) { return '<span class="badge">' + f + "</span>"; }).join("") + "</div></div>"
      : "";

    root.innerHTML =
      '<nav class="breadcrumb"><a href="index.html">Home</a> / <a href="buy.html">Buy</a> / ' + (l.heading || l.type) + "</nav>" +
      '<div class="listing-hero">' +
        "<div>" +
          '<div class="gallery__main"><img id="gallery-main" src="' + images[0].full + '" alt="' + (l.heading || l.type) + '"></div>' +
          '<div class="gallery__thumbs">' + thumbs + "</div>" +
        "</div>" +
        '<aside class="listing-summary">' +
          '<span class="badge">' + l.type + " · " + forLabel + "</span>" +
          "<h1 style=\"font-size:1.6rem;margin:14px 0 4px\">" + (l.heading || l.type) + "</h1>" +
          '<p class="muted" style="margin-bottom:14px">◴ ' + (loc || "Sydney NSW") + "</p>" +
          '<div class="price">' + QMDApi.formatPrice(l) + "</div>" +
          '<ul class="spec-list">' +
            "<li><span>Bedrooms</span><span>" + l.bedrooms + "</span></li>" +
            "<li><span>Bathrooms</span><span>" + l.bathrooms + "</span></li>" +
            "<li><span>Parking</span><span>" + l.parking + "</span></li>" +
            "<li><span>Type</span><span>" + l.type + "</span></li>" +
          "</ul>" +
          (l.underContract ? '<p class="text-orange" style="margin-top:14px;font-weight:700">Under Offer</p>' : "") +
          '<a class="btn btn--primary btn--block" href="#enquire" style="margin-top:22px">Enquire Now</a>' +
        "</aside>" +
      "</div>" +
      '<div class="section--tight" style="padding-bottom:0"><h2 style="font-size:1.5rem">About this property</h2>' +
        '<p class="lead" style="white-space:pre-line">' + (l.description || "") + "</p></div>" +
      features;

    // Gallery thumbnail switching.
    var main = document.getElementById("gallery-main");
    root.querySelectorAll(".gallery__thumbs img").forEach(function (t) {
      t.addEventListener("click", function () {
        main.src = t.getAttribute("data-src");
        root.querySelectorAll(".gallery__thumbs img").forEach(function (x) { x.classList.remove("active"); });
        t.classList.add("active");
      });
    });

    // Pre-fill the investment calculator with this listing's price.
    var cp = document.getElementById("c-price");
    if (cp && l.price > 0) { cp.value = l.price; cp.dispatchEvent(new Event("input", { bubbles: true })); }

    // Wire the enquiry form to this listing.
    var lid = document.getElementById("en-listing-id");
    var lty = document.getElementById("en-listing-type");
    if (lid) lid.value = l.id;
    if (lty) lty.value = l.listingType;
    var heading = document.getElementById("enquire-heading");
    if (heading) heading.textContent = "Enquire about " + (l.heading || l.type);
  }
})();
