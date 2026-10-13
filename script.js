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
  var guests = document.getElementById("guests").value || "2 Adults, 1 Room";
  return [
    "Hello Hotel Nesstara, I would like to check availability.",
    room ? "Room: " + room : "",
    "Check-in: " + (ci ? ci.value : ""),
    "Check-out: " + (co ? co.value : ""),
    "Guests: " + guests
  ].filter(Boolean).join("\n");
}
function openWhatsApp(text) {
  window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text), "_blank");
}

document.getElementById("booking").addEventListener("submit", function (e) {
  e.preventDefault();
  if (co.value <= ci.value) {
    alert("Check-out should be after check-in.");
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
var heroDots = document.getElementById("heroDots");
var heroIndex = 0;
heroSlides.forEach(function (_, i) {
  var dot = document.createElement("button");
  dot.type = "button";
  if (i === 0) dot.className = "on";
  dot.addEventListener("click", function () { showHero(i); });
  heroDots.appendChild(dot);
});
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
  Array.prototype.forEach.call(heroDots.children, function (dot, i) {
    dot.classList.toggle("on", i === heroIndex);
  });
}
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
