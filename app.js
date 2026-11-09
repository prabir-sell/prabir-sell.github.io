/* PRABIR.DEV v2 — app.js (external file).
   ROOT-CAUSE FIX: the old site kept its JavaScript inline and the demo()
   function returned a full HTML document as a template literal containing
   literal closing-tag strings. Chrome cut the inline script off at that
   point, so render() never ran. Here ALL logic lives in this external file
   and NO string in it contains a literal closing tag such as the ones that
   broke the old site. Demo previews are built with DOM nodes, not with a
   full HTML document string. */

/* ===== Google sign-in CONFIG =====
   Google OAuth client ID for PRABIR.DEV (Web application, authorised
   JavaScript origin https://prabir-sell.github.io). Reviews REQUIRE
   Google sign-in: nobody can post a review without authorising with
   their Google account, and the signed-in Google name is used for the
   review. NOTE: reviews are still stored in localStorage (this browser
   only) until a backend is added — sign-in verifies identity, it does
   not yet share reviews across devices. */
const GOOGLE_CLIENT_ID = "923578354054-o0p3c9tg7b15fg6maknogtvvrbmve7mb.apps.googleusercontent.com";
const WA_NUMBER = "918777824316";
const WA_BASE = "https://wa.me/" + WA_NUMBER;

/* ===== Data — copied exactly from the original site ===== */
const TEMPLATES = [
  {id:1, name:"Restaurant Website", price:999, cat:"Restaurant", col:"#e8590c", lay:0, head:"Fresh food, served warm", feat:["Online menu","Table booking form","Gallery","Opening hours","Map section"]},
  {id:2, name:"Hotel & Resort Website", price:1999, cat:"Travel", col:"#0b7285", lay:1, head:"Stay somewhere unforgettable", feat:["Room listings","Booking enquiry","Amenities","Gallery","Location map"]},
  {id:3, name:"Photography Website", price:799, cat:"Portfolio", col:"#adb5bd", lay:2, head:"Moments, framed", feat:["Masonry gallery","Packages","Booking form","About photographer"]},
  {id:4, name:"Personal Portfolio", price:499, cat:"Personal", col:"#7048e8", lay:3, head:"Hi, I design & build things", feat:["Projects","Skills","Resume link","Contact form"]},
  {id:5, name:"Coaching Centre", price:1499, cat:"Education", col:"#2f9e44", lay:0, head:"Learn. Practise. Succeed.", feat:["Courses","Batch timings","Faculty","Admission enquiry"]},
  {id:6, name:"School Website", price:1999, cat:"Education", col:"#1971c2", lay:1, head:"A place to grow", feat:["Notices","Admissions","Faculty","Gallery","Contact"]},
  {id:7, name:"Real Estate", price:1499, cat:"Business", col:"#c92a2a", lay:2, head:"Find the property that fits", feat:["Property listings","Filters","Enquiry form","Agent profile"]},
  {id:8, name:"Medical Clinic", price:999, cat:"Healthcare", col:"#0ca678", lay:3, head:"Care you can trust", feat:["Doctor profiles","Appointment form","Services","Timings"]},
  {id:9, name:"Gym & Fitness", price:799, cat:"Business", col:"#f03e3e", lay:0, head:"Train harder. Live better.", feat:["Memberships","Trainers","Class timetable","Join form"]},
  {id:10, name:"Beauty Salon", price:799, cat:"Business", col:"#d6336c", lay:1, head:"Look good, feel great", feat:["Services & rates","Gallery","Booking form","Offers"]},
  {id:11, name:"E-commerce", price:2999, cat:"Online Store", col:"#e67700", lay:2, head:"Shop the collection", feat:["Product grid","Cart (front-end)","Categories","WhatsApp checkout"]},
  {id:12, name:"Digital Agency", price:999, cat:"Professional", col:"#4263eb", lay:3, head:"We grow brands online", feat:["Services","Case studies","Team","Contact"]},
  {id:13, name:"Travel Agency", price:999, cat:"Travel", col:"#1098ad", lay:0, head:"Your next trip starts here", feat:["Tour packages","Destinations","Enquiry form","Gallery"]},
  {id:14, name:"Wedding Planner", price:799, cat:"Business", col:"#b5446e", lay:1, head:"Your day, perfectly planned", feat:["Packages","Gallery","Services","Enquiry form"]},
  {id:15, name:"Electronics Shop", price:999, cat:"Online Store", col:"#364fc7", lay:2, head:"Latest gadgets, best prices", feat:["Product showcase","Brands","Offers","Store location"]},
  {id:16, name:"Grocery Store", price:999, cat:"Online Store", col:"#37b24d", lay:3, head:"Fresh groceries, every day", feat:["Categories","Offers","Order on WhatsApp","Delivery areas"]},
  {id:17, name:"Xerox & Printing", price:499, cat:"Business", col:"#495057", lay:0, head:"Print. Copy. Done.", feat:["Services & rates","Upload & order","Timings","Location"]},
  {id:18, name:"Lawyer Portfolio", price:799, cat:"Professional", col:"#8a6d3b", lay:1, head:"Clear advice. Strong representation.", feat:["Practice areas","Attorney profile","Consultation form","Contact"]},
  {id:19, name:"Event Management", price:999, cat:"Business", col:"#9c36b5", lay:2, head:"Events people remember", feat:["Event types","Gallery","Packages","Enquiry form"]},
  {id:20, name:"Digital Visiting Card", price:299, cat:"Personal", col:"#ff7a18", lay:3, head:"Your business card, online", feat:["One-page profile","Save contact","Social links","WhatsApp button"]}
];
const FEATURED_IDS = [1, 5, 11, 12, 20];
const CATS = ["Business","Restaurant","Education","Healthcare","Portfolio","Professional","Online Store","Travel","Personal"];
const PLANS = [
  {name:"Basic", price:199, updates:2, feat:["Image updates","Text updates","Contact changes","Small content updates"]},
  {name:"Standard", price:399, updates:5, feat:["All Basic features","Product updates","Service updates","Priority support"]},
  {name:"Premium", price:799, updates:12, feat:["All Standard features","Small design adjustments","Priority support","Monthly maintenance report"]}
];
const WHY = ["Affordable Pricing","Professional Designs","White-Label Websites","Complete Source Code","Mobile Responsive","Free Hosting Option","Optional Maintenance","Direct WhatsApp Support"];
const HOW = ["Choose Your Website","View Live Demo","Message PRABIR.DEV","Complete UPI Payment","Website Customization","Receive Your Website"];
const FAQS = [
  ["Is website purchase one-time?","Yes. Website purchase is a one-time payment."],
  ["Is maintenance compulsory?","No. Maintenance is optional."],
  ["Can I use my own domain?","Yes."],
  ["Will I receive source code?","Yes."],
  ["Can I use my own branding?","Yes. All websites are White-Label."],
  ["Is free hosting available?","Yes. Eligible static websites can use GitHub Pages."],
  ["What happens if maintenance expires?","Your website remains yours and remains accessible as long as hosting is active."]
];
/* No seeded reviews: only genuine reviews posted by visitors who signed
   in with Google are shown. Never invent reviews from real-sounding
   people — a fake review shown as real would mislead buyers. */
