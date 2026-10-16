var WHATSAPP_NUMBER = "919735565533";

var menu = document.getElementById("menu");
var nav = document.getElementById("nav");
menu.addEventListener("click", function () {
  var open = nav.classList.toggle("open");
  menu.classList.toggle("open", open);
  menu.setAttribute("aria-expanded", open ? "true" : "false");
});
nav.querySelectorAll("a").forEach(function (a) {
  a.addEventListener("click", function () {
    nav.classList.remove("open");
    menu.classList.remove("open");
  });
});

var today = new Date();
function plus(n) {
  var d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}
var ci = document.getElementById("checkin");
var co = document.getElementById("checkout");
if (ci && co) {
  ci.value = plus(1);
  co.value = plus(2);
  ci.min = plus(0);
  co.min = plus(1);
  ci.addEventListener("change", function () {
    co.min = ci.value;
    if (co.value <= ci.value) co.value = plus(2);
  });
}

function bookingMessage(room) {
  var adults = document.getElementById("adults").value || "2";
  var children = document.getElementById("children").value || "0";
  var rooms = document.getElementById("roomsCount").value || "1";
  return [
    "Hello Hotel Nesstara, I would like to check availability.",
    room ? "Room: " + room : "",
    "Check-in: " + (ci ? ci.value : ""),
    "Check-out: " + (co ? co.value : ""),
    "Adults: " + adults,
    "Child below 8: " + children,
    "Rooms: " + rooms
  ].filter(Boolean).join("\n");
}
function openWhatsApp(text) {
  window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text), "_blank");
}

document.getElementById("booking").addEventListener("submit", function (e) {
  e.preventDefault();
  var adults = Number(document.getElementById("adults").value);
  var rooms = Number(document.getElementById("roomsCount").value);
  if (!ci.value || !co.value) {
    alert("Please fill in check-in and check-out.");
    return;
  }
  if (co.value <= ci.value) {
    alert("Check-out should be after check-in.");
    return;
  }
  if (!adults || adults < 1 || !rooms || rooms < 1) {
    alert("Adults and rooms must be at least 1.");
    return;
  }
  openWhatsApp(bookingMessage());
});
document.querySelectorAll("[data-room]").forEach(function (btn) {
  if (!btn.classList.contains("book")) return;
  btn.addEventListener("click", function () {
    openBook(btn.getAttribute("data-room"));
  });
});
document.getElementById("ctaBook").addEventListener("click", function (e) {
  e.preventDefault();
  openWhatsApp("Hello Hotel Nesstara, I would like to check availability.");
});
document.getElementById("waFloat").addEventListener("click", function (e) {
  e.preventDefault();
  openWhatsApp("Hello Hotel Nesstara, I have a booking enquiry.");
});
document.getElementById("year").textContent = new Date().getFullYear();

var heroSlides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
var heroIndex = 0;
function showHero(n) {
  heroIndex = (n + heroSlides.length) % heroSlides.length;
  heroSlides.forEach(function (slide, i) {
    slide.classList.toggle("active", i === heroIndex);
    var img = slide.querySelector("img");
    if (i === heroIndex) {
      img.style.animation = "none";
      void img.offsetWidth;
      img.style.animation = "";
    }
  });
}
document.getElementById("heroPrev").addEventListener("click", function () { showHero(heroIndex - 1); });
document.getElementById("heroNext").addEventListener("click", function () { showHero(heroIndex + 1); });
setInterval(function () { showHero(heroIndex + 1); }, 6500);
var heroTouch = 0;
document.getElementById("heroSlides").addEventListener("touchstart", function (e) {
  heroTouch = e.changedTouches[0].clientX;
}, { passive: true });
document.getElementById("heroSlides").addEventListener("touchend", function (e) {
  var dx = e.changedTouches[0].clientX - heroTouch;
  if (Math.abs(dx) > 40) showHero(heroIndex + (dx < 0 ? 1 : -1));
});

