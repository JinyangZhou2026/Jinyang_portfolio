const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (siteHeader) {
  let headerScrollFrame;

  const syncHeaderScrollState = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 32);
    headerScrollFrame = undefined;
  };

  const requestHeaderScrollSync = () => {
    if (headerScrollFrame !== undefined) return;
    headerScrollFrame = window.requestAnimationFrame(syncHeaderScrollState);
  };

  syncHeaderScrollState();
  window.addEventListener("scroll", requestHeaderScrollSync, { passive: true });
}

if (finePointer.matches && !reduceMotion.matches) {
  const mouseGlow = document.createElement("div");
  mouseGlow.className = "global-serenity-glow";
  mouseGlow.setAttribute("aria-hidden", "true");
  document.body.append(mouseGlow);

  let glowFrame;
  let pointerX = 0;
  let pointerY = 0;

  const positionMouseGlow = () => {
    mouseGlow.style.left = `${pointerX}px`;
    mouseGlow.style.top = `${pointerY}px`;
    mouseGlow.style.opacity = "1";
    glowFrame = undefined;
  };

  document.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (glowFrame === undefined) glowFrame = window.requestAnimationFrame(positionMouseGlow);
  }, { passive: true });

  document.documentElement.addEventListener("mouseleave", () => {
    mouseGlow.style.opacity = "0";
  });

  window.addEventListener("blur", () => {
    mouseGlow.style.opacity = "0";
  });
}

const animatedWords = document.querySelectorAll(".word-animate");

const revealAnimatedWord = (word) => {
  const requestedDelay = Number.parseInt(word.getAttribute("data-delay") || "0", 10);
  const delay = Math.min(Math.round(requestedDelay * 0.18), 80);

  word.classList.add("is-visible");
  if (typeof word.animate !== "function") return;

  word.animate(
    [
      { opacity: 0.88, transform: "translateY(4px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    {
      duration: 260,
      delay,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "backwards",
    },
  );
};

if (reduceMotion.matches || !("IntersectionObserver" in window)) {
  animatedWords.forEach((word) => word.classList.add("is-visible"));
} else {
  const wordRevealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      revealAnimatedWord(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.35, rootMargin: "0px 0px -4%" });

  animatedWords.forEach((word) => wordRevealObserver.observe(word));
}

const segmentLoopVideos = document.querySelectorAll("[data-segment-loop]");
const saveDataEnabled = navigator.connection?.saveData === true;
const allowDecorativeVideoAutoplay = finePointer.matches && !saveDataEnabled && !reduceMotion.matches;

segmentLoopVideos.forEach((video) => {
  const loopStart = Number.parseFloat(video.dataset.loopStart || "0");
  const loopEnd = Number.parseFloat(video.dataset.loopEnd || "0");

  const restartSegment = () => {
    video.currentTime = loopStart;
    if (allowDecorativeVideoAutoplay) {
      video.play().catch(() => {});
    }
  };

  if (!allowDecorativeVideoAutoplay) {
    video.removeAttribute("autoplay");
    video.controls = true;
    video.pause();
    return;
  }

  video.addEventListener("loadedmetadata", restartSegment);
  video.addEventListener("timeupdate", () => {
    if (loopEnd > loopStart && video.currentTime >= loopEnd) {
      restartSegment();
    }
  });
  video.addEventListener("ended", restartSegment);

  if ("IntersectionObserver" in window) {
    const loopObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    loopObserver.observe(video);
  }
});

const videoChapterNavigations = document.querySelectorAll("[data-video-chapters]");

videoChapterNavigations.forEach((navigation) => {
  const targetId = navigation.getAttribute("data-video-target");
  const video = targetId ? document.getElementById(targetId) : null;
  const buttons = Array.from(navigation.querySelectorAll("[data-video-chapter-time]"));
  const chapterList = navigation.querySelector(".engineering-video-chapter-list");

  if (!(video instanceof HTMLVideoElement) || buttons.length === 0 || !chapterList) return;

  const chapterTimes = buttons.map((button) => Number.parseFloat(button.getAttribute("data-video-chapter-time") || "0"));

  const updateVideoChapter = () => {
    const currentTime = Number.isFinite(video.currentTime) ? video.currentTime : 0;
    const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 65.814;
    let activeIndex = 0;

    chapterTimes.forEach((time, index) => {
      if (currentTime >= time) activeIndex = index;
    });

    buttons.forEach((button, index) => {
      const isActive = index === activeIndex;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    chapterList.style.setProperty("--chapter-progress", `${Math.min(100, Math.max(0, (currentTime / duration) * 100))}%`);
  };

  const seekToChapter = (time) => {
    const seek = () => {
      video.currentTime = Math.min(time, Number.isFinite(video.duration) ? video.duration : time);
      video.play().catch(() => {});
      updateVideoChapter();
    };

    if (video.readyState >= 1) seek();
    else video.addEventListener("loadedmetadata", seek, { once: true });
  };

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => seekToChapter(chapterTimes[index]));
  });

  video.addEventListener("loadedmetadata", updateVideoChapter);
  video.addEventListener("timeupdate", updateVideoChapter);
  video.addEventListener("seeked", updateVideoChapter);
  video.addEventListener("ended", updateVideoChapter);
  updateVideoChapter();
});

