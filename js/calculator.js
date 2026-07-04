/* =============================================================================
   QMD Property — Investment Calculator
   Cash-on-cash return, cap rate, and ROI.
   ========================================================================== */
(function () {
  "use strict";

  var form = document.getElementById("calc-form");
  if (!form) return;

  var inputs = {
    price: document.getElementById("c-price"),
    deposit: document.getElementById("c-deposit"),
    costs: document.getElementById("c-costs"),
    rate: document.getElementById("c-rate"),
    rent: document.getElementById("c-rent"),
    expenses: document.getElementById("c-expenses"),
    growth: document.getElementById("c-growth")
  };

  var out = {
    coc: document.getElementById("r-coc"),
    cap: document.getElementById("r-cap"),
    roi: document.getElementById("r-roi"),
    cashflow: document.getElementById("r-cashflow"),
    noi: document.getElementById("r-noi"),
    invested: document.getElementById("r-invested")
  };

  // mirror range slider value labels
  document.querySelectorAll("[data-mirror]").forEach(function (el) {
    var target = document.getElementById(el.getAttribute("data-mirror"));
    if (!target) return;
    var src = document.getElementById(el.getAttribute("data-mirror"));
    src.addEventListener("input", function () { el.textContent = src.value; });
  });

  function num(el) { return el && el.value !== "" ? Number(el.value) : 0; }
  function money(n) {
    return (n < 0 ? "-$" : "$") + Math.abs(Math.round(n)).toLocaleString("en-AU");
  }
  function pct(n) { return (isFinite(n) ? n.toFixed(2) : "0.00") + "%"; }

  function calculate() {
    var price = num(inputs.price);
    var depositPct = num(inputs.deposit);
    var closingPct = num(inputs.costs);
    var ratePct = num(inputs.rate);
    var weeklyRent = num(inputs.rent);
    var expPct = num(inputs.expenses);
    var growthPct = num(inputs.growth);

    var deposit = price * (depositPct / 100);
    var closing = price * (closingPct / 100);
    var loan = price - deposit;
    var totalInvested = deposit + closing;

    var annualRent = weeklyRent * 52;
    var operatingExpenses = annualRent * (expPct / 100);
    var noi = annualRent - operatingExpenses;               // net operating income
    var interest = loan * (ratePct / 100);                  // interest-only approximation
    var annualCashFlow = noi - interest;

    var capRate = price ? (noi / price) * 100 : 0;
    var cashOnCash = totalInvested ? (annualCashFlow / totalInvested) * 100 : 0;
    var appreciation = price * (growthPct / 100);
    var totalReturn = annualCashFlow + appreciation;
    var roi = totalInvested ? (totalReturn / totalInvested) * 100 : 0;

    if (out.coc) out.coc.textContent = pct(cashOnCash);
    if (out.cap) out.cap.textContent = pct(capRate);
    if (out.roi) out.roi.textContent = pct(roi);
    if (out.cashflow) out.cashflow.textContent = money(annualCashFlow) + "/yr";
    if (out.noi) out.noi.textContent = money(noi) + "/yr";
    if (out.invested) out.invested.textContent = money(totalInvested);
  }

  form.addEventListener("input", calculate);
  form.addEventListener("submit", function (e) { e.preventDefault(); calculate(); });
  calculate();
})();
