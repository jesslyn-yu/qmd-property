/* =============================================================================
   QMD Property — Developments / Projects (Market Insights page).
   Lists current projects from the QMD Worker, and (with ?projectID=) shows a
   single project's listings via /api/listings?ProjectID=...&listingType=project.

   NOTE: your account currently has no projects, so the exact project object
   field names couldn't be verified live. Field access below is defensive
   (name/projectName/heading, projectID/id) and may need tweaking once you list
   a real development. The whole section hides itself when there are no projects.
   ========================================================================== */
(function () {
  "use strict";

  var grid = document.getElementById("projects-grid");
  var section = document.getElementById("developments");
  if (!grid || typeof QMDApi === "undefined") return;

  var projectID = new URLSearchParams(location.search).get("projectID");
  function hide() { if (section) section.style.display = "none"; }

  function listingCard(l) {
    var photo = l.photos[0] ? l.photos[0].mid : "https://placehold.co/800x560/0d2240/ff7a1a?text=QMD+Property";
    var loc = [l.suburb, l.state].filter(Boolean).join(", ");
    return '<a class="card property reveal in" href="listing.html?id=' + l.id + "&type=" + encodeURIComponent(l.listingType || "project") + '">' +
      '<div class="property__media"><img src="' + photo + '" alt="' + (l.heading || l.type) + '" loading="lazy"><span class="property__type">' + l.type + "</span></div>" +
      '<div class="property__body"><span class="property__suburb">◴ ' + (loc || "Sydney") + '</span><span class="property__name">' + (l.heading || l.type) + '</span>' +
      '<span class="property__price">' + QMDApi.formatPrice(l) + '</span>' +
      '<div class="property__specs"><span>⌂ ' + l.bedrooms + " bd</span><span>⊹ " + l.bathrooms + " ba</span><span>⊞ " + l.parking + " car</span></div></div></a>";
  }

  function projectCard(p) {
    var id = p.projectID || p.id || p.projectId || "";
    var name = p.name || p.projectName || p.heading || "Development";
    var loc = [p.suburb, p.state].filter(Boolean).join(", ");
    var img = p.image ||
      (p.photos && p.photos[0] && (p.photos[0].midSize || p.photos[0].fullSize)) ||
      "https://placehold.co/800x560/12305a/ff7a1a?text=" + encodeURIComponent(name);
    var desc = String(p.description || "").replace(/<[^>]*>/g, "").slice(0, 120);
    return '<a class="card property reveal in" href="market-insights.html?projectID=' + encodeURIComponent(id) + '#developments">' +
      '<div class="property__media"><img src="' + img + '" alt="' + name + '" loading="lazy"><span class="property__type">Development</span></div>' +
      '<div class="property__body"><span class="property__suburb">◴ ' + (loc || "Sydney") + '</span><span class="property__name">' + name + "</span>" +
      (desc ? '<p class="muted" style="margin:0 0 10px">' + desc + "…</p>" : "") +
      '<span class="btn btn--ghost btn--block property__cta">View development</span></div></a>';
  }

  if (projectID) {
    var sub = document.getElementById("dev-sub");
    var heading = document.getElementById("dev-heading");
    if (heading) heading.textContent = "Development";
    if (sub) sub.textContent = "Properties available in this development.";
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><h3>Loading development…</h3></div>';
    QMDApi.listings({ listingType: "project", ProjectID: projectID }).then(function (res) {
      var list = res.listings || [];
      grid.innerHTML = list.length
        ? list.map(listingCard).join("")
        : '<div class="empty-state" style="grid-column:1/-1"><h3>No properties listed in this development yet.</h3><a class="btn btn--ghost" href="market-insights.html#developments" style="margin-top:12px">← Back to developments</a></div>';
    }).catch(hide);
    return;
  }

  QMDApi.projects({ searchType: "current" }).then(function (res) {
    var list = res.projects || [];
    if (!list.length) return hide(); // no developments -> section stays hidden
    grid.innerHTML = list.map(projectCard).join("");
  }).catch(hide);
})();