const SAMPLE_REVIEWS = [];

/* ===== Helpers (DOM only — no HTML strings with closing tags) ===== */
function $(s){ return document.querySelector(s); }
function el(tag, cls, text){
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined && text !== null) n.textContent = text;
  return n;
}
function inr(n){ return "\u20B9" + Number(n).toLocaleString("en-IN"); }
function waLink(msg){ return WA_BASE + "?text=" + encodeURIComponent(msg); }
function payMessage(t){
  return "Hello PRABIR.DEV! I want to pay for " + t.name + " \u2013 " + inr(t.price) + ". Please share payment details.";
}
function byId(id){ return TEMPLATES.find(function(t){ return t.id === id; }); }
function stars(n){
  let s = "";
  for (let i = 0; i < 5; i++) s += (i < n) ? "\u2605" : "\u2606";
  return s;
}
function clear(node){ while (node.firstChild) node.removeChild(node.firstChild); }

/* ===== Template cards ===== */
function makeCard(t){
  const card = el("article", "card");
  const thumb = el("div", "thumb");
  thumb.style.background = "linear-gradient(135deg," + t.col + ",#111)";
  const tag = el("span", "tag", t.cat);
  thumb.appendChild(tag);
  const nameInThumb = el("span", null, " " + t.name);
  thumb.appendChild(nameInThumb);
  card.appendChild(thumb);
  const body = el("div", "cardbody");
  const h = el("h3", null, t.name);
  body.appendChild(h);
  if (FEATURED_IDS.indexOf(t.id) !== -1){
    body.appendChild(el("span", "feat-badge", "FEATURED"));
  }
  body.appendChild(el("p", "feat", t.head + " — " + t.feat.slice(0, 3).join(" · ")));
  const price = el("p", "price", inr(t.price) + " ");
  price.appendChild(el("small", null, "one-time"));
  body.appendChild(price);
  const row = el("div", "btnrow");
  const demoBtn = el("a", "btn small ghost", "Live Demo");
  demoBtn.href = "#/product/" + t.id;
  const buyBtn = el("a", "btn small green", "Buy Now");
  buyBtn.href = "#/product/" + t.id;
  const detBtn = el("a", "btn small", "Details");
  detBtn.href = "#/product/" + t.id;
  row.appendChild(demoBtn); row.appendChild(buyBtn); row.appendChild(detBtn);
  body.appendChild(row);
  card.appendChild(body);
  return card;
}

