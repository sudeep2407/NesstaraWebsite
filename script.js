var WHATSAPP_NUMBER = "919735565533";

var menu = document.getElementById("menu");
var nav = document.getElementById("nav");
menu.addEventListener("click", function () {
  var open = nav.classList.toggle("open");
  menu.classList.toggle("open", open);
  menu.setAttribute("aria-expanded", open ? "true" : "false");
  document.body.style.overflow = open ? "hidden" : "";
});
nav.querySelectorAll("a").forEach(function (a) {
  a.addEventListener("click", function () {
    nav.classList.remove("open");
    menu.classList.remove("open");
    document.body.style.overflow = "";
  });
});
document.addEventListener("click", function (e) {
  if (!nav.classList.contains("open")) return;
  if (nav.contains(e.target) || menu.contains(e.target)) return;
  nav.classList.remove("open");
  menu.classList.remove("open");
  document.body.style.overflow = "";
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
  document.getElementById("bookAdults").value = 2;
  document.getElementById("bookChildren").value = 0;
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
  var adults = document.getElementById("bookAdults").value;
  var children = document.getElementById("bookChildren").value;
  var rooms = document.getElementById("bookRooms").value;
  if (!checkin || !checkout || adults === "" || children === "" || !rooms) {
    alert("Please fill in check-in, check-out, adults, children, and rooms.");
    return;
  }
  if (Number(adults) < 1 || Number(rooms) < 1) {
    alert("Adults and rooms must be at least 1.");
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
    "Adults: " + adults,
    "Child below 8: " + children,
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
      {
        title: "Day 1 | NJP / Siliguri / Bagdogra to Darjeeling",
        text: "Pick up from NJP, Siliguri or Bagdogra and drop to Darjeeling. On reaching, check in to the hotel and rest for the day. Enjoy the evening exploring Darjeeling Mall and the local markets. Lunch and dinner at the Darjeeling hotel.",
        stay: "Night stay at Darjeeling"
      },
      {
        title: "Day 2 | Darjeeling Local Sightseeing",
        text: "After breakfast, proceed for Darjeeling local sightseeing. Return to the hotel for lunch and rest for the day. Enjoy the evening exploring Darjeeling Mall and the local markets. Dinner at the Darjeeling hotel.",
        label: "Darjeeling sightseeing",
        stops: ["Batasia Loop", "Ghoom Monastery", "Japanese Temple", "Peace Pagoda", "Zoo", "HMI", "Ropeway", "Tenzing Rock", "Lebong Tea Garden"],
        stay: "Night stay at Darjeeling"
      },
      {
        title: "Day 3 | Darjeeling to NJP / Siliguri / Bagdogra via Mirik",
        text: "After breakfast, check out from Darjeeling and drop to NJP, Siliguri or Bagdogra via Mirik sightseeing, if time permits.",
        label: "Mirik sightseeing",
        stops: ["Nepal Border", "Pashupati Market", "Mirik Lake", "Mirik Tea Garden", "Gopal Dhara Tea Estate"]
      }
    ]
  },
  "3n": {
    title: "Darjeeling and Darjeeling Offbeat 3 Nights 4 Days",
    duration: "3 Nights / 4 Days",
    days: [
      {
        title: "Day 1 | NJP / Siliguri / Bagdogra to Sittong",
        text: "Pick up from NJP, Siliguri or Bagdogra and drop to Sittong. Visit Sittong sightseeing on the way. On reaching, check in to the Sittong hotel or homestay and rest for the day. Lunch, evening snacks and dinner at the Sittong homestay.",
        label: "Sittong sightseeing",
        stops: ["Ahaldara View Point", "Jogighat Bridge", "Sittong Monastery", "Sittong Orange Orchard", "Latpanchar"],
        stay: "Night stay at Sittong"
      },
      {
        title: "Day 2 | Sittong to Darjeeling via Offbeat Sightseeing",
        text: "After breakfast, check out from Sittong and proceed for Darjeeling offbeat sightseeing. Reach Darjeeling by noon and check in to the hotel. Lunch, evening snacks and dinner at the Darjeeling hotel.",
        label: "Darjeeling offbeat sightseeing",
        stops: ["Lamahatta Park", "Gumbadara View Point", "Lover's Meet Point", "Peshok Tea Garden"],
        stay: "Night stay at Darjeeling"
      },
      {
        title: "Day 3 | Darjeeling Local Sightseeing",
        text: "After breakfast, proceed for Darjeeling local sightseeing. Lunch and dinner at the Darjeeling hotel.",
        label: "Darjeeling local sightseeing",
        stops: ["Batasia Loop", "Ghoom Monastery", "Japanese Temple", "Peace Pagoda", "Zoo", "HMI", "Ropeway", "Tenzing Rock", "Lebong Tea Garden"],
        stay: "Night stay at Darjeeling"
      },
      {
        title: "Day 4 | Darjeeling to NJP / Siliguri / Bagdogra via Mirik",
        text: "After breakfast, check out from Darjeeling and drop to NJP, Siliguri or Bagdogra via Mirik sightseeing, if time permits.",
        label: "Mirik sightseeing",
        stops: ["Nepal Border", "Pashupati Market", "Mirik Lake", "Mirik Tea Garden", "Gopal Dhara Tea Estate"]
      }
    ],
    extraExclude: ["Tiger Hill sightseeing"]
  },
  "4n": {
    title: "Darjeeling & Darjeeling Offbeat 4 Nights 5 Days",
    duration: "4 Nights / 5 Days",
    days: [
      {
        title: "Day 1 | NJP / Siliguri → Sittong",
        text: "Pick up from NJP or Siliguri and drop to Sittong. Visit Sittong sightseeing on the way. On reaching, check in to the Sittong hotel or homestay and rest for the day. Lunch, evening snacks and dinner at the Sittong homestay.",
        label: "Sittong sightseeing",
        stops: ["Ahaldhara View Point", "Namthing Pokhri", "Lathpanchar Monastery"],
        stay: "Night stay at Sittong"
      },
      {
        title: "Day 2 | Sittong → Darjeeling",
        text: "After breakfast, check out from Sittong and proceed for Kurseong sightseeing. Reach Darjeeling by noon and check in to the hotel. Lunch, evening snacks and dinner at the Darjeeling hotel.",
        label: "Kurseong sightseeing",
        stops: ["Kurseong Road", "Maldhiram Tea Garden", "Hanuman Tok", "Dowhill Sightseeing"],
        stay: "Night stay at Darjeeling"
      },
      {
        title: "Day 3 | Darjeeling Local Sightseeing",
        text: "After breakfast, proceed for Darjeeling local sightseeing. Lunch and dinner at the Darjeeling hotel.",
        label: "Darjeeling local sightseeing",
        stops: ["Batasia Loop", "Ghum Monastery", "Japanese Temple", "Peace Pagoda", "Zoo & HMI", "Tenzing Rock", "Ropeway (optional)", "Tea Garden"],
        stay: "Night stay at Darjeeling"
      },
      {
        title: "Day 4 | Darjeeling → Lepchajagat",
        text: "After breakfast, check out from the Darjeeling hotel and proceed for Darjeeling offbeat sightseeing. Reach Lepchajagat by noon and check in to the Lepchajagat hotel. Lunch and dinner at the Lepchajagat hotel.",
        label: "Darjeeling offbeat sightseeing",
        stops: ["Lamahatta Eco Park", "Gumbadara View Point", "Peshok Tea Garden"],
        stay: "Night stay at Lepchajagat"
      },
      {
        title: "Day 5 | Lepchajagat → NJP / Siliguri",
        text: "After breakfast, check out from Lepchajagat and drop to NJP or Siliguri via Mirik sightseeing.",
        label: "Mirik sightseeing",
        stops: ["Mirik Lake", "Gopaldhara Tea Garden", "Pashupati Market", "Nepal Border", "Simana View Point"]
      }
    ],
    extraExclude: ["Rock Garden & Ganga Maiya Park", "Tiger Hill sightseeing"]
  },
  "5n": {
    title: "Darjeeling Offbeat 5 Nights 6 Days",
    duration: "5 Nights / 6 Days",
    days: [
      {
        title: "Day 1 | NJP / Siliguri → Sittong",
        text: "Pick up from NJP or Siliguri and drop to Sittong. Visit Sittong sightseeing on the way. On reaching, check in to the Sittong hotel or homestay and rest for the day. Lunch, evening snacks and dinner at the Sittong homestay.",
        label: "Sittong sightseeing",
        stops: ["Ahaldhara View Point", "Namthing Pokhri", "Lathpanchar Monastery"],
        stay: "Night stay at Sittong"
      },
      {
        title: "Day 2 | Sittong → Dawaipani",
        text: "After breakfast, check out from Sittong and proceed for Kurseong sightseeing. Reach Dawaipani by noon and check in to the hotel. Lunch, evening snacks and dinner at the Dawaipani hotel.",
        label: "Kurseong sightseeing",
        stops: ["Kurseong Road", "Maldhiram Tea Garden", "Hanuman Tok", "Dowhill Sightseeing"],
        stay: "Night stay at Dawaipani"
      },
      {
        title: "Day 3 | Dawaipani → Darjeeling",
        text: "After breakfast, check out from Dawaipani and proceed for Darjeeling offbeat sightseeing. Reach Darjeeling by noon and check in to the hotel. Lunch, evening snacks and dinner at the Darjeeling hotel.",
        label: "Darjeeling offbeat sightseeing",
        stops: ["Lamahatta Eco Park", "Gumbadara View Point", "Peshok Tea Garden", "Lover's Meet View Point"],
        stay: "Night stay at Darjeeling"
      },
      {
        title: "Day 4 | Darjeeling Local Sightseeing",
        text: "After breakfast, proceed for Darjeeling local sightseeing. Lunch and dinner at the Darjeeling hotel.",
        label: "Darjeeling local sightseeing",
        stops: ["Batasia Loop", "Ghum Monastery", "Japanese Temple", "Peace Pagoda", "Zoo & HMI", "Tenzing Rock", "Ropeway (optional)", "Tea Garden"],
        stay: "Night stay at Darjeeling"
      },
      {
        title: "Day 5 | Darjeeling → Lepchajagat",
        text: "After breakfast, check out from the Darjeeling hotel and proceed for Darjeeling local sightseeing. Reach Lepchajagat by noon and check in to the Lepchajagat hotel. Lunch and dinner at the Lepchajagat hotel.",
        label: "Darjeeling local sightseeing",
        stops: ["Dali Monastery", "Rock Garden", "Ganga Maiya Park"],
        stay: "Night stay at Lepchajagat"
      },
      {
        title: "Day 6 | Lepchajagat → NJP / Siliguri",
        text: "After breakfast, check out from Lepchajagat and drop to NJP or Siliguri via Mirik sightseeing.",
        label: "Mirik sightseeing",
        stops: ["Mirik Lake", "Gopaldhara Tea Garden", "Pashupati Market", "Nepal Border", "Simana View Point"]
      }
    ],
    extraExclude: ["Tiger Hill sightseeing"]
  }
};
var packageIncludes = ["Food (breakfast, lunch and dinner)", "Accommodation", "Private cab for sightseeing and transfer"];
var packageExcludes = ["Extra food", "Room heater", "Parking charges, entry fees, riding, activity charges and cab waiting charges"];
var childPolicy = "Below 5 years: no charges. Above 5 years: chargeable, with some discount applicable. Above 8 years: fully chargeable.";

