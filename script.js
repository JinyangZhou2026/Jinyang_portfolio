const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");

const animatedWords = document.querySelectorAll(".word-animate");

animatedWords.forEach((word) => {
  const delay = Number.parseInt(word.getAttribute("data-delay") || "0", 10);
  window.setTimeout(() => {
    word.classList.add("is-visible");
  }, delay + 250);
});

const greetingRotator = document.querySelector("[data-greeting-rotator]");
const greetingLines = greetingRotator ? Array.from(greetingRotator.querySelectorAll(".hero-greeting-line")) : [];

if (greetingLines.length > 1) {
  let currentGreeting = 0;

  greetingLines.forEach((line, index) => {
    line.setAttribute("aria-hidden", String(index !== currentGreeting));
  });

  window.setTimeout(() => {
    window.setInterval(() => {
      const currentLine = greetingLines[currentGreeting];
      const nextGreeting = (currentGreeting + 1) % greetingLines.length;
      const nextLine = greetingLines[nextGreeting];

      currentLine.classList.add("is-leaving");
      currentLine.classList.remove("is-active");
      currentLine.setAttribute("aria-hidden", "true");

      nextLine.classList.remove("is-leaving");
      nextLine.classList.add("is-active");
      nextLine.setAttribute("aria-hidden", "false");

      window.setTimeout(() => {
        currentLine.classList.remove("is-leaving", "is-visible");
      }, 760);

      currentGreeting = nextGreeting;
    }, 2000);
  }, 1450);
}

const magicText = document.querySelector(".magic-static-text");
const magicWords = magicText ? Array.from(magicText.querySelectorAll("span")) : [];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const homepageRevealItems = Array.from(document.querySelectorAll([
  ".positioning-statement > .eyebrow",
  ".positioning-statement-copy > *",
  ".experience-highlights-heading h2",
  ".featured-project-previews-heading h2",
  ".more-work-explorer-heading h2",
  ".about-preview h2"
].join(", ")));
const countUpElements = Array.from(document.querySelectorAll("[data-count-to]"));

if (!reduceMotion.matches) {
  homepageRevealItems.forEach((item) => item.classList.add("homepage-scroll-reveal"));
}

const updateMagicTextReveal = () => {
  if (!magicText || magicWords.length === 0) return;

  const rect = magicText.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const start = viewportHeight * 0.9;
  const end = viewportHeight * 0.25;
  const rawProgress = (start - rect.top) / (start - end);
  const progress = Math.min(Math.max(rawProgress, 0), 1);

  magicWords.forEach((word, index) => {
    const wordStart = index / magicWords.length;
    const wordEnd = (index + 1) / magicWords.length;
    const wordProgress = Math.min(Math.max((progress - wordStart) / (wordEnd - wordStart), 0), 1);
    word.style.setProperty("--reveal", wordProgress.toFixed(3));
  });
};

const updateHomepageTextReveal = () => {
  if (homepageRevealItems.length === 0 || reduceMotion.matches) return;

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const revealStart = viewportHeight * 0.92;
  const revealEnd = viewportHeight * 0.46;

  homepageRevealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const itemProgress = Math.min(Math.max((revealStart - rect.top) / (revealStart - revealEnd), 0), 1);
    item.style.setProperty("--reveal-progress", itemProgress.toFixed(3));
  });
};