const greetingRotator = document.querySelector("[data-greeting-rotator]");
const greetingLines = greetingRotator ? Array.from(greetingRotator.querySelectorAll(".hero-greeting-line")) : [];

if (greetingLines.length > 1 && !reduceMotion.matches) {
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

const countUpElements = Array.from(document.querySelectorAll("[data-count-to]"));

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

const projectSelector = document.querySelector("[data-project-selector]");

if (projectSelector) {
  const projectTabs = Array.from(projectSelector.querySelectorAll(".featured-project-tab"));
  const projectPanel = projectSelector.querySelector(".featured-project-panel");
  const projectImage = projectSelector.querySelector("[data-project-preview-image]");
  const projectCategory = projectSelector.querySelector("[data-project-preview-category]");
  const projectTitle = projectSelector.querySelector("[data-project-preview-title]");
  const projectDescription = projectSelector.querySelector("[data-project-preview-description]");
  const projectRole = projectSelector.querySelector("[data-project-preview-role]");
  const projectContribution = projectSelector.querySelector("[data-project-preview-contribution]");
  const projectEvidence = projectSelector.querySelector("[data-project-preview-evidence]");
  const projectLink = projectSelector.querySelector("[data-project-preview-link]");
  const projectCurrent = projectSelector.querySelector("[data-project-current]");
  const preloadedProjectImages = new Set();
  let projectTransitionTimer;

  const preloadProjectImage = (tab) => {
    const imageSource = tab.dataset.projectImage;
    if (imageSource && !preloadedProjectImages.has(imageSource)) {
      const preloadImage = new Image();
      preloadImage.src = imageSource;
      preloadedProjectImages.add(imageSource);
    }
  };

  const syncProjectUrl = (tab) => {
    const url = new URL(window.location.href);
    url.searchParams.set("project", tab.id);
    window.history.replaceState(null, "", url.toString());
  };

  const renderProject = (tab, shouldFocus = false, shouldSyncUrl = true) => {
    if (tab && shouldSyncUrl) syncProjectUrl(tab);

    if (!tab || tab.getAttribute("aria-selected") === "true") {
      if (shouldFocus) tab?.focus();
      return;
    }

    projectTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
      item.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    if (projectCurrent) {
      const activeIndex = projectTabs.indexOf(tab) + 1;
      projectCurrent.textContent = String(activeIndex).padStart(2, "0");
    }

    if (shouldFocus) tab.focus();
    projectPanel?.classList.add("is-changing");
    window.clearTimeout(projectTransitionTimer);

    projectTransitionTimer = window.setTimeout(() => {
      if (projectImage instanceof HTMLImageElement) {
        projectImage.src = tab.dataset.projectImage || "";
        projectImage.alt = tab.dataset.projectImageAlt || "";
        projectImage.style.objectPosition = tab.dataset.projectImagePosition || "50% 50%";
        projectImage.style.setProperty("--project-image-scale", tab.dataset.projectImageScale || "1");
      }
      if (projectCategory) projectCategory.textContent = tab.dataset.projectCategory || "";
      if (projectTitle) projectTitle.textContent = tab.dataset.projectTitle || "";
      if (projectDescription) projectDescription.textContent = tab.dataset.projectDescription || "";
      if (projectRole) projectRole.textContent = tab.dataset.projectRole || "";
      if (projectContribution) projectContribution.textContent = tab.dataset.projectContribution || "";
      if (projectEvidence) projectEvidence.textContent = tab.dataset.projectEvidence || "";
      if (projectLink instanceof HTMLAnchorElement) {
        const arrow = document.createElement("span");
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "→";
        projectLink.href = tab.dataset.projectHref || "#";
        projectLink.setAttribute("aria-label", tab.dataset.projectLinkAriaLabel || "View case study");
        projectLink.replaceChildren(document.createTextNode(`${tab.dataset.projectLinkLabel || "View Case Study"} `), arrow);
      }
      projectPanel?.setAttribute("aria-labelledby", tab.id);
      projectPanel?.classList.remove("is-changing");
    }, reduceMotion.matches ? 0 : 160);
  };

  projectTabs.forEach((tab, index) => {
    tab.addEventListener("pointerenter", () => preloadProjectImage(tab), { passive: true });
    tab.addEventListener("focus", () => preloadProjectImage(tab));
    tab.addEventListener("click", () => {
      preloadProjectImage(tab);
      renderProject(tab);
    });
    tab.addEventListener("keydown", (event) => {
      let targetIndex = index;

      if (event.key === "ArrowRight") targetIndex = (index + 1) % projectTabs.length;
      else if (event.key === "ArrowLeft") targetIndex = (index - 1 + projectTabs.length) % projectTabs.length;
      else if (event.key === "Home") targetIndex = 0;
      else if (event.key === "End") targetIndex = projectTabs.length - 1;
      else return;

      event.preventDefault();
      renderProject(projectTabs[targetIndex], true);
      projectTabs[targetIndex].scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "nearest", inline: "nearest" });
    });
  });

  const requestedProjectId = new URL(window.location.href).searchParams.get("project");
  const requestedProjectTab = projectTabs.find((tab) => tab.id === requestedProjectId);
  if (requestedProjectTab) {
    preloadProjectImage(requestedProjectTab);
    renderProject(requestedProjectTab, false, false);
  }

}