let currentCat = "";
function renderGrid(){
  const grid = $("#productGrid");
  const q = $("#searchQ").value.trim().toLowerCase();
  const cat = $("#catFilter").value;
  const sort = $("#priceSort").value;
  let list = TEMPLATES.slice();
  if (q) list = list.filter(function(t){ return (t.name + " " + t.cat + " " + t.feat.join(" ")).toLowerCase().indexOf(q) !== -1; });
  if (cat) list = list.filter(function(t){ return t.cat === cat; });
  if (sort === "a") list.sort(function(a,b){ return a.price - b.price; });
  if (sort === "h") list.sort(function(a,b){ return b.price - a.price; });
  if (sort === "n") list.sort(function(a,b){ return b.id - a.id; });
  clear(grid);
  list.forEach(function(t){ grid.appendChild(makeCard(t)); });
  $("#productCount").textContent = list.length + " website" + (list.length === 1 ? "" : "s") + " shown";
}
function renderPills(){
  const wrap = $("#catPills");
  clear(wrap);
  const all = el("button", "pill" + (currentCat === "" ? " active" : ""), "All");
  all.type = "button";
  all.addEventListener("click", function(){ currentCat = ""; $("#catFilter").value = ""; renderPills(); renderGrid(); });
  wrap.appendChild(all);
  CATS.forEach(function(c){
    const b = el("button", "pill" + (currentCat === c ? " active" : ""), c);
    b.type = "button";
    b.addEventListener("click", function(){ currentCat = c; $("#catFilter").value = c; renderPills(); renderGrid(); });
    wrap.appendChild(b);
  });
}

/* ===== Product detail + live demo preview (DOM only) ===== */
function buildDemo(t){
  const demo = el("div", "demo");
  const nav = el("div", "demo-nav");
  nav.appendChild(el("b", null, "Your Brand"));
  const navSpan = el("span", null, "Home · Features · Contact");
  nav.appendChild(navSpan);
  demo.appendChild(nav);
  const hero = el("div", "demo-hero");
  hero.style.background = "linear-gradient(135deg," + t.col + ",#222)";
  hero.appendChild(el("h3", null, t.head));
  hero.appendChild(el("p", null, "Replace this text with your own business description."));
  demo.appendChild(hero);
  const feats = el("div", "demo-feats");
  t.feat.forEach(function(f, i){
    const box = el("div");
    box.appendChild(el("b", null, (i + 1) + ". " + f));
    box.appendChild(el("p", null, "Fully editable section for your " + t.name.toLowerCase() + "."));
    feats.appendChild(box);
  });
  demo.appendChild(feats);
  const foot = el("div", "demo-feats");
  const fb = el("div");
  fb.appendChild(el("b", null, "Get in touch"));
  fb.appendChild(el("p", null, "Contact form, phone and WhatsApp button included."));
  foot.appendChild(fb);
  demo.appendChild(foot);
  return demo;
}