var calendarIcon = "<svg viewBox=\"0 0 24 24\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M3 10h18M8 3v4M16 3v4\"/></svg>";
var pinIcon = "<svg viewBox=\"0 0 24 24\"><path d=\"M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z\"/><circle cx=\"12\" cy=\"10\" r=\"2.2\"/></svg>";
function renderPackage(id) {
  var pkg = PACKAGES[id];
  if (!pkg) return;
  var days = pkg.days.map(function (d) {
    var stops = d.stops
      ? "<div class=\"day-sights\"><strong>" + (d.label || "Sightseeing") + "</strong><ul>" + d.stops.map(function (item) { return "<li>" + item + "</li>"; }).join("") + "</ul></div>"
      : "";
    var stay = d.stay ? "<p class=\"night-stay\">" + pinIcon + d.stay + "</p>" : "";
    return "<div class=\"day\"><div class=\"day-head\">" + calendarIcon + "<strong>" + d.title + "</strong></div><p>" + d.text + "</p>" + stops + stay + "</div>";
  }).join("");
  var excludes = packageExcludes.concat(pkg.extraExclude || []);
  document.getElementById("packageBody").innerHTML =
    "<div class=\"package-body\">" +
      "<p class=\"duration\">" + pkg.duration + "</p>" +
      "<h3 id=\"packageTitle\">" + pkg.title + "</h3>" +
      days +
      "<div class=\"package-notes\">" +
        "<div><strong>Package includes</strong><ul>" + packageIncludes.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul></div>" +
        "<div><strong>Package excludes</strong><ul>" + excludes.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul></div>" +
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
  document.getElementById("tourCabWrap").classList.toggle("show", mode === "custom");
  document.getElementById("tourCab").required = mode === "custom";
  document.getElementById("tourCab").value = "";
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
    var cab = document.getElementById("tourCab").value;
    if (!places) {
      alert("Please add the destinations you prefer.");
      return;
    }
    if (!cab) {
      alert("Please select a cab type.");
      return;
    }
    lines.push("Cab type: " + cab);
    lines.push("Preferred destinations: " + places);
  }
  openWhatsApp(lines.filter(Boolean).join("\n"));
  tourFormModal.classList.remove("open");
});
