const toggleMenuBtn = document.getElementById("toggle-btn");
const body = document.querySelector("body");
if (toggleMenuBtn && body) {
  toggleMenuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    body.classList.toggle("sidebar-toggled");
  });
}

const bookmarkLinks = document.querySelectorAll(".order-bookmark-link");
const bookmarkNav = document.getElementById("order-bookmark-nav");

if (bookmarkLinks.length > 0) {
  const bookmarkSections = Array.from(bookmarkLinks)
    .map((link) => {
      const targetSelector = link.getAttribute("href");
      if (!targetSelector || !targetSelector.startsWith("#")) {
        return null;
      }

      const section = document.querySelector(targetSelector);
      if (!section) {
        return null;
      }

      return {
        link,
        section,
        id: section.id,
      };
    })
    .filter(Boolean);

  const setActiveBookmark = (targetId) => {
    bookmarkLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${targetId}`;
      link.classList.toggle("active", isActive);
      link.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  const getHeaderOffset = () => {
    const stickyHeader = document.querySelector(".main .sticky-top");
    return stickyHeader ? stickyHeader.offsetHeight : 0;
  };

  if (
    bookmarkNav &&
    typeof bootstrap !== "undefined" &&
    typeof bootstrap.ScrollSpy === "function"
  ) {
    new bootstrap.ScrollSpy(document.body, {
      target: "#order-bookmark-nav",
      offset: 90,
    });
  }

  bookmarkSections.forEach(({ link, section, id }) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const headerOffset = getHeaderOffset();
      const targetTop =
        window.pageYOffset + section.getBoundingClientRect().top - headerOffset;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
      setActiveBookmark(id);
      history.replaceState(null, "", `#${id}`);
    });
  });

  const syncActiveWithScroll = () => {
    const headerOffset = getHeaderOffset();
    const currentY = window.pageYOffset + headerOffset + 8;

    let activeId = bookmarkSections[0]?.id;
    bookmarkSections.forEach(({ section, id }) => {
      if (section.offsetTop <= currentY) {
        activeId = id;
      }
    });

    if (activeId) {
      setActiveBookmark(activeId);
    }
  };

  window.addEventListener("scroll", syncActiveWithScroll, { passive: true });
  window.addEventListener("resize", syncActiveWithScroll);
  syncActiveWithScroll();
}

// 刪除訂單 Modal
const modalByDelete = document.getElementById("deleteModal");
if (modalByDelete) {
  modalByDelete.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget;
    const orderId = button.dataset.bsOrderId;
    const deleteText = document.getElementById("deleteText");
    deleteText.textContent = orderId;
  });
}