function renderDetail(id){
  const box = $("#detailBox");
  clear(box);
  const t = byId(id);
  if (!t){
    box.appendChild(el("p", "sub", "Product not found."));
    const back = el("a", "btn", "Back to Product");
    back.href = "#/buy";
    box.appendChild(back);
    return;
  }
  const back = el("a", "btn ghost small", "← Back to Product");
  back.href = "#/buy";
  box.appendChild(back);
  const wrap = el("div", "detail");
  wrap.style.marginTop = "16px";
  const left = el("div");
  left.appendChild(buildDemo(t));
  const right = el("div");
  const info = el("div", "card");
  info.appendChild(el("span", "tag", t.cat));
  info.appendChild(el("h2", null, t.name));
  info.appendChild(el("p", "sub", t.head));
  const price = el("p", "price", inr(t.price) + " ");
  price.appendChild(el("small", null, "one-time"));
  info.appendChild(price);
  const ul = el("ul", "check");
  t.feat.forEach(function(f){ const li = el("li", null, f); ul.appendChild(li); });
  ul.appendChild(el("li", null, "White-label · full source code · README + ZIP"));
  info.appendChild(ul);
  right.appendChild(info);
  const pay = el("div", "paybox");
  pay.style.marginTop = "14px";
  pay.appendChild(el("h3", null, "Payment — Buy " + t.name));
  pay.appendChild(el("p", null, "Pay " + inr(t.price) + " for " + t.name + ". Payment is manual UPI — never auto-confirmed. Message us on WhatsApp and we will share the UPI payment details and confirm your order."));
  const waBtn = el("a", "btn green", "Message PRABIR.DEV on WhatsApp");
  waBtn.href = waLink(payMessage(t));
  waBtn.target = "_blank";
  waBtn.rel = "noopener";
  pay.appendChild(waBtn);
  const note = el("p", "note", "Payment is manual UPI — never auto-confirmed. Your website is delivered after we confirm the payment on WhatsApp.");
  pay.appendChild(note);
  right.appendChild(pay);
  wrap.appendChild(left);
  wrap.appendChild(right);
  box.appendChild(wrap);
}

