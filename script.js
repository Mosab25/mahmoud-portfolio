const mobileToggle = document.getElementById("mobileToggle");
const navLinks = document.getElementById("navLinks");
const reveals = document.querySelectorAll(".reveal");
const phoneInput = document.getElementById("phone");
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
const PAGE_ORDER = [
  "index.html",
  "services.html",
  "portfolio.html",
  "about.html",
  "blog.html",
  "contact.html",
];

mobileToggle?.addEventListener("click", () => {
  navLinks?.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => navLinks?.classList.remove("open"));
});

const progressBar = document.createElement("div");
progressBar.className = "progress-bar";
document.body.appendChild(progressBar);

function updateProgressBar() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
}
updateProgressBar();
window.addEventListener("scroll", updateProgressBar, { passive: true });

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 },
);

reveals.forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 8, 7) * 70}ms`;
  observer.observe(el);
});

const currentPath = window.location.pathname.split("/").pop() || "index.html";
const currentIndex = PAGE_ORDER.indexOf(currentPath);
const hasPager = currentIndex !== -1;
const prevPage = hasPager ? PAGE_ORDER[currentIndex - 1] : null;
const nextPage = hasPager ? PAGE_ORDER[currentIndex + 1] : null;

function shouldIgnoreSwipeTarget(target) {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      'input, textarea, select, button, a, [role="button"], [contenteditable="true"]',
    ),
  );
}

function navigatePage(path) {
  if (!path) return;
  window.location.href = path;
}

if (hasPager && (prevPage || nextPage)) {
  const swipeNav = document.createElement("div");
  swipeNav.className = "page-swipe-nav";
  swipeNav.innerHTML = `
    <span class="page-swipe-label">اسحب أفقيًا أو استخدم الأزرار للتنقل بين الصفحات</span>
    <div class="page-swipe-actions">
      ${prevPage ? `<a class="swipe-btn" href="${prevPage}">الصفحة السابقة</a>` : ""}
      ${nextPage ? `<a class="swipe-btn" href="${nextPage}">الصفحة التالية</a>` : ""}
    </div>
  `;
  document.body.appendChild(swipeNav);

  function toggleSwipeNavVisibility() {
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 520;
    swipeNav.classList.toggle("visible", nearBottom);
  }

  let touchStartX = 0;
  let touchStartY = 0;
  let canTrackSwipe = false;
  let wheelLocked = false;

  window.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1) return;
    if (shouldIgnoreSwipeTarget(event.target)) return;
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    canTrackSwipe = true;
  }, { passive: true });

  window.addEventListener("touchend", (event) => {
    if (!canTrackSwipe) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    canTrackSwipe = false;
    if (Math.abs(deltaX) < 80 || Math.abs(deltaY) > 70) return;
    if (deltaX < 0) navigatePage(nextPage);
    if (deltaX > 0) navigatePage(prevPage);
  }, { passive: true });

  window.addEventListener("wheel", (event) => {
    if (wheelLocked || event.deltaY <= 45 || !nextPage) return;
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 24;
    if (!nearBottom) return;
    wheelLocked = true;
    navigatePage(nextPage);
    window.setTimeout(() => { wheelLocked = false; }, 700);
  }, { passive: true });

  window.addEventListener("scroll", toggleSwipeNavVisibility, { passive: true });
  window.addEventListener("resize", toggleSwipeNavVisibility);
  toggleSwipeNavVisibility();
}

const parallaxItems = document.querySelectorAll("[data-parallax]");
function animateParallax() {
  const y = window.scrollY;
  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.parallax || 0.08);
    item.style.transform = `${item.dataset.baseTransform || ""} translate3d(0, ${y * speed}px, 0)`;
  });
}
parallaxItems.forEach((item) => {
  item.dataset.baseTransform = getComputedStyle(item).transform === "none" ? "" : getComputedStyle(item).transform;
});
window.addEventListener("scroll", animateParallax, { passive: true });
animateParallax();

const galleryItems = document.querySelectorAll(".gallery-item, .portfolio-item img, [data-lightbox]");
if (galleryItems.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="إغلاق">✕</button>
      <img src="" alt="Preview" />
    </div>`;
  document.body.appendChild(lightbox);
  const lightboxImage = lightbox.querySelector("img");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  function openLightbox(src, alt = "Preview") {
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.tagName === "IMG" ? item : item.querySelector("img");
      if (!img) return;
      openLightbox(img.src, img.alt || "Preview");
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });
}

phoneInput?.addEventListener("input", () => {
  phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 9);
});

const FORMSUBMIT_EMAIL = "baraahassan500@gmail.com";
contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;
  if (formNote) formNote.textContent = "جاري إرسال الطلب...";

  try {
    const fd = new FormData(contactForm);
    const localPhone = (phoneInput?.value || "").replace(/\D/g, "");
    if (localPhone) fd.set("phone", `+966${localPhone}`);
    const res = await fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`, {
      method: "POST",
      body: fd,
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      if (formNote) formNote.textContent = "تم إرسال طلبك بنجاح. سيتم التواصل معك قريبًا.";
      contactForm.reset();
    } else if (formNote) {
      formNote.textContent = "تعذر إرسال الطلب. تحقق من الاتصال أو حاول مرة أخرى لاحقًا.";
    }
  } catch {
    if (formNote) formNote.textContent = "تعذر إرسال الطلب. تحقق من الاتصال بالإنترنت وحاول مرة أخرى.";
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
});