const workExplorer = document.querySelector("[data-work-explorer]");

if (workExplorer) {
  const explorerTabs = Array.from(workExplorer.querySelectorAll(".more-work-explorer-tab"));
  const explorerPreview = workExplorer.querySelector(".more-work-explorer-preview");
  const explorerVisual = workExplorer.querySelector("[data-explore-preview-visual]");
  const explorerImage = workExplorer.querySelector("[data-explore-preview-image]");
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
        item.setAttribute("aria-pressed", String(isActive));
      });

      explorerPreview?.classList.add("is-changing");

      window.setTimeout(() => {
        if (explorerVisual) {
          explorerVisual.classList.remove("visual-industrial", "visual-visualization", "visual-communication");
          explorerVisual.classList.add(`visual-${tab.dataset.exploreVisual || "industrial"}`);
        }
        if (explorerImage) {
          explorerImage.src = tab.dataset.exploreImage || "";
          explorerImage.style.objectPosition = tab.dataset.exploreImagePosition || "50% 50%";
        }
        if (explorerKicker) explorerKicker.textContent = tab.dataset.exploreKicker || "";
        if (explorerTitle) explorerTitle.textContent = tab.dataset.exploreTitle || "";
        if (explorerDescription) explorerDescription.textContent = tab.dataset.exploreDescription || "";
        if (explorerLink) {
          explorerLink.href = tab.dataset.exploreHref || "#";
          explorerLink.firstChild.textContent = `${tab.dataset.exploreLinkLabel || "Explore Work"} `;
        }
        explorerPreview?.setAttribute("aria-label", tab.dataset.exploreLinkLabel || "Explore Work");
        explorerPreview?.classList.remove("is-changing");
      }, 180);
    });
  });
}

const capabilityAccordion = document.querySelector("[data-capability-accordion]");

if (capabilityAccordion) {
  const capabilityCards = Array.from(capabilityAccordion.querySelectorAll("[data-capability-card]"));
  const capabilityCurrent = document.querySelector("[data-capability-current]");
  let capabilityScrollFrame;

  const updateCapabilityCurrent = (index) => {
    if (capabilityCurrent) capabilityCurrent.textContent = String(index + 1).padStart(2, "0");
  };

  const activateCapabilityCard = (card, shouldFocus = false) => {
    capabilityCards.forEach((item) => item.classList.toggle("is-active", item === card));
    const activeIndex = capabilityCards.indexOf(card);
    if (activeIndex >= 0) updateCapabilityCurrent(activeIndex);
    if (card && shouldFocus) card.focus();
  };

  capabilityCards.forEach((card, index) => {
    card.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "touch") activateCapabilityCard(card);
    });
    card.addEventListener("focus", () => activateCapabilityCard(card));
    card.addEventListener("keydown", (event) => {
      let targetIndex = index;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") targetIndex = (index + 1) % capabilityCards.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") targetIndex = (index - 1 + capabilityCards.length) % capabilityCards.length;
      else if (event.key === "Home") targetIndex = 0;
      else if (event.key === "End") targetIndex = capabilityCards.length - 1;
      else return;

      event.preventDefault();
      activateCapabilityCard(capabilityCards[targetIndex], true);
    });
  });

  capabilityAccordion.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "touch" && !capabilityAccordion.contains(document.activeElement)) {
      activateCapabilityCard(null);
    }
  });

  capabilityAccordion.addEventListener("focusout", (event) => {
    if (!capabilityAccordion.contains(event.relatedTarget)) activateCapabilityCard(null);
  });

  capabilityAccordion.addEventListener("scroll", () => {
    if (capabilityScrollFrame !== undefined) return;
    capabilityScrollFrame = window.requestAnimationFrame(() => {
      const closestIndex = capabilityCards.reduce((bestIndex, card, index) => {
        const bestDistance = Math.abs(capabilityCards[bestIndex].offsetLeft - capabilityAccordion.scrollLeft);
        const currentDistance = Math.abs(card.offsetLeft - capabilityAccordion.scrollLeft);
        return currentDistance < bestDistance ? index : bestIndex;
      }, 0);
      updateCapabilityCurrent(closestIndex);
      capabilityScrollFrame = undefined;
    });
  }, { passive: true });
}