const animateCountUp = (element) => {
  const target = Number(element.dataset.countTo || 0);
  const suffix = element.dataset.countSuffix || "";
  const duration = 1250;
  let startTime;

  const updateCount = (timestamp) => {
    if (startTime === undefined) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * easedProgress)}${suffix}`;

    if (progress < 1) {
      window.requestAnimationFrame(updateCount);
    }
  };

  window.requestAnimationFrame(updateCount);
};

if (countUpElements.length > 0 && !reduceMotion.matches && "IntersectionObserver" in window) {
  countUpElements.forEach((element) => {
    element.textContent = `0${element.dataset.countSuffix || ""}`;
  });

  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCountUp(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.45 });

  countUpElements.forEach((element) => countObserver.observe(element));
}

const resumeMotionItems = Array.from(document.querySelectorAll([
  ".resume-head > .resume-role",
  ".resume-head > .resume-identity",
  ".resume-head > .resume-summary",
  ".resume-head > .resume-contact-line",
  ".resume-head > .action-row",
  ".resume-photo-area",
  ".resume-section-heading",
  ".resume-timeline-item",
  ".resume-grid > section",
].join(", ")));

if (resumeMotionItems.length > 0) {
  resumeMotionItems.forEach((item, index) => {
    item.classList.add("resume-reveal");
    item.style.setProperty("--resume-reveal-delay", `${(index % 3) * 70}ms`);
  });

  if (!reduceMotion.matches && "IntersectionObserver" in window) {
    document.body.classList.add("resume-motion-ready");

    const resumeMotionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.12,
    });

    window.requestAnimationFrame(() => {
      resumeMotionItems.forEach((item) => resumeMotionObserver.observe(item));
    });
  } else {
    resumeMotionItems.forEach((item) => item.classList.add("is-visible"));
  }
}

const workExplorer = document.querySelector("[data-work-explorer]");

if (workExplorer) {
  const explorerTabs = Array.from(workExplorer.querySelectorAll(".more-work-explorer-tab"));
  const explorerPreview = workExplorer.querySelector(".more-work-explorer-preview");
  const explorerVisual = workExplorer.querySelector("[data-explore-preview-visual]");
  const explorerKicker = workExplorer.querySelector("[data-explore-preview-kicker]");
  const explorerTitle = workExplorer.querySelector("[data-explore-preview-title]");
  const explorerDescription = workExplorer.querySelector("[data-explore-preview-description]");
  const explorerLink = workExplorer.querySelector("[data-explore-preview-link]");

  explorerTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (tab.classList.contains("is-active")) return;

      explorerTabs.forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      });

      explorerPreview?.classList.add("is-changing");

      window.setTimeout(() => {
        if (explorerVisual) {
          explorerVisual.classList.remove("visual-industrial", "visual-visualization", "visual-communication");
          explorerVisual.classList.add(`visual-${tab.dataset.exploreVisual || "industrial"}`);
        }
        if (explorerKicker) explorerKicker.textContent = tab.dataset.exploreKicker || "";
        if (explorerTitle) explorerTitle.textContent = tab.dataset.exploreTitle || "";
        if (explorerDescription) explorerDescription.textContent = tab.dataset.exploreDescription || "";
        if (explorerLink) {
          explorerLink.href = tab.dataset.exploreHref || "#";
          explorerLink.firstChild.textContent = `${tab.dataset.exploreLinkLabel || "Explore Work"} `;
        }
        explorerPreview?.classList.remove("is-changing");
      }, 180);
    });
  });
}

updateMagicTextReveal();
updateHomepageTextReveal();
window.addEventListener("scroll", updateMagicTextReveal, { passive: true });
window.addEventListener("resize", updateMagicTextReveal);
window.addEventListener("scroll", updateHomepageTextReveal, { passive: true });
window.addEventListener("resize", updateHomepageTextReveal);

const projectNavs = document.querySelectorAll(".nav-projects");

const closeProjectMenus = () => {
  projectNavs.forEach((projectNav) => {
    projectNav.classList.remove("is-open");
    projectNav.querySelector(".nav-projects-trigger")?.setAttribute("aria-expanded", "false");
  });
};

const setMobileMenuOpen = (isOpen) => {
  if (!menuButton || !siteNav) return;

  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  siteNav.classList.toggle("is-open", isOpen);

  if (!isOpen) {
    closeProjectMenus();
  }
};

if (menuButton && siteNav) {
  menuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    setMobileMenuOpen(!isOpen);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest(".nav-projects-trigger")) return;
    if (event.target.closest("a")) {
      setMobileMenuOpen(false);
    }
  });
}

projectNavs.forEach((projectNav) => {
  const trigger = projectNav.querySelector(".nav-projects-trigger");

  if (!trigger) return;

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = projectNav.classList.contains("is-open");

    projectNavs.forEach((nav) => {
      nav.classList.remove("is-open");
      nav.querySelector(".nav-projects-trigger")?.setAttribute("aria-expanded", "false");
    });

    projectNav.classList.toggle("is-open", !isOpen);
    trigger.setAttribute("aria-expanded", String(!isOpen));
  });
});

document.addEventListener("click", (event) => {
  closeProjectMenus();

  if (siteHeader && menuButton?.getAttribute("aria-expanded") === "true" && !siteHeader.contains(event.target)) {
    setMobileMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  closeProjectMenus();
  setMobileMenuOpen(false);
});

const carousels = document.querySelectorAll("[data-carousel]");

carousels.forEach((carousel) => {
  const image = carousel.querySelector("[data-carousel-image]");
  const previousButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const currentLabel = carousel.querySelector("[data-carousel-current]");
  const totalLabel = carousel.querySelector("[data-carousel-total]");
  const slides = (carousel.getAttribute("data-slides") || "")
    .split(";")
    .map((item) => {
      const [src, alt, position] = item.split("|");
      return { src, alt, position };
    })
    .filter((slide) => slide.src && slide.alt);

  if (!image || !previousButton || !nextButton || slides.length === 0) return;

  let activeIndex = 0;

  const renderSlide = () => {
    const slide = slides[activeIndex];
    carousel.classList.add("is-changing");
    image.src = slide.src;
    image.alt = slide.alt;
    carousel.style.setProperty("--carousel-position", slide.position || "50% 50%");

    if (currentLabel) currentLabel.textContent = String(activeIndex + 1);
    if (totalLabel) totalLabel.textContent = String(slides.length);

    window.setTimeout(() => carousel.classList.remove("is-changing"), 180);
  };

  const showSlide = (direction) => {
    activeIndex = (activeIndex + direction + slides.length) % slides.length;
    renderSlide();
  };

  previousButton.addEventListener("click", () => showSlide(-1));
  nextButton.addEventListener("click", () => showSlide(1));
  renderSlide();
});

const linkedProjectCards = document.querySelectorAll("[data-card-href]");

linkedProjectCards.forEach((card) => {
  const href = card.getAttribute("data-card-href");
  if (!href) return;

  const openCard = () => {
    window.location.href = href;
  };

  card.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) return;
    openCard();
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openCard();
  });
});

const resumeTabs = document.querySelectorAll("[data-resume-tab]");
const resumePanels = document.querySelectorAll("[data-resume-panel]");

resumeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.getAttribute("data-resume-tab");

    resumeTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    resumePanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.getAttribute("data-resume-panel") === target);
    });
  });
});

const videoBrowsers = document.querySelectorAll("[data-video-browser]");

videoBrowsers.forEach((browser) => {
  const categories = browser.querySelectorAll("[data-video-category]");
  const panels = browser.querySelectorAll("[data-video-panel]");
  const selectors = browser.querySelectorAll(".video-select");
  const viewer = browser.querySelector(".video-viewer");
  const frame = viewer?.querySelector(".video-frame");
  const poster = viewer?.querySelector("[data-video-poster]");
  const pdfViewer = viewer?.querySelector("[data-video-pdf-viewer]");
  const player = viewer?.querySelector("[data-video-player]");
  const youtubeLink = viewer?.querySelector("[data-video-youtube-target]");
  const galleryControls = viewer?.querySelector("[data-video-gallery-controls]");
  const galleryPrevious = viewer?.querySelector("[data-video-gallery-prev]");
  const galleryNext = viewer?.querySelector("[data-video-gallery-next]");
  const galleryCurrent = viewer?.querySelector("[data-video-gallery-current]");
  const galleryTotal = viewer?.querySelector("[data-video-gallery-total]");
  const confidentialNote = viewer?.querySelector("[data-video-confidential-note]");
  const videoStatus = viewer?.querySelector("[data-video-status]");
  const playToggle = viewer?.querySelector("[data-video-play-toggle]");
  const kicker = viewer?.querySelector("[data-video-kicker]");
  const title = viewer?.querySelector("[data-video-title]");
  const description = viewer?.querySelector("[data-video-description]");
  const contribution = viewer?.querySelector("[data-video-contribution]");
  const contributionText = viewer?.querySelector("[data-video-contribution-text]");
  const fileLink = viewer?.querySelector("[data-video-link-target]");
  let gallerySlides = [];
  let galleryIndex = 0;

  const parseGallerySlides = (selector) => (selector.getAttribute("data-video-gallery") || "")
    .split(";")
    .map((item) => {
      const [src, alt, position] = item.split("|");
      return { src, alt, position };
    })
    .filter((slide) => slide.src && slide.alt);

  const renderGallerySlide = () => {
    if (!poster || gallerySlides.length === 0) return;

    const slide = gallerySlides[galleryIndex];
    poster.src = slide.src;
    poster.alt = slide.alt;
    poster.style.objectPosition = slide.position || "50% 50%";

    if (galleryCurrent) galleryCurrent.textContent = String(galleryIndex + 1);
    if (galleryTotal) galleryTotal.textContent = String(gallerySlides.length);
  };

  const setGalleryVisible = (isVisible) => {
    if (galleryControls) galleryControls.hidden = !isVisible;
    frame?.classList.toggle("is-gallery-active", isVisible);
  };

  const renderConfidentialNote = (text) => {
    if (!confidentialNote) return;

    confidentialNote.replaceChildren();
    confidentialNote.hidden = true;
    if (!text) return;

    const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    confidentialNote.setAttribute("aria-label", lines.join(" "));
  };

  const renderVideoStatus = (isConfidential) => {
    if (!videoStatus) return;
    videoStatus.hidden = !isConfidential;
  };

  const updateVideo = (selector) => {
    selectors.forEach((item) => item.classList.toggle("is-active", item === selector));

    const videoSrc = selector.getAttribute("data-video-src") || "";
    const imageSrc = selector.getAttribute("data-video-image") || "";
    const pdfSrc = selector.getAttribute("data-video-pdf") || "";
    const youtubeSrc = selector.getAttribute("data-video-youtube") || "";
    const confidentialText = selector.getAttribute("data-video-confidential") || "";
    const confidentialTheme = selector.getAttribute("data-video-confidential-theme") || "";
    const contributionValue = selector.getAttribute("data-video-contribution") || "";
    const mediaRatio = selector.getAttribute("data-video-ratio") || "";
    const isConfidential = Boolean(confidentialText);
    gallerySlides = parseGallerySlides(selector);
    galleryIndex = 0;
    setGalleryVisible(gallerySlides.length > 1);
    frame?.classList.toggle("is-confidential", isConfidential);
    frame?.classList.toggle("is-confidential-light", isConfidential && confidentialTheme === "light");
    frame?.classList.remove("is-asset-card-media", "is-panel-media", "is-portrait-media", "is-square-media", "is-wide-media");
    if (mediaRatio === "asset-card") frame?.classList.add("is-asset-card-media");
    if (mediaRatio === "panel") frame?.classList.add("is-panel-media");
    if (mediaRatio === "portrait") frame?.classList.add("is-portrait-media");
    if (mediaRatio === "square") frame?.classList.add("is-square-media");
    if (mediaRatio === "wide") frame?.classList.add("is-wide-media");

    renderConfidentialNote(confidentialText);
    renderVideoStatus(isConfidential);

    if (player) {
      if (videoSrc) {
        if (!player.src.endsWith(videoSrc)) {
          player.src = videoSrc;
          player.load();
        }
        player.hidden = false;
        player.controls = !isConfidential;
        frame?.classList.add("is-video-active");
        frame?.classList.remove("is-image-active");
      } else {
        player.pause();
        player.removeAttribute("src");
        player.load();
        player.hidden = true;
        player.controls = false;
        frame?.classList.remove("is-video-active");
        frame?.classList.add("is-image-active");
      }
    }

    if (poster) {
      if (gallerySlides.length > 0) {
        renderGallerySlide();
      } else {
        poster.src = imageSrc || selector.getAttribute("data-video-poster") || poster.src;
        poster.alt = `${selector.getAttribute("data-video-title") || "Selected video"} preview`;
        poster.style.removeProperty("object-position");
      }
      poster.hidden = Boolean(pdfSrc) || (Boolean(videoSrc) && !imageSrc);
    }

    if (youtubeLink) {
      youtubeLink.href = youtubeSrc || "#";
      youtubeLink.setAttribute("aria-label", `Watch ${selector.getAttribute("data-video-title") || "selected video"} on YouTube`);
      youtubeLink.hidden = !youtubeSrc;
    }

    if (pdfViewer) {
      if (pdfSrc) {
        pdfViewer.src = pdfSrc;
        pdfViewer.title = `${selector.getAttribute("data-video-title") || "Selected visual communication"} PDF`;
        pdfViewer.hidden = false;
        frame?.classList.add("is-pdf-active");
      } else {
        pdfViewer.removeAttribute("src");
        pdfViewer.hidden = true;
        frame?.classList.remove("is-pdf-active");
      }
    }

    if (kicker) kicker.textContent = selector.getAttribute("data-video-kicker") || "";
    if (title) title.textContent = selector.getAttribute("data-video-title") || "";
    if (description) description.textContent = selector.getAttribute("data-video-description") || "";
    if (contribution) contribution.hidden = !contributionValue;
    if (contributionText) contributionText.textContent = contributionValue;
    if (fileLink) {
      const linkSrc = selector.getAttribute("data-video-link") || "";
      const linkLabel = selector.getAttribute("data-video-link-label") || "Open PDF";
      fileLink.href = linkSrc || "#";
      fileLink.textContent = linkLabel;
      fileLink.hidden = !linkSrc;
    }

    updatePlayToggleLabel();
  };

  const updatePlayToggleLabel = () => {
    if (!playToggle || !player) return;

    playToggle.setAttribute("aria-label", player.paused ? "Play selected video" : "Pause selected video");
    frame?.classList.toggle("is-playing", !player.paused);
  };

  const toggleVideoPlayback = () => {
    if (!player || player.hidden) return;

    if (player.paused) {
      player.play().then(updatePlayToggleLabel).catch(updatePlayToggleLabel);
    } else {
      player.pause();
      updatePlayToggleLabel();
    }
  };

  galleryPrevious?.addEventListener("click", () => {
    if (gallerySlides.length === 0) return;

    galleryIndex = (galleryIndex - 1 + gallerySlides.length) % gallerySlides.length;
    renderGallerySlide();
  });

  galleryNext?.addEventListener("click", () => {
    if (gallerySlides.length === 0) return;

    galleryIndex = (galleryIndex + 1) % gallerySlides.length;
    renderGallerySlide();
  });

  categories.forEach((category) => {
    category.setAttribute("aria-selected", String(category.classList.contains("is-active")));
    category.addEventListener("click", () => {
      const target = category.getAttribute("data-video-category");
      categories.forEach((item) => {
        const isActive = item === category;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      });
      panels.forEach((panel) => {
        const isActive = panel.getAttribute("data-video-panel") === target;
        panel.classList.toggle("is-active", isActive);
        panel.setAttribute("aria-hidden", String(!isActive));
      });

      const activePanel = browser.querySelector(`[data-video-panel="${target}"]`);
      const firstVideo = activePanel?.querySelector('[data-video-featured="true"]')
        || activePanel?.querySelector(".video-select:not([data-video-context-only])")
        || activePanel?.querySelector(".video-select");
      if (firstVideo) updateVideo(firstVideo);
    });
  });

  selectors.forEach((selector) => {
    selector.addEventListener("click", () => {
      updateVideo(selector);
      if (window.matchMedia("(max-width: 720px)").matches && viewer) {
        window.requestAnimationFrame(() => viewer.scrollIntoView({ behavior: "smooth", block: "start" }));
      }
    });
  });

  playToggle?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleVideoPlayback();
  });

  player?.addEventListener("play", updatePlayToggleLabel);
  player?.addEventListener("pause", updatePlayToggleLabel);
  player?.addEventListener("ended", updatePlayToggleLabel);
  player?.addEventListener("loadedmetadata", updatePlayToggleLabel);
  panels.forEach((panel) => panel.setAttribute("aria-hidden", String(!panel.classList.contains("is-active"))));
  const initialSelector = browser.querySelector(".video-select.is-active") || selectors[0];
  if (initialSelector) {
    updateVideo(initialSelector);
  } else {
    updatePlayToggleLabel();
  }
});

const communicationCategoryLinks = document.querySelectorAll("[data-communication-category-link]");

communicationCategoryLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const target = link.getAttribute("data-communication-category-link");
    const itemTarget = link.getAttribute("data-communication-item-link");
    const category = document.querySelector(`[data-video-category="${target}"]`);
    if (category instanceof HTMLButtonElement) category.click();
    if (itemTarget) {
      const item = document.querySelector(`[data-video-item="${itemTarget}"]`);
      if (item instanceof HTMLButtonElement) item.click();
    }
  });
});

const caseStudyNavs = document.querySelectorAll("[data-case-study-nav]");

caseStudyNavs.forEach((nav, navIndex) => {
  const links = Array.from(nav.querySelectorAll("[data-case-study-link]"));
  const navId = nav.id || `case-study-nav-${navIndex + 1}`;
  nav.id = navId;

  const toggle = document.createElement("button");
  toggle.className = "case-study-nav-toggle";
  toggle.type = "button";
  toggle.textContent = "Sections";
  toggle.setAttribute("aria-label", "Open sections navigation");
  toggle.setAttribute("aria-controls", navId);
  toggle.setAttribute("aria-expanded", "false");
  nav.insertAdjacentElement("beforebegin", toggle);

  const isDesktopNav = () => window.matchMedia("(min-width: 981px)").matches;
  const setNavOpen = (isOpen) => {
    nav.classList.toggle("is-open", isOpen);
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close sections navigation" : "Open sections navigation");
  };

  const sectionPairs = links
    .map((link) => {
      const hash = link.getAttribute("href") || "";
      if (!hash.startsWith("#")) return null;
      const section = document.getElementById(hash.slice(1));
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  if (sectionPairs.length === 0) return;

  const setActiveSection = (id) => {
    sectionPairs.forEach(({ link, section }) => {
      const isActive = section.id === id;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const getCurrentSectionId = () => {
    const readingLine = window.innerHeight * 0.34;
    let current = sectionPairs[0].section.id;

    sectionPairs.forEach(({ section }) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= readingLine) {
        current = section.id;
      }
    });

    return current;
  };

  const updateActiveSection = () => setActiveSection(getCurrentSectionId());
  const updateCaseStudyNav = () => updateActiveSection();

  toggle.addEventListener("click", () => {
    setNavOpen(!nav.classList.contains("is-open"));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setNavOpen(false);
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!isDesktopNav() || !nav.classList.contains("is-open")) return;
    if (nav.contains(target) || toggle.contains(target)) return;
    setNavOpen(false);
  });

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href") || "";
      if (!hash.startsWith("#")) return;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(target.id);
      window.history.pushState(null, "", hash);
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      () => updateCaseStudyNav(),
      {
        root: null,
        rootMargin: "-28% 0px -58% 0px",
        threshold: [0, 0.12, 0.32, 0.6],
      },
    );

    sectionPairs.forEach(({ section }) => observer.observe(section));
  }

  updateCaseStudyNav();
  window.addEventListener("scroll", updateCaseStudyNav, { passive: true });
  window.addEventListener("resize", () => {
    updateCaseStudyNav();
    if (!isDesktopNav()) {
      setNavOpen(false);
    }
  });
});

const globalGlow = document.createElement("span");
globalGlow.className = "global-serenity-glow";
document.body.appendChild(globalGlow);

document.addEventListener("mousemove", (event) => {
  globalGlow.style.left = `${event.clientX}px`;
  globalGlow.style.top = `${event.clientY}px`;
  globalGlow.style.opacity = "1";
});

document.addEventListener("mouseleave", () => {
  globalGlow.style.opacity = "0";
});

document.addEventListener("click", (event) => {
  const ripple = document.createElement("span");
  ripple.className = "global-serenity-ripple";
  ripple.style.left = `${event.clientX}px`;
  ripple.style.top = `${event.clientY}px`;
  document.body.appendChild(ripple);
  window.setTimeout(() => ripple.remove(), 1000);
});
