/* =============================================================================
   QMD Property — Single listing page.
   Reads ?id=N from the URL and renders the matching listing from QMD_LISTINGS.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.getElementById("listing-root");
  if (!root || typeof QMD_LISTINGS === "undefined") return;

  var id = Number(new URLSearchParams(window.location.search).get("id"));
  var l = QMD_LISTINGS.filter(function (x) { return x.id === id; })[0];

  if (!l) {
    root.innerHTML =
      '<div class="empty-state"><h2>Property not found</h2>' +
      '<p>This listing may have been sold or removed.</p>' +
      '<a class="btn btn--primary" href="buy.html">Browse all listings</a></div>';
    return;
  }

  document.title = l.name + " — QMD Property";

  var images = [l.photo].concat(l.gallery || []);
  var thumbs = images
    .map(function (src, i) {
      return '<img src="' + src + '" alt="View ' + (i + 1) + '" data-src="' + src + '" class="' + (i === 0 ? "active" : "") + '">';
    })
    .join("");

  root.innerHTML =
    '<nav class="breadcrumb"><a href="index.html">Home</a> / <a href="buy.html">Buy</a> / ' + l.name + "</nav>" +
    '<div class="listing-hero">' +
      "<div>" +
        '<div class="gallery__main"><img id="gallery-main" src="' + images[0] + '" alt="' + l.name + '"></div>' +
        '<div class="gallery__thumbs">' + thumbs + "</div>" +
      "</div>" +
      '<aside class="listing-summary">' +
        '<span class="badge">' + l.type + " · For " + l.listingType + "</span>" +
        "<h1 style=\"font-size:1.7rem;margin:14px 0 4px\">" + l.name + "</h1>" +
        '<p class="muted" style="margin-bottom:14px">◴ ' + l.suburb + ", Sydney NSW</p>" +
        '<div class="price">' + QMD.formatPrice(l.price) + "</div>" +
        '<div class="invest-stats">' +
          '<div class="box"><div class="v">' + l.rentalYield.toFixed(1) + '%</div><div class="k">Rental yield</div></div>' +
          '<div class="box"><div class="v">' + l.capRate.toFixed(1) + '%</div><div class="k">Cap rate</div></div>' +
          '<div class="box"><div class="v">' + l.roi.toFixed(1) + '%</div><div class="k">ROI</div></div>' +
        "</div>" +
        '<ul class="spec-list">' +
          "<li><span>Bedrooms</span><span>" + l.bedrooms + "</span></li>" +
          "<li><span>Bathrooms</span><span>" + l.bathrooms + "</span></li>" +
          "<li><span>Parking</span><span>" + l.parking + "</span></li>" +
          "<li><span>Type</span><span>" + l.type + "</span></li>" +
        "</ul>" +
        '<a class="btn btn--primary btn--block" href="#enquire" style="margin-top:22px">Enquire Now</a>' +
      "</aside>" +
    "</div>" +
    '<div class="section--tight" style="padding-bottom:0">' +
      "<h2 style=\"font-size:1.5rem\">About this investment</h2>" +
      '<p class="lead">' + l.description + "</p>" +
      "<p class=\"muted\">Estimated gross rental yield of <strong class=\"text-orange\">" + l.rentalYield.toFixed(1) +
        "%</strong>, a capitalisation rate of <strong class=\"text-orange\">" + l.capRate.toFixed(1) +
        "%</strong> and a projected return on investment of <strong class=\"text-orange\">" + l.roi.toFixed(1) +
        "%</strong>. Figures are indicative for illustration only and should be confirmed with your QMD investment advisor.</p>" +
    "</div>";

  /* gallery thumbnail switching */
  var main = document.getElementById("gallery-main");
  root.querySelectorAll(".gallery__thumbs img").forEach(function (t) {
    t.addEventListener("click", function () {
      main.src = t.getAttribute("data-src");
      root.querySelectorAll(".gallery__thumbs img").forEach(function (x) { x.classList.remove("active"); });
      t.classList.add("active");
    });
  });

  /* prefill the investment calculator with this property's numbers.
     Runs before calculator.js initialises, so its first calculation uses these. */
  var calcPrice = document.getElementById("c-price");
  if (calcPrice) calcPrice.value = l.price;
  var calcRent = document.getElementById("c-rent");
  if (calcRent) calcRent.value = Math.round((l.price * (l.rentalYield / 100)) / 52);

  /* prefill the enquiry form's subject with the property name */
  var subject = document.getElementById("enquiry-subject");
  if (subject) subject.value = "Enquiry: " + l.name + " (" + l.suburb + ")";
  var heading = document.getElementById("enquire-heading");
  if (heading) heading.textContent = "Enquire about " + l.name;
})();