const activityViewer = document.querySelector("[data-activity-viewer]");

if (activityViewer) {
  const activityItems = Array.from(activityViewer.querySelectorAll("[data-activity-item]"));
  const activityVisual = activityViewer.querySelector("[data-activity-visual]");
  const activityImage = activityViewer.querySelector("[data-activity-image]");
  const activityLabel = activityViewer.querySelector("[data-activity-label]");
  const activityMeta = activityViewer.querySelector("[data-activity-meta]");
  const activityTitle = activityViewer.querySelector("[data-activity-title]");
  const activityDescription = activityViewer.querySelector("[data-activity-description]");
  const activityCurrent = activityViewer.querySelector("[data-activity-current]");
  const activityTotal = activityViewer.querySelector("[data-activity-total]");
  const activityPrevious = activityViewer.querySelector("[data-activity-prev]");
  const activityNext = activityViewer.querySelector("[data-activity-next]");
  const activityVisualClasses = activityItems.map((item) => item.dataset.visual).filter(Boolean);
  let activityIndex = 0;

  const renderActivity = () => {
    const item = activityItems[activityIndex];
    if (!item) return;
    activityVisual?.classList.remove(...activityVisualClasses);
    if (item.dataset.visual) activityVisual?.classList.add(item.dataset.visual);
    if (activityVisual && activityImage) {
      const imageSource = item.dataset.image || "";
      activityVisual.classList.toggle("has-photo", Boolean(imageSource));
      activityImage.hidden = !imageSource;
      if (imageSource) {
        activityImage.src = imageSource;
        activityImage.alt = item.dataset.imageAlt || "";
        activityImage.style.objectPosition = item.dataset.imagePosition || "50% 50%";
      } else {
        activityImage.removeAttribute("src");
        activityImage.alt = "";
        activityImage.style.removeProperty("object-position");
      }
    }
    if (activityLabel) activityLabel.textContent = item.dataset.meta?.split(" / ")[0] || "Professional activity";
    if (activityMeta) activityMeta.textContent = item.dataset.meta || "";
    if (activityTitle) activityTitle.textContent = item.dataset.title || "";
    if (activityDescription) activityDescription.textContent = item.dataset.description || "";
    if (activityCurrent) activityCurrent.textContent = String(activityIndex + 1);
    if (activityTotal) activityTotal.textContent = String(activityItems.length);
  };

  activityPrevious?.addEventListener("click", () => {
    activityIndex = (activityIndex - 1 + activityItems.length) % activityItems.length;
    renderActivity();
  });

  activityNext?.addEventListener("click", () => {
    activityIndex = (activityIndex + 1) % activityItems.length;
    renderActivity();
  });

  renderActivity();
}

const setMobileMenuOpen = (isOpen) => {
  if (!menuButton || !siteNav) return;

  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  siteNav.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("mobile-menu-open", isOpen);

  if (!isOpen) closeProjectMenus();
};

const projectNavs = document.querySelectorAll(".nav-projects");

const setProjectMenuOpen = (projectNav, isOpen) => {
  const trigger = projectNav.querySelector(".nav-projects-trigger");
  projectNav.classList.toggle("is-open", isOpen);
  trigger?.setAttribute("aria-expanded", String(isOpen));
};

function closeProjectMenus() {
  projectNavs.forEach((projectNav) => setProjectMenuOpen(projectNav, false));
}

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
  const menu = projectNav.querySelector(".nav-projects-menu");
  const menuLinks = Array.from(menu?.querySelectorAll("a") || []);

  if (!(trigger instanceof HTMLButtonElement) || !menu) return;

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = !projectNav.classList.contains("is-open");
    closeProjectMenus();
    setProjectMenuOpen(projectNav, willOpen);
  });

  trigger.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown") return;
    event.preventDefault();
    closeProjectMenus();
    setProjectMenuOpen(projectNav, true);
    menuLinks[0]?.focus();
  });

  projectNav.addEventListener("focusout", () => {
    window.requestAnimationFrame(() => {
      if (!projectNav.contains(document.activeElement)) setProjectMenuOpen(projectNav, false);
    });
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

  const openProjectTrigger = document.querySelector(".nav-projects.is-open .nav-projects-trigger");
  if (openProjectTrigger instanceof HTMLButtonElement) {
    closeProjectMenus();
    openProjectTrigger.focus();
    return;
  }

  const wasOpen = menuButton?.getAttribute("aria-expanded") === "true";
  setMobileMenuOpen(false);
  if (wasOpen) menuButton?.focus();
});

