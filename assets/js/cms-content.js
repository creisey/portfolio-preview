(function () {
  "use strict";

  const slugFromCard = (card) => {
    const link = card.querySelector('a[href^="#detail-"]');
    return link ? link.getAttribute("href").slice("#detail-".length) : null;
  };

  fetch("content/projects.json")
    .then((response) => {
      if (!response.ok) throw new Error("Projektinhalte konnten nicht geladen werden.");
      return response.json();
    })
    .then((projects) => {
      if (!Array.isArray(projects)) throw new Error("Projektinhalte haben ein ungültiges Format.");

      const bySlug = new Map();
      for (const project of projects) {
        if (!project || typeof project.slug !== "string" || !project.slug) {
          throw new Error("Ein Projekt hat keine gültige Projektkennung.");
        }
        if (bySlug.has(project.slug)) throw new Error("Doppelte Projektkennung: " + project.slug);
        bySlug.set(project.slug, project);
      }

      document.querySelectorAll("#projekte .project").forEach((card) => {
        const slug = slugFromCard(card);
        const project = bySlug.get(slug);
        if (!project) {
          console.warn("Portfolio CMS: Keine Projektdaten für Karte", slug);
          return;
        }

        const title = card.querySelector("h3");
        const description = card.querySelector(".project-meta p");
        const category = card.querySelector(".category");
        const label = card.querySelector(".media-label");
        const image = card.querySelector(".project-media img");

        if (title) title.textContent = project.title || "";
        if (description) description.textContent = project.description || "";
        if (category) category.textContent = project.category || "";
        if (label) label.textContent = project.label || "";
        if (image) {
          if (project.image) image.src = project.image;
          image.alt = project.alt || project.title || "";
        }

        const detailLink = card.querySelector(".project-more");
        if (detailLink) detailLink.setAttribute("aria-label", "Projekt und Prozess ansehen: " + (project.title || ""));
        const cardLink = card.querySelector('a[href^="#detail-"]');
        if (cardLink) cardLink.setAttribute("aria-label", "Details zu " + (project.title || ""));
      });

      // Detailseiten behalten ihre redaktionellen Texte und Galerien.
      // Nur der Titel wird aus derselben Quelle wie die Projektkarte synchronisiert.
      document.querySelectorAll(".project-detail[id^='detail-']").forEach((detail) => {
        const slug = detail.id.slice("detail-".length);
        const project = bySlug.get(slug);
        if (!project) {
          console.warn("Portfolio CMS: Keine Projektdaten für Detailseite", slug);
          return;
        }
        const title = detail.querySelector("h3");
        if (title) title.textContent = project.title || "";
      });
    })
    .catch((error) => console.error("Portfolio CMS:", error));

  fetch("content/homepage.json")
    .then((response) => {
      if (!response.ok) throw new Error("Homepage-Inhalte konnten nicht geladen werden.");
      return response.json();
    })
    .then((content) => {
      if (!content || typeof content !== "object" || Array.isArray(content)) throw new Error("Homepage-Inhalte haben ein ungültiges Format.");
      document.querySelectorAll("[data-cms-home]").forEach((element) => {
        const key = element.getAttribute("data-cms-home");
        if (Object.prototype.hasOwnProperty.call(content, key) && typeof content[key] === "string") element.textContent = content[key];
      });
    })
    .catch((error) => console.error("Portfolio CMS Homepage:", error));
})();