var ROOMS = {
  "Deluxe Room": {
    photos: ["assets/deluxe-1.jpg", "assets/deluxe-2.jpg", "assets/deluxe-3.jpg"],
    copy: "A calm room for two, with pines at the glass and tea waiting when you come in. Linen, oak, and a window that actually faces something.",
    amens: ["180 sq ft", "Pine view", "Queen bed", "32\" TV", "Wi-Fi", "Tea tray"]
  },
  "Super Deluxe Room": {
    photos: ["assets/super-1.jpg", "assets/super-2.jpg", "assets/super-3.jpg"],
    copy: "A wider bed and a window seat, with the valley filling up with cloud by late afternoon. Made for a slower Darjeeling morning.",
    amens: ["220 sq ft", "Valley view", "King bed", "40\" TV", "Window seat", "Wi-Fi"]
  },
  "Suite Room": {
    photos: ["assets/suite-1.jpg", "assets/suite-2.jpg", "assets/suite-3.jpg"],
    copy: "The long window room. Kanchenjunga on clear mornings, a chair and a quiet hour for when the peaks stay in the mist.",
    amens: ["350 sq ft", "Peak view", "King bed", "43\" TV", "Sitting area", "Bathtub"]
  },
  "Family Room": {
    photos: ["assets/family-1.jpg", "assets/family-2.jpg", "assets/family-3.jpg"],
    copy: "Room enough for four, with a sofa bed and space to unpack properly. Close to Mall Road, and quiet once the door is shut.",
    amens: ["420 sq ft", "Valley view", "King + sofa bed", "43\" TV", "Extra bedding", "Wi-Fi"]
  }
};

document.querySelectorAll("[data-carousel]").forEach(function (box) {
  var imgs = Array.prototype.slice.call(box.querySelectorAll("img"));
  var i = 0;
  function go(n) {
    i = (n + imgs.length) % imgs.length;
    imgs.forEach(function (img, idx) { img.classList.toggle("on", idx === i); });
  }
  box.querySelectorAll("[data-dir]").forEach(function (btn) {
    btn.addEventListener("click", function () { go(i + Number(btn.getAttribute("data-dir"))); });
  });
});

var bookModal = document.getElementById("bookModal");
var currentRoom = "Deluxe Room";

function openBook(name) {
  currentRoom = name || currentRoom;
  document.getElementById("bookRoomLabel").textContent = currentRoom;
  document.getElementById("bookPersons").value = 2;
  document.getElementById("bookRooms").value = 1;
  var bin = document.getElementById("bookIn");
  var bout = document.getElementById("bookOut");
  bin.value = plus(1);
  bout.value = plus(2);
  bin.min = plus(0);
  bout.min = plus(1);
  bookModal.classList.add("open");
}
document.getElementById("closeBook").addEventListener("click", function () { bookModal.classList.remove("open"); });
bookModal.addEventListener("click", function (e) { if (e.target === bookModal) bookModal.classList.remove("open"); });
document.getElementById("bookForm").addEventListener("submit", function (e) {
  e.preventDefault();
  var checkin = document.getElementById("bookIn").value;
  var checkout = document.getElementById("bookOut").value;
  var persons = document.getElementById("bookPersons").value;
  var rooms = document.getElementById("bookRooms").value;
  if (!checkin || !checkout || !persons || !rooms) {
    alert("Please fill in check-in, check-out, persons, and rooms.");
    return;
  }
  if (Number(persons) < 1 || Number(rooms) < 1) {
    alert("Persons and rooms must be at least 1.");
    return;
  }
  if (checkout <= checkin) {
    alert("Check-out should be after check-in.");
    return;
  }
  var text = [
    "Hello Hotel Nesstara, I would like to check availability.",
    "Room: " + currentRoom,
    "Check-in: " + checkin,
    "Check-out: " + checkout,
    "Persons: " + persons,
    "Rooms: " + rooms
  ].join("\n");
  openWhatsApp(text);
  bookModal.classList.remove("open");
});