const copyEmailButton = document.querySelector("[data-copy-email]");
const copyEmailStatus = document.querySelector("[data-copy-email-status]");

if (copyEmailButton instanceof HTMLButtonElement) {
  copyEmailButton.addEventListener("click", async () => {
    const email = copyEmailButton.dataset.email || "";
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      copyEmailButton.textContent = "Email Copied";
      if (copyEmailStatus) copyEmailStatus.textContent = `${email} copied to clipboard.`;
      window.setTimeout(() => {
        copyEmailButton.textContent = "Copy Email";
      }, 2200);
    } catch {
      if (copyEmailStatus) copyEmailStatus.textContent = `Copy failed. Email: ${email}`;
    }
  });
}

const carousels = document.querySelectorAll("[data-carousel]");

carousels.forEach((carousel) => {
  const image = carousel.querySelector("[data-carousel-image]");
  const imageLink = carousel.querySelector("[data-carousel-link]");
  const controlScope = carousel.getAttribute("data-carousel-controls-scope") === "card"
    ? carousel.closest(".melody-system-detail-card") || carousel
    : carousel;
  const controls = controlScope.querySelector(".carousel-controls");
  const previousButton = controlScope.querySelector("[data-carousel-prev]");
  const nextButton = controlScope.querySelector("[data-carousel-next]");
  const directButtons = Array.from(controlScope.querySelectorAll("[data-carousel-index]"));
  const currentLabel = controlScope.querySelector("[data-carousel-current]");
  const totalLabel = controlScope.querySelector("[data-carousel-total]");
  const statusLabel = currentLabel?.closest(".carousel-status");
  const directStatus = controlScope.querySelector("[data-carousel-status]");
  const autoplayDelay = Number.parseInt(carousel.getAttribute("data-carousel-autoplay") || "0", 10);
  const slides = (carousel.getAttribute("data-slides") || "")
    .split(";")
    .map((item) => {
      const [src, alt, position, href] = item.split("|");
      return { src, alt, position, href };
    })
    .filter((slide) => slide.src && slide.alt);

  const hasDirectionalControls = Boolean(previousButton && nextButton);
  if (!image || slides.length === 0 || (!hasDirectionalControls && directButtons.length === 0)) return;

  if (controls) controls.hidden = false;

  let activeIndex = 0;
  let autoplayTimer;

  const renderSlide = (animate = false) => {
    const slide = slides[activeIndex];
    if (animate) carousel.classList.add("is-changing");
    else carousel.classList.remove("is-changing");
    image.src = slide.src;
    image.alt = slide.alt;
    carousel.style.setProperty("--carousel-position", slide.position || "50% 50%");

    if (imageLink) {
      imageLink.href = slide.href || slide.src;
      const newTabSuffix = imageLink.target === "_blank" ? " in a new tab" : "";
      imageLink.setAttribute("aria-label", `Open ${slide.alt} at full size${newTabSuffix}`);
    }

    if (currentLabel) currentLabel.textContent = String(activeIndex + 1);
    if (totalLabel) totalLabel.textContent = String(slides.length);
    if (statusLabel) statusLabel.setAttribute("aria-label", `Slide ${activeIndex + 1} of ${slides.length}`);
    directButtons.forEach((button) => {
      const buttonIndex = Number.parseInt(button.getAttribute("data-carousel-index") || "-1", 10);
      button.setAttribute("aria-pressed", String(buttonIndex === activeIndex));
    });
    if (directStatus && animate) {
      const activeButton = directButtons.find((button) => Number.parseInt(button.getAttribute("data-carousel-index") || "-1", 10) === activeIndex);
      const activeLabel = activeButton?.textContent?.trim() || slide.alt;
      directStatus.textContent = `${activeLabel} shown. View ${activeIndex + 1} of ${slides.length}.`;
    }

    if (animate) window.setTimeout(() => carousel.classList.remove("is-changing"), 180);
  };

  const showSlide = (direction) => {
    activeIndex = (activeIndex + direction + slides.length) % slides.length;
    renderSlide(true);
  };

  const stopAutoplay = () => {
    if (!autoplayTimer) return;
    window.clearInterval(autoplayTimer);
    autoplayTimer = undefined;
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (autoplayDelay < 1000 || slides.length < 2 || reduceMotion.matches || document.hidden) return;
    autoplayTimer = window.setInterval(() => showSlide(1), autoplayDelay);
  };

  const showManualSlide = (direction) => {
    showSlide(direction);
    startAutoplay();
  };

  previousButton?.addEventListener("click", () => showManualSlide(-1));
  nextButton?.addEventListener("click", () => showManualSlide(1));
  directButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const requestedIndex = Number.parseInt(button.getAttribute("data-carousel-index") || "-1", 10);
      if (requestedIndex < 0 || requestedIndex >= slides.length || requestedIndex === activeIndex) return;
      activeIndex = requestedIndex;
      renderSlide(true);
      startAutoplay();
    });
  });
  carousel.addEventListener("pointerenter", stopAutoplay);
  carousel.addEventListener("pointerleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", () => {
    window.setTimeout(() => {
      if (!carousel.contains(document.activeElement)) startAutoplay();
    }, 0);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });
  renderSlide();
  startAutoplay();
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

});

