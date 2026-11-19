document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".mobile-menu-toggle");
  const mobileNavigation = document.querySelector(".mobile-navigation");

  if (menuButton && mobileNavigation) {
    const setMenuOpen = (isOpen) => {
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      mobileNavigation.classList.toggle("open", isOpen);
      mobileNavigation.setAttribute("aria-hidden", String(!isOpen));
    };

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      setMenuOpen(!isOpen);
    });

    mobileNavigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) setMenuOpen(false);
    });
  }

  // The reference header remains forest green while scrolling.
  // No scroll-time color override is applied.

  const contactForm = document.querySelector("#contact-form");
  const formMessage = document.querySelector(".form-message");

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton ? submitButton.innerHTML : "";
      const formData = new FormData(contactForm);
      const senderName = String(formData.get("name") || "").trim();
      formData.set("_subject", `New project enquiry from ${senderName}`);

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending…";
      }
      if (formMessage) formMessage.textContent = "Sending your project brief…";

      try {
        const response = await fetch(
          "https://formsubmit.co/ajax/kam.design.mfg@gmail.com",
          {
            method: "POST",
            headers: { Accept: "application/json" },
            body: formData
          }
        );

        const result = await response.json();
        if (!response.ok || String(result.success).toLowerCase() === "false") {
          throw new Error(result.message || "The email service could not accept your message.");
        }

        contactForm.reset();
        if (formMessage) {
          formMessage.textContent = "Thank you — your project brief has been sent. I'll be in touch soon.";
        }
      } catch (error) {
        console.error("Contact form submission failed:", error);
        if (formMessage) {
          formMessage.textContent = "Sorry, your message could not be sent. Please email kam.design.mfg@gmail.com directly.";
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonText;
        }
      }
    });
  }
});