/* ===== Static sections ===== */
function renderHome(){
  const fr = $("#featuredRow");
  clear(fr);
  FEATURED_IDS.forEach(function(id){ fr.appendChild(makeCard(byId(id))); });
  const why = $("#whyGrid");
  clear(why);
  WHY.forEach(function(w){
    const c = el("div", "card");
    c.appendChild(el("b", null, "✓ " + w));
    why.appendChild(c);
  });
  const how = $("#howSteps");
  clear(how);
  HOW.forEach(function(s, i){
    const c = el("div", "card");
    const n = el("div", "num", String(i + 1));
    c.appendChild(n);
    c.appendChild(el("b", null, s));
    how.appendChild(c);
  });
  const faq = $("#faqList");
  clear(faq);
  FAQS.forEach(function(f){
    const d = document.createElement("details");
    const s = document.createElement("summary");
    s.textContent = f[0];
    const p = document.createElement("p");
    p.textContent = f[1];
    d.appendChild(s); d.appendChild(p);
    faq.appendChild(d);
  });
}
function renderPricing(){
  const tblWrap = $("#priceTable");
  clear(tblWrap);
  const table = document.createElement("table");
  table.style.width = "100%";
  const thead = document.createElement("thead");
  const hr = document.createElement("tr");
  ["Website","Category","Price"].forEach(function(h){
    const th = document.createElement("th");
    th.textContent = h;
    th.style.textAlign = "left";
    th.style.padding = "8px";
    hr.appendChild(th);
  });
  thead.appendChild(hr);
  table.appendChild(thead);
  const tbody = document.createElement("tbody");
  TEMPLATES.forEach(function(t){
    const tr = document.createElement("tr");
    [t.name, t.cat, inr(t.price)].forEach(function(v){
      const td = document.createElement("td");
      td.textContent = v;
      td.style.padding = "8px";
      td.style.borderTop = "1px solid var(--line)";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  tblWrap.appendChild(table);
  const pg = $("#planGrid");
  clear(pg);
  PLANS.forEach(function(p, i){
    const c = el("div", "card");
    c.appendChild(el("h3", null, p.name.toUpperCase()));
    const pr = el("p", "price", inr(p.price) + " ");
    pr.appendChild(el("small", null, "/ month"));
    c.appendChild(pr);
    c.appendChild(el("b", null, p.updates + " updates monthly"));
    const ul = el("ul", "check");
    p.feat.forEach(function(f){ ul.appendChild(el("li", null, f)); });
    c.appendChild(ul);
    const b = el("a", "btn small green", "Choose " + p.name);
    b.href = waLink("Hello PRABIR.DEV! I want the " + p.name + " maintenance plan (" + inr(p.price) + "/month). Please share payment details.");
    b.target = "_blank";
    b.rel = "noopener";
    c.appendChild(b);
    if (i === 1) c.style.borderColor = "var(--blurple)";
    pg.appendChild(c);
  });
}

/* ===== Reviews (local demo until Google sign-in is connected) ===== */
const REVIEW_KEY = "pdv2_reviews";
let signedInName = "";
let googleSignedIn = false;
function loadReviews(){
  try {
    const saved = JSON.parse(localStorage.getItem(REVIEW_KEY) || "[]");
    if (Array.isArray(saved) && saved.length) return saved;
  } catch (e) {}
  return [];
}
function saveReviews(list){
  try { localStorage.setItem(REVIEW_KEY, JSON.stringify(list)); } catch (e) {}
}
function renderReviews(){
  const list = loadReviews();
  const wrap = $("#reviewList");
  clear(wrap);
  const avg = list.length ? (list.reduce(function(s, r){ return s + r.stars; }, 0) / list.length).toFixed(1) : "—";
  $("#reviewCount").textContent = list.length + " reviews · average " + avg + " / 5 stars";
  if (!list.length){
    wrap.appendChild(el("p", "sub", "No reviews yet — sign in with Google and be the first to review PRABIR.DEV!"));
    return;
  }
  list.forEach(function(r){
    const card = el("div", "review");
    const head = el("div", "rhead");
    head.appendChild(el("b", null, r.name));
    head.appendChild(el("span", "stars", stars(r.stars)));
    head.appendChild(el("small", null, r.date || ""));
    if (r.sample) head.appendChild(el("span", "sample-tag", "SAMPLE"));
    card.appendChild(head);
    card.appendChild(el("p", null, r.text));
    wrap.appendChild(card);
  });
}
function initGoogle(){
  const btn = $("#gsiButton");
  btn.addEventListener("click", function(){
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === "YOUR_GOOGLE_CLIENT_ID_HERE"){
      $("#gsiNote").textContent = "Google sign-in is not connected yet — the site owner must add a Google OAuth client ID (see the CONFIG comment at the top of app.js). You can still post a review below with your name; it is stored locally in this demo.";
      return;
    }
    try {
      if (window.google && window.google.accounts && window.google.accounts.id){
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: function(resp){
            googleSignedIn = true;
            signedInName = "Google user";
            $("#signedInAs").textContent = "Signed in with Google.";
            $("#gsiNote").textContent = "Signed in with Google. Your review will be posted under your Google name.";
            try {
              const payload = JSON.parse(atob(resp.credential.split(".")[1]));
              if (payload && payload.name){
                signedInName = payload.name;
                $("#revName").value = payload.name;
                $("#revName").readOnly = true;
                $("#signedInAs").textContent = "Signed in as " + payload.name + ".";
              }
            } catch (e) {}
          }
        });
        window.google.accounts.id.prompt();
      } else {
        $("#gsiNote").textContent = "Google sign-in script did not load. Check your connection and try again.";
      }
    } catch (e) {
      $("#gsiNote").textContent = "Google sign-in could not start: " + e.message;
    }
  });
}

/* ===== Router ===== */
const ROUTES = {
  "#/home": ["view-home", "home"],
  "#/buy": ["view-buy", "buy-here"],
  "#/product": ["view-buy", "product"],
  "#/pricing": ["view-pricing", "pricing"],
  "#/reviews": ["view-reviews", "reviews"],
  "#/contact": ["view-contact", "contact"]
};
function route(){
  const hash = window.location.hash || "#/home";
  let viewId = "view-home", title = "home";
  if (hash.indexOf("#/product/") === 0){
    viewId = "view-product"; title = "product";
    renderDetail(parseInt(hash.split("/")[2], 10));
  } else if (ROUTES[hash]){
    viewId = ROUTES[hash][0]; title = ROUTES[hash][1];
    if (viewId === "view-buy") renderGrid();
  } else {
    viewId = "view-home"; title = "home";
  }
  document.querySelectorAll(".view").forEach(function(v){ v.classList.toggle("on", v.id === viewId); });
  document.querySelectorAll(".chan").forEach(function(c){
    c.classList.toggle("active", c.getAttribute("data-route") === "#/" + title || (title === "product" && c.getAttribute("data-route") === "#/product"));
  });
  $("#topTitle").textContent = title;
  window.scrollTo(0, 0);
}

/* ===== Init — every id read here exists in index.html ===== */
function init(){
  document.querySelectorAll(".yr").forEach(function(n){ n.textContent = String(new Date().getFullYear()); });
  document.querySelectorAll("[data-route]").forEach(function(n){
    n.addEventListener("click", function(){ window.location.hash = n.getAttribute("data-route"); });
  });
  const catSel = $("#catFilter");
  const optAll = document.createElement("option");
  optAll.value = ""; optAll.textContent = "All categories";
  catSel.appendChild(optAll);
  CATS.forEach(function(c){
    const o = document.createElement("option");
    o.value = c; o.textContent = c;
    catSel.appendChild(o);
  });
  renderPills();
  $("#searchQ").addEventListener("input", renderGrid);
  $("#catFilter").addEventListener("change", function(){ currentCat = $("#catFilter").value; renderPills(); renderGrid(); });
  $("#priceSort").addEventListener("change", renderGrid);
  $("#pillProduct").addEventListener("click", function(){ $("#pillProduct").classList.add("active"); $("#pillPricing").classList.remove("active"); });
  $("#pillPricing").addEventListener("click", function(){
    $("#pillPricing").classList.add("active"); $("#pillProduct").classList.remove("active");
    window.location.hash = "#/pricing";
  });
  renderHome();
  renderPricing();
  renderReviews();
  renderGrid();
  $("#reviewForm").addEventListener("submit", function(e){
    e.preventDefault();
    if (!googleSignedIn){
      $("#gsiNote").textContent = "Please sign in with Google first — a review can only be posted after Google authorisation. Tap 'Sign in with Google' above.";
      $("#gsiButton").click();
      return;
    }
    const name = signedInName || $("#revName").value.trim();
    const text = $("#revText").value.trim();
    if (!name || !text) return;
    const list = loadReviews();
    list.unshift({name: name, stars: parseInt($("#revStars").value, 10), text: text, date: new Date().toISOString().slice(0, 10), sample: false});
    saveReviews(list);
    renderReviews();
    $("#revText").value = "";
    $("#gsiNote").textContent = "Thanks, " + name + "! Your review is posted under your Google name. (Stored in this browser for now — shared public reviews need a backend.)";
  });
  initGoogle();
  window.addEventListener("hashchange", route);
  route();
}
document.addEventListener("DOMContentLoaded", init);
