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
      const bySlug = new Map(projects.map((project) => [project.slug, project]));
      document.querySelectorAll("#projekte .project").forEach((card) => {
        const project = bySlug.get(slugFromCard(card));
        if (!project) return;
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
          image.src = project.image || "";
          image.alt = project.alt || project.title || "";
        }
        const detailLink = card.querySelector(".project-more");
        if (detailLink) detailLink.setAttribute("aria-label", "Projekt und Prozess ansehen: " + (project.title || ""));
        const cardLink = card.querySelector('a[href^="#detail-"]');
        if (cardLink) cardLink.setAttribute("aria-label", "Details zu " + (project.title || ""));
      });
    })
    .catch((error) => console.error("Portfolio CMS:", error));
})();