const linkedContentCards = document.querySelectorAll("[data-card-link]");

linkedContentCards.forEach((card) => {
  const primaryLink = card.querySelector("a[href]");
  if (!(primaryLink instanceof HTMLAnchorElement)) return;

  const openCard = () => primaryLink.click();

  card.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) return;
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
  const frameLink = viewer?.querySelector("[data-video-frame-link]");
  const frameLinkLabel = viewer?.querySelector("[data-video-frame-link-label]");
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
      if (youtubeSrc) youtubeLink.href = youtubeSrc;
      else youtubeLink.removeAttribute("href");
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
      if (linkSrc) fileLink.href = linkSrc;
      else fileLink.removeAttribute("href");
      fileLink.textContent = linkLabel;
      fileLink.hidden = !linkSrc;
    }

    if (frameLink) {
      const directLinkSrc = selector.getAttribute("data-video-link") || "";
      const frameLinkSrc = directLinkSrc || youtubeSrc;
      const frameLabel = directLinkSrc
        ? (selector.getAttribute("data-video-link-label") || "Open linked work ↗")
        : "Watch on YouTube ↗";
      const selectedTitle = selector.getAttribute("data-video-title") || "selected work";
      if (frameLinkSrc) frameLink.href = frameLinkSrc;
      else frameLink.removeAttribute("href");
      frameLink.setAttribute("aria-label", `${frameLabel.replace("↗", "").trim()}: ${selectedTitle}`);
      frameLink.hidden = !frameLinkSrc;
      if (frameLinkLabel) {
        frameLinkLabel.textContent = frameLabel;
        frameLinkLabel.hidden = !directLinkSrc;
      }
      frame?.classList.toggle("has-clickable-media", Boolean(frameLinkSrc));
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

  const syncVideoBrowserUrl = (category, selector = null) => {
    const url = new URL(window.location.href);
    const categoryId = category?.getAttribute("data-video-category");
    const itemId = selector?.getAttribute("data-video-item");
    if (categoryId) url.searchParams.set("category", categoryId);
    else url.searchParams.delete("category");
    if (itemId) url.searchParams.set("item", itemId);
    else url.searchParams.delete("item");
    window.history.replaceState(null, "", url.toString());
  };

  const activateCategory = (category, shouldFocus = false, shouldSyncUrl = true) => {
    const target = category.getAttribute("data-video-category");
    categories.forEach((item) => {
      const isActive = item === category;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
      item.setAttribute("tabindex", isActive ? "0" : "-1");
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
    if (shouldFocus) category.focus();
    if (shouldSyncUrl) syncVideoBrowserUrl(category);
  };

  categories.forEach((category, index) => {
    const isActive = category.classList.contains("is-active");
    category.setAttribute("aria-selected", String(isActive));
    category.setAttribute("tabindex", isActive ? "0" : "-1");
    category.addEventListener("click", () => activateCategory(category));
    category.addEventListener("keydown", (event) => {
      let targetIndex = index;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") targetIndex = (index + 1) % categories.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") targetIndex = (index - 1 + categories.length) % categories.length;
      else if (event.key === "Home") targetIndex = 0;
      else if (event.key === "End") targetIndex = categories.length - 1;
      else return;

      event.preventDefault();
      const nextCategory = categories[targetIndex];
      activateCategory(nextCategory, true);
      nextCategory.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "nearest", inline: "nearest" });
    });
  });

  selectors.forEach((selector) => {
    selector.addEventListener("click", () => {
      updateVideo(selector);
      const containingPanel = selector.closest("[data-video-panel]");
      const containingCategory = containingPanel
        ? browser.querySelector(`[aria-controls="${containingPanel.id}"]`)
        : null;
      syncVideoBrowserUrl(containingCategory, selector);
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
  const initialUrl = new URL(window.location.href);
  const requestedCategoryId = initialUrl.searchParams.get("category");
  const requestedItemId = initialUrl.searchParams.get("item");
  const requestedCategory = Array.from(categories)
    .find((category) => category.getAttribute("data-video-category") === requestedCategoryId);
  const requestedItem = requestedItemId
    ? browser.querySelector(`[data-video-item="${requestedItemId}"]`)
    : null;

  if (requestedCategory) {
    activateCategory(requestedCategory, false, false);
    const requestedPanelId = requestedCategory.getAttribute("aria-controls");
    if (requestedItem?.closest("[data-video-panel]")?.id === requestedPanelId) updateVideo(requestedItem);
  } else {
    const activePanel = browser.querySelector("[data-video-panel].is-active");
    const initialSelector = activePanel?.querySelector(".video-select.is-active")
      || activePanel?.querySelector('[data-video-featured="true"]')
      || activePanel?.querySelector(".video-select");
    if (initialSelector) updateVideo(initialSelector);
    else updatePlayToggleLabel();
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

  const selectedWorkGuide = nav.closest(".selected-work-section-guide");
  const caseEndBoundary = document.querySelector(".engineering-case-next");

  const updateSelectedWorkGuideVisibility = () => {
    if (!selectedWorkGuide) return;

    const firstSectionRect = sectionPairs[0].section.getBoundingClientRect();
    const lastSectionRect = sectionPairs[sectionPairs.length - 1].section.getBoundingClientRect();
    const caseEndRect = caseEndBoundary?.getBoundingClientRect();
    const entryLine = Math.min(window.innerHeight * 0.8, window.innerHeight - 96);
    const hasNotReachedCaseEnd = caseEndRect
      ? caseEndRect.top > window.innerHeight - 96
      : lastSectionRect.bottom > 120;
    const isVisible = firstSectionRect.top <= entryLine && hasNotReachedCaseEnd;

    selectedWorkGuide.classList.toggle("is-visible", isVisible);
    selectedWorkGuide.toggleAttribute("inert", !isVisible);
    selectedWorkGuide.setAttribute("aria-hidden", String(!isVisible));

    if (!isVisible && nav.classList.contains("is-open")) {
      setNavOpen(false);
    }
  };

  const setActiveSection = (id) => {
    sectionPairs.forEach(({ link, section }) => {
      const isActive = section.id === id;
      const wasActive = link.classList.contains("is-active");
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
        if (!wasActive && nav.classList.contains("selected-work-section-nav") && nav.clientWidth > 0) {
          const centeredPosition = link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2;
          nav.scrollTo({ left: Math.max(0, centeredPosition), behavior: "smooth" });
        }
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
  let caseStudyNavFrame;
  const updateCaseStudyNav = () => {
    if (caseStudyNavFrame !== undefined) return;
    caseStudyNavFrame = window.requestAnimationFrame(() => {
      caseStudyNavFrame = undefined;
      updateActiveSection();
      updateSelectedWorkGuideVisibility();
    });
  };

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
    const isSelectedWorkGuide = nav.classList.contains("selected-work-section-nav");
    if ((!isDesktopNav() && !isSelectedWorkGuide) || !nav.classList.contains("is-open")) return;
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
      if (nav.classList.contains("selected-work-section-nav")) {
        setNavOpen(false);
      }
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

(() => {
  const measurementId = "G-092RCZHXES";
  const consentStorageKey = "jz-analytics-consent-v1";
  let analyticsEnabled = false;
  let analyticsLoaded = false;
  let sectionTrackingStarted = false;

  const readConsent = () => {
    try {
      return window.localStorage.getItem(consentStorageKey);
    } catch (_error) {
      return null;
    }
  };

  const saveConsent = (value) => {
    try {
      window.localStorage.setItem(consentStorageKey, value);
    } catch (_error) {
      // The choice still applies for the current page when storage is unavailable.
    }
  };

  const clearAnalyticsCookies = () => {
    const cookieNames = document.cookie
      .split(";")
      .map((cookie) => cookie.split("=")[0].trim())
      .filter((name) => name === "_ga" || name.startsWith("_ga_"));

    cookieNames.forEach((name) => {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.zhoujinyang.com; SameSite=Lax`;
    });
  };

  const getPageName = () => {
    const fileName = window.location.pathname.split("/").filter(Boolean).pop() || "home";
    return fileName.replace(/\.html$/i, "").replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "home";
  };

  const getSectionName = (section, index) => {
    const explicitName = section.getAttribute("data-analytics-section");
    if (explicitName) return explicitName;

    const sourceName = section.id
      || section.getAttribute("aria-labelledby")
      || Array.from(section.classList).find((className) => className !== "section-pad")
      || `section_${index + 1}`;
    const normalizedName = sourceName
      .replace(/[^a-z0-9]+/gi, "_")
      .replace(/^_|_$/g, "")
      .toLowerCase();
    return `${getPageName()}_${normalizedName}`.slice(0, 80);
  };

  const startSectionTracking = () => {
    if (sectionTrackingStarted || !analyticsEnabled || !("IntersectionObserver" in window)) return;
    sectionTrackingStarted = true;

    const explicitSections = Array.from(document.querySelectorAll("[data-analytics-section]"));
    const fallbackSections = Array.from(document.querySelectorAll("main > section"))
      .filter((section) => !section.matches("[data-analytics-section]") && !section.querySelector("[data-analytics-section]"));
    const sections = Array.from(new Set([...explicitSections, ...fallbackSections]));
    const viewedSections = new Set();
    const exposureTimers = new Map();

    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        const section = entry.target;
        const sectionIndex = sections.indexOf(section);
        const sectionName = getSectionName(section, sectionIndex);
        const visibleHeightNeeded = Math.min(entry.boundingClientRect.height * 0.5, window.innerHeight * 0.5);
        const isMeaningfullyVisible = entry.isIntersecting && entry.intersectionRect.height >= visibleHeightNeeded;

        if (!isMeaningfullyVisible) {
          window.clearTimeout(exposureTimers.get(section));
          exposureTimers.delete(section);
          return;
        }

        if (viewedSections.has(sectionName) || exposureTimers.has(section)) return;

        const timer = window.setTimeout(() => {
          exposureTimers.delete(section);
          if (!analyticsEnabled || viewedSections.has(sectionName)) return;

          viewedSections.add(sectionName);
          window.gtag?.("event", "section_view", {
            section_name: sectionName,
            section_position: sectionIndex + 1,
            page_path: window.location.pathname,
          });
          observer.unobserve(section);
        }, 1000);

        exposureTimers.set(section, timer);
      });
    }, { threshold: [0, 0.1, 0.25, 0.5, 0.75] });

    sections.forEach((section) => sectionObserver.observe(section));
  };

  const loadGoogleAnalytics = () => {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    analyticsEnabled = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted",
    });
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    const googleTag = document.createElement("script");
    googleTag.async = true;
    googleTag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    googleTag.dataset.portfolioAnalytics = "true";
    document.head.append(googleTag);
    startSectionTracking();
  };

  const removeConsentPanel = () => {
    const panel = document.querySelector("[data-privacy-consent-panel]");
    if (!panel) return;
    panel.classList.add("is-closing");
    window.setTimeout(() => panel.remove(), reduceMotion.matches ? 0 : 160);
  };

  const showConsentPanel = ({ allowClose = false } = {}) => {
    document.querySelector("[data-privacy-consent-panel]")?.remove();
    const currentChoice = readConsent();
    const panel = document.createElement("section");
    panel.className = "privacy-consent-panel";
    panel.dataset.privacyConsentPanel = "true";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-labelledby", "privacy-consent-title");
    panel.setAttribute("aria-describedby", "privacy-consent-description");

    panel.innerHTML = `
      <div class="privacy-consent-copy">
        <p class="privacy-consent-eyebrow">Privacy choice</p>
        <h2 id="privacy-consent-title">Help improve this portfolio</h2>
        <p id="privacy-consent-description">With your permission, Google Analytics measures visits and which portfolio sections are viewed. Analytics stays off unless you allow it.</p>
        <a href="privacy.html">Read the privacy notice</a>
      </div>
      <div class="privacy-consent-actions">
        <button class="privacy-consent-button privacy-consent-button-secondary" type="button" data-consent-choice="declined">Decline</button>
        <button class="privacy-consent-button privacy-consent-button-primary" type="button" data-consent-choice="accepted">Allow analytics</button>
      </div>
      ${allowClose ? '<button class="privacy-consent-close" type="button" aria-label="Close privacy settings">×</button>' : ""}
      ${currentChoice ? `<p class="privacy-consent-status">Current choice: ${currentChoice === "accepted" ? "analytics allowed" : "analytics declined"}</p>` : ""}
    `;

    panel.querySelector('[data-consent-choice="accepted"]')?.addEventListener("click", () => {
      saveConsent("accepted");
      removeConsentPanel();
      loadGoogleAnalytics();
    });

    panel.querySelector('[data-consent-choice="declined"]')?.addEventListener("click", () => {
      const shouldReload = analyticsLoaded;
      saveConsent("declined");
      analyticsEnabled = false;
      window.gtag?.("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
      });
      clearAnalyticsCookies();
      removeConsentPanel();
      if (shouldReload) window.setTimeout(() => window.location.reload(), 180);
    });

    panel.querySelector(".privacy-consent-close")?.addEventListener("click", removeConsentPanel);
    document.body.append(panel);
  };

  const addPrivacyFooterLinks = () => {
    document.querySelectorAll(".site-footer").forEach((footer) => {
      if (footer.querySelector("[data-privacy-footer-links]")) return;
      const links = document.createElement("span");
      links.className = "privacy-footer-links";
      links.dataset.privacyFooterLinks = "true";
      links.innerHTML = '<a href="privacy.html">Privacy</a><button type="button">Analytics settings</button>';
      links.querySelector("button")?.addEventListener("click", () => showConsentPanel({ allowClose: true }));
      footer.append(links);
    });
  };

  addPrivacyFooterLinks();
  if (readConsent() === "accepted") loadGoogleAnalytics();
  else if (readConsent() === null) showConsentPanel();
})();
