/* =============================================================================
   QMD Property — live data client
   -----------------------------------------------------------------------------
   Replaces the old placeholder `listings-data.js`. All property data and lead
   submissions go through the QMD Cloudflare Worker, which holds the Mantis
   credentials server-side. The browser never sees the API key / agency ID and
   never calls api.mantisproperty.com.au directly.

   To point at a different Worker (e.g. after moving to the .com.au domain),
   change QMD_API_BASE below — that's the only line that needs to change.
   ========================================================================== */

const QMD_API_BASE = "https://qmd-mantis-proxy.jesslyn-yu.workers.dev";

const QMDApi = (function () {
  "use strict";

  async function getJSON(path, params) {
    const url = new URL(QMD_API_BASE + path);
    if (params) {
      Object.keys(params).forEach(function (k) {
        if (params[k] !== undefined && params[k] !== null && params[k] !== "") {
          url.searchParams.set(k, params[k]);
        }
      });
    }
    const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
    return res.json();
  }

  async function postJSON(path, body) {
    const res = await fetch(QMD_API_BASE + path, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  }

  /* ---- Normalisation: Mantis listing -> the shape our UI renders ---------- */
  function normalizeListing(m) {
    var photos = (m.photos || [])
      .slice()
      .sort(function (a, b) { return (a.displayOrder || 0) - (b.displayOrder || 0); })
      .map(function (p) { return { full: p.fullSize, mid: p.midSize || p.fullSize, thumb: p.thumbnail || p.midSize || p.fullSize }; });

    return {
      id: m.propertyID,
      listingType: m.listingType || "residential",
      uniqueID: m.uniqueID,
      type: m.category1 || "Property",
      price: m.searchPrice || 0,
      showPrice: m.showPrice !== false,
      displayPrice: m.displayPrice || "Contact Agent",
      bedrooms: m.bedrooms || 0,
      bathrooms: m.bathrooms || 0,
      parking: m.carSpaces || 0,
      address: m.streetAddress || "",
      suburb: m.suburb || "",
      state: m.state || "",
      postcode: m.postcode || "",
      heading: m.heading || "",
      description: m.description || "",
      features: (m.featureList || []).map(function (f) { return f.name; }),
      photos: photos,
      floorPlans: (m.floorPlans || []).map(function (p) { return p.fullSize; }),
      underContract: !!m.underContract,
      sold: !!m.sold,
      agents: m.salesPeople || [],
      lat: m.latitude,
      lng: m.longitude,
    };
  }

  /* ---- Formatting helpers ------------------------------------------------- */
  function formatPrice(l) {
    if (l.showPrice && l.price > 0) return "$" + Number(l.price).toLocaleString("en-AU");
    return l.displayPrice || "Contact Agent";
  }

  /* ---- Public API --------------------------------------------------------- */
  return {
    base: QMD_API_BASE,
    formatPrice: formatPrice,
    normalizeListing: normalizeListing,

    // Dropdown data for the Buy page.
    searchFields: function (listingType, state) {
      return getJSON("/api/search-fields", { listingType: listingType, state: state });
    },

    // Listings search. `params` is passed straight through to the Worker.
    listings: async function (params) {
      var data = await getJSON("/api/listings", params);
      var list = (data && data.listingList) || [];
      return {
        listings: list.map(normalizeListing),
        count: data && (data.listingCount != null ? data.listingCount : list.length),
        errors: (data && data.errors) || [],
      };
    },

    // Single listing (needs both propertyID and listingType).
    listing: async function (propertyID, listingType) {
      var data = await getJSON("/api/listings", { propertyID: propertyID, listingType: listingType });
      var list = (data && data.listingList) || [];
      return list.length ? normalizeListing(list[0]) : null;
    },

    viewCount: function (listingType, propertyID) {
      return postJSON("/api/view-count", { listingType: listingType, propertyID: propertyID });
    },

    projects: async function (params) {
      var data = await getJSON("/api/projects", params);
      return { projects: (data && data.projectList) || [], count: data && data.listingCount, errors: (data && data.errors) || [] };
    },

    enquiry: function (data) { return postJSON("/api/enquiries", data); },
    appraisal: function (data) { return postJSON("/api/appraisals", data); },
  };
})();

/* Split a single "Full Name" field into the first/last names Mantis expects. */
function qmdSplitName(full) {
  var parts = String(full || "").trim().split(/\s+/);
  var firstName = parts.shift() || "";
  var lastName = parts.join(" ") || firstName || "-";
  return { firstName: firstName, lastName: lastName };
}

if (typeof window !== "undefined") {
  window.QMDApi = QMDApi;
  window.qmdSplitName = qmdSplitName;
}