var PACKAGES = {
  "2n": {
    title: "Darjeeling 2 Nights 3 Days",
    duration: "2 Nights / 3 Days",
    days: [
      ["Day 1: NJP / Siliguri / Bagdogra to Darjeeling", "Pick up from NJP, Siliguri or Bagdogra and drop to Darjeeling. On reaching, check in to the hotel and rest for the day. Enjoy the evening exploring Darjeeling Mall and the local markets. Lunch and dinner at the Darjeeling hotel. Overnight stay at Darjeeling."],
      ["Day 2: Darjeeling Local Sightseeing", "After breakfast, proceed for Darjeeling local sightseeing. Return to the hotel for lunch and rest for the day. Enjoy the evening exploring Darjeeling Mall and the local markets. Dinner at the Darjeeling hotel. Overnight stay at Darjeeling."],
      ["Day 3: Darjeeling to NJP / Siliguri / Bagdogra via Mirik", "After breakfast, check out from Darjeeling and drop to NJP, Siliguri or Bagdogra via Mirik sightseeing, if time permits."]
    ],
    sights: [
      ["Darjeeling sightseeing", ["Tiger Hill (after breakfast)", "Batasia Loop", "Ghoom Monastery", "Japanese Temple", "Peace Pagoda", "Zoo", "HMI", "Ropeway", "Tenzing Rock", "Lebong Tea Garden"]],
      ["Mirik sightseeing", ["Nepal border", "Pashupati Market", "Mirik Lake", "Mirik Tea Garden", "Gopal Dhara Tea Estate"]]
    ]
  },
  "3n": {
    title: "Darjeeling Offbeat 3 Nights 4 Days",
    duration: "3 Nights / 4 Days",
    days: [
      ["Day 1: NJP / Siliguri / Bagdogra to Sittong", "Pick up from NJP, Siliguri or Bagdogra and drop to Sittong. Visit Sittong sightseeing on the way. On reaching, check in to the Sittong hotel or homestay and rest for the day. Lunch, evening snacks and dinner at the Sittong homestay. Overnight stay at Sittong."],
      ["Day 2: Sittong to Darjeeling via sightseeing", "After breakfast, check out from Sittong and proceed for Lamahatta, Takdah and Tinchuley sightseeing. Reach Darjeeling by noon and check in to the hotel. Lunch, evening snacks and dinner at the Darjeeling hotel. Overnight stay at Darjeeling."],
      ["Day 3: Darjeeling Local Sightseeing", "After breakfast, proceed for Darjeeling local sightseeing. Lunch and dinner at the Darjeeling hotel. Overnight stay at Darjeeling."],
      ["Day 4: Darjeeling to NJP / Siliguri / Bagdogra via Mirik", "After breakfast, check out from Darjeeling and drop to NJP, Siliguri or Bagdogra via Mirik sightseeing, if time permits."]
    ],
    sights: [
      ["Darjeeling sightseeing", ["Tiger Hill (after breakfast)", "Batasia Loop", "Ghoom Monastery", "Japanese Temple", "Peace Pagoda", "Zoo", "HMI", "Ropeway", "Tenzing Rock", "Lebong Tea Garden"]],
      ["Lamahatta, Takdah and Tinchuley", ["Lamahatta Park", "Gumbadara View Point", "Lovers' Meet Point", "Peshok Tea Garden"]],
      ["Sittong sightseeing", ["Ahaldara View Point", "Jogighat Bridge", "Sittong Monastery", "Sittong Orange Orchard", "Latpanchar"]],
      ["Mirik sightseeing", ["Nepal border", "Pashupati Market", "Mirik Lake", "Mirik Tea Garden", "Gopal Dhara Tea Estate"]]
    ]
  },
  "4n": {
    title: "Darjeeling Offbeat 4 Nights 5 Days",
    duration: "4 Nights / 5 Days",
    days: [
      ["Day 1: NJP / Siliguri to Sittong", "Pick up from NJP Railway Station or Siliguri and transfer to Sittong. Enjoy Sittong sightseeing. Lunch and dinner at the Sittong homestay. Overnight stay at Sittong."],
      ["Day 2: Sittong to Takdah", "After breakfast, check out from the homestay and transfer to Takdah. En route, visit Lamahatta, Takdah and Tinchuley sightseeing. Lunch and dinner at the Takdah homestay. Overnight stay at Takdah."],
      ["Day 3: Takdah to Darjeeling", "After breakfast, check out from the homestay and transfer to Darjeeling. Visit Batasia Loop, Ghoom Monastery and Dali Monastery. Lunch and dinner at the Darjeeling hotel. Overnight stay at Darjeeling."],
      ["Day 4: Darjeeling Sightseeing", "After breakfast, enjoy Darjeeling local sightseeing: Tiger Hill, Peace Pagoda, Japanese Temple, Padmaja Naidu Himalayan Zoological Park, HMI, Tenzing Rock, Darjeeling Ropeway and Lebong Tea Garden. Lunch and dinner at the Darjeeling hotel. Overnight stay at Darjeeling."],
      ["Day 5: Darjeeling – Mirik – NJP / Siliguri drop", "After breakfast, check out from the hotel and proceed towards NJP or Siliguri via Mirik. En route, visit Mirik Lake, Mirik Tea Garden, Gopal Dhara Tea Estate, Simana View Point, the India–Nepal border and Pashupati Market, subject to border regulations and valid ID proof. Drop at NJP Railway Station or Siliguri."]
    ],
    sights: [
      ["Sittong sightseeing", ["Ahaldara View Point", "Jogighat Bridge", "Sittong Monastery", "Namthing Pokhri View Point", "Latpanchar Monastery"]],
      ["Lamahatta, Takdah and Tinchuley", ["Gumbadara View Point", "Lovers' Meet Point", "Peshok Tea Garden", "Lamahatta Eco Park"]],
      ["Darjeeling sightseeing", ["Tiger Hill", "Peace Pagoda", "Japanese Temple", "Zoo", "HMI", "Tenzing Rock", "Darjeeling Ropeway", "Lebong Tea Garden", "Batasia Loop", "Ghoom Monastery", "Dali Monastery"]],
      ["Mirik sightseeing", ["Mirik Lake", "Mirik Tea Garden", "Gopal Dhara Tea Estate", "Simana View Point", "India–Nepal Border", "Pashupati Market"]]
    ]
  },
  "5n": {
    title: "Darjeeling Offbeat 5 Nights 6 Days",
    duration: "5 Nights / 6 Days",
    days: [
      ["Day 1: NJP to Tinchuley via Kurseong", "Pick up from NJP Railway Station or Bagdogra Airport. Drive via the scenic hill town of Kurseong, with panoramic views of tea gardens and the Himalayan landscape. Reach Tinchuley and check in to the homestay. Spend the evening in the quiet surroundings. Overnight stay at Tinchuley."],
      ["Day 2: Tinchuley – Lamahatta – Takdah – Sonada", "After breakfast, explore Lamahatta Eco Park, Peshok Tea Garden and Lovers' Meet Point. Later, drive to Sonada and check in to the hotel or homestay. Overnight stay at Sonada."],
      ["Day 3: Sonada to Darjeeling", "After breakfast, visit Indreni Waterfall, Batasia Loop and Ghoom Monastery. Proceed to Darjeeling and check in to the hotel. Explore Chowrasta Mall Road in the evening, if time permits. Overnight stay at Darjeeling."],
      ["Day 4: Darjeeling Local Sightseeing", "Optional early morning visit to Tiger Hill for sunrise. After breakfast, visit HMI, Padmaja Naidu Himalayan Zoological Park, a tea garden, Japanese Temple and Peace Pagoda, and the ropeway if it is operating. Walk the local market and Mall Road. Overnight stay at Darjeeling."],
      ["Day 5: Darjeeling to Bijanbari via Jamuni", "After breakfast, drive to Bijanbari via the scenic Jamuni route, through valleys, tea gardens, rivers and mountain villages. Check in to the homestay and relax. Overnight stay at Bijanbari."],
      ["Day 6: Bijanbari – Mirik – NJP / Bagdogra drop", "After breakfast, check out from the homestay. Visit Mirik Lake and the surrounding viewpoints, with some leisure time before continuing. Drop at NJP Railway Station or Bagdogra Airport."]
    ],
    sights: [
      ["Tinchuley, Lamahatta and Takdah", ["Lamahatta Eco Park", "Peshok Tea Garden", "Lovers' Meet Point"]],
      ["Sonada to Darjeeling", ["Indreni Waterfall", "Batasia Loop", "Ghoom Monastery", "Chowrasta Mall Road"]],
      ["Darjeeling sightseeing", ["Tiger Hill sunrise (optional)", "HMI", "Padmaja Naidu Himalayan Zoological Park", "Tea Garden", "Japanese Temple", "Peace Pagoda", "Ropeway (optional)", "Local Market and Mall Road"]],
      ["Mirik sightseeing", ["Mirik Lake", "Surrounding viewpoints"]]
    ]
  }
};
var packageIncludes = ["Food (breakfast, lunch and dinner)", "Accommodation", "Private cab for sightseeing and transfer"];
var packageExcludes = ["Extra food", "Room heater", "Parking charges, entry fees, riding, activity charges and cab waiting charges"];
var childPolicy = "Below 5 years: no charges. Above 5 years: chargeable, with some discount applicable. Above 8 years: fully chargeable.";

