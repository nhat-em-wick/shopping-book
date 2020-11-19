// MENU SHOP
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId);
  const nav = document.getElementById(navId);
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show");
    });
  }
};

showMenu("nav-toggle", "nav-menu");

// REMOVE MENU
const navLink = document.querySelectorAll(".nav_link");
const navMenu = document.getElementById("nav-menu");
function linkAction() {
  navMenu.classList.remove("show");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));

//CHANGE COLOR HEADER

window.onscroll = () => {
  const nav = document.getElementById("header");
  if (this.scrollY >= 200) nav.classList.add("scroll-header");
  else nav.classList.remove("scroll-header");
};

//SCROLL TOP
const toTop = document.querySelector(".to-top");

window.addEventListener("scroll", () => {
  if (window.pageYOffset < 100) {
    toTop.classList.remove("active");
  } else {
    toTop.classList.add("active");
  }
});

toTop.addEventListener("click", () => {
  window.scrollTo(0, 0);
});

// SLIDE
try {
  const slides = document.querySelector(".slider").children;
  const indicatorImg = document.querySelector(".slider-indicator").children;
  for (let i = 0; i < indicatorImg.length; i++) {
    indicatorImg[i].addEventListener('click', function() {
      for (let j = 0; j < indicatorImg.length; j++) {
        indicatorImg[j].classList.remove("active");
      }
      this.classList.add("active");
      const id = this.getAttribute("data-id");
      for (let j = 0; j < slides.length; j++) {
        slides[j].classList.remove("active");
      }
      slides[id].classList.add("active");
    });
  }
} catch {}

// INFO
const password = document.querySelector("#password");
const btnChange = document.querySelector("#btn-changeInfo");
try {
  btnChange.disabled = true;
  password.addEventListener("keyup", () => {
    if (password.value.length > 0) {
      btnChange.disabled = false;
    } else {
      btnChange.disabled = true;
    }
  });
} catch {}

// cart
let addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter = document.querySelector("#cartCount");
function updateCart(product) {
  axios.post("/addtocart", product).then(function (res) {
    cartCounter.innerText = res.data.totalQty;
  });
}
addToCart.forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    var product = JSON.parse(btn.dataset.product);
    updateCart(product);
  });
});

//UPDATE STATUS
let statuses = document.querySelectorAll(".status-line");
let hiddenInput = document.querySelector("#hiddenInput");
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);

function updateStatus(order) {
  let stepComplete = true;
  for (let i = 0; i < statuses.length; i++) {
    let dataProp = statuses[i].dataset.status;
    if (stepComplete) {
      statuses[i].classList.add("step-completed");
    }
    if (dataProp === order.status) {
      stepComplete = false;
      if (statuses[i].nextElementSibling) {
        statuses[i].nextElementSibling.classList.add("current");
      }
    }
  }
}

updateStatus(order);

