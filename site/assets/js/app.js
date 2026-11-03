/* CS329Z 精读站 — small progressive enhancements */
(function () {
  "use strict";

  var root = document.documentElement;
  var STORAGE_KEY = "cs329z-theme";

  function storedTheme() {
    try {
      var value = localStorage.getItem(STORAGE_KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch (err) {
      return null;
    }
  }

  function applyTheme(theme) {
    if (theme) {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
    var btn = document.querySelector("[data-theme-toggle]");
    if (btn) {
      var isDark =
        theme === "dark" ||
        (!theme &&
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      btn.textContent = isDark ? "☀" : "☾";
      btn.setAttribute(
        "aria-label",
        isDark ? "切换到浅色模式" : "切换到深色模式"
      );
      btn.setAttribute("title", isDark ? "浅色模式" : "深色模式");
    }
  }

  applyTheme(storedTheme());

  document.addEventListener("click", function (event) {
    var btn = event.target.closest("[data-theme-toggle]");
    if (!btn) return;
    var current = root.getAttribute("data-theme");
    var prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    var next = current === "dark" ? "light" : current === "light" ? "dark" : prefersDark ? "light" : "dark";
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (err) {
      /* private mode or blocked storage: theme still applies for this page */
    }
    applyTheme(next);
  });

  /* reading progress */
  var bar = document.querySelector(".progress__bar");
  var toTop = document.querySelector(".to-top");
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var ratio = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
      if (bar) bar.style.width = (ratio * 100).toFixed(2) + "%";
      if (toTop) toTop.classList.toggle("is-visible", doc.scrollTop > 600);
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* open the table of contents by default on wide screens */
  var toc = document.querySelector(".toc");
  if (toc && window.innerWidth >= 900) {
    toc.setAttribute("open", "");
  }

  /* click a figure to zoom */
  var lightbox = null;

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function openLightbox(src, alt) {
    if (!lightbox) {
      lightbox = document.createElement("div");
      lightbox.className = "lightbox";
      lightbox.setAttribute("role", "dialog");
      lightbox.setAttribute("aria-modal", "true");
      lightbox.setAttribute("aria-label", "放大的图片");
      lightbox.innerHTML =
        '<button class="lightbox__close" type="button" aria-label="关闭">×</button>' +
        '<img alt="">' +
        '<span class="lightbox__hint">左右滑动查看 · 点击空白处关闭 · Esc</span>';
      document.body.appendChild(lightbox);
      lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) closeLightbox();
      });
      lightbox.querySelector(".lightbox__close").addEventListener("click", function (event) {
        event.stopPropagation();
        closeLightbox();
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeLightbox();
      });
    }
    var img = lightbox.querySelector("img");
    img.src = src;
    img.alt = alt || "";
    img.style.width = "";
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    lightbox.scrollTop = 0;
    lightbox.scrollLeft = 0;

    function fit() {
      var target = Math.min(
        img.naturalWidth || 1200,
        Math.max(720, Math.round(window.innerWidth * 0.96))
      );
      img.style.width = target + "px";
    }

    if (img.complete && img.naturalWidth) {
      fit();
    } else {
      img.onload = fit;
    }
  }

  document.addEventListener("click", function (event) {
    var img = event.target.closest("figure img");
    if (!img) return;
    event.preventDefault();
    openLightbox(img.currentSrc || img.src, img.alt);
  });
})();