function renderPackage(id) {
  var pkg = PACKAGES[id];
  if (!pkg) return;
  var days = pkg.days.map(function (d) {
    return "<div class=\"day\"><strong>" + d[0] + "</strong><p>" + d[1] + "</p></div>";
  }).join("");
  var sights = pkg.sights.map(function (s) {
    return "<div><strong>" + s[0] + "</strong><ul>" + s[1].map(function (item) { return "<li>" + item + "</li>"; }).join("") + "</ul></div>";
  }).join("");
  document.getElementById("packageBody").innerHTML =
    "<div class=\"package-body\">" +
      "<p class=\"duration\">" + pkg.duration + "</p>" +
      "<h3 id=\"packageTitle\">" + pkg.title + "</h3>" +
      days +
      "<div class=\"sight-grid\">" + sights + "</div>" +
      "<div class=\"package-notes\">" +
        "<div><strong>Package includes</strong><ul>" + packageIncludes.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul></div>" +
        "<div><strong>Package excludes</strong><ul>" + packageExcludes.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul></div>" +
      "</div>" +
      "<div class=\"child-policy\"><strong>Policy for children</strong><p>" + childPolicy + "</p></div>" +
      "<button class=\"book\" type=\"button\" id=\"bookPackage\">Book This Package</button>" +
    "</div>";
  document.getElementById("bookPackage").addEventListener("click", function () {
    openTourForm("package", pkg.title);
  });
}

var packageModal = document.getElementById("packageModal");
var tourFormModal = document.getElementById("tourFormModal");
var currentPackage = "";
var tourMode = "package";

function openTourForm(mode, name) {
  tourMode = mode;
  currentPackage = name || "";
  document.getElementById("tourFormTitle").textContent = mode === "custom" ? "Customized itinerary" : "Book this package";
  document.getElementById("tourFormLabel").textContent = mode === "custom" ? "Tell us the dates and places you have in mind." : currentPackage;
  document.getElementById("tourDestinationsWrap").classList.toggle("show", mode === "custom");
  document.getElementById("tourDestinations").required = mode === "custom";
  document.getElementById("tourAdults").value = 2;
  document.getElementById("tourChildren").value = 0;
  document.getElementById("tourRooms").value = 1;
  var start = document.getElementById("tourStart");
  var end = document.getElementById("tourEnd");
  start.value = plus(1);
  end.value = plus(3);
  start.min = plus(0);
  end.min = plus(1);
  packageModal.classList.remove("open");
  tourFormModal.classList.add("open");
}

document.querySelectorAll(".view-package").forEach(function (btn) {
  btn.addEventListener("click", function () {
    renderPackage(btn.getAttribute("data-package"));
    packageModal.classList.add("open");
  });
});
document.getElementById("customItinerary").addEventListener("click", function () { openTourForm("custom"); });
document.getElementById("closePackage").addEventListener("click", function () { packageModal.classList.remove("open"); });
document.getElementById("closeTourForm").addEventListener("click", function () { tourFormModal.classList.remove("open"); });
packageModal.addEventListener("click", function (e) { if (e.target === packageModal) packageModal.classList.remove("open"); });
tourFormModal.addEventListener("click", function (e) { if (e.target === tourFormModal) tourFormModal.classList.remove("open"); });
document.getElementById("tourForm").addEventListener("submit", function (e) {
  e.preventDefault();
  var start = document.getElementById("tourStart").value;
  var end = document.getElementById("tourEnd").value;
  var adults = document.getElementById("tourAdults").value;
  var children = document.getElementById("tourChildren").value;
  var rooms = document.getElementById("tourRooms").value;
  if (!start || !end || !adults || !rooms) {
    alert("Please fill in the dates, adults and rooms.");
    return;
  }
  if (end <= start) {
    alert("End date should be after the start date.");
    return;
  }
  if (Number(adults) < 1 || Number(rooms) < 1) {
    alert("Adults and rooms must be at least 1.");
    return;
  }
  var lines = [
    tourMode === "custom" ? "Hello Hotel Nesstara, I would like a customized itinerary." : "Hello Hotel Nesstara, I would like to book a tour package.",
    tourMode === "custom" ? "" : "Package: " + currentPackage,
    "Start date: " + start,
    "End date: " + end,
    "Adults: " + adults,
    "Child below 8: " + children,
    "Rooms: " + rooms
  ];
  if (tourMode === "custom") {
    var places = document.getElementById("tourDestinations").value.trim();
    if (!places) {
      alert("Please add the destinations you prefer.");
      return;
    }
    lines.push("Preferred destinations: " + places);
  }
  openWhatsApp(lines.filter(Boolean).join("\n"));
  tourFormModal.classList.remove("open");
});
