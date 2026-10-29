(function () {
  "use strict";

  const slugFromCard = (card) => {
    const link = card.querySelector('a[href^="#detail-"]');
    return link ? link.getAttribute("href").slice("#detail-".length) : null;
  };

  function make(tag, className, value) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (value !== undefined && value !== null) element.textContent = value;
    return element;
  }

  function appendHtml(parent, className, html) {
    if (!html) return;
    const wrapper = make("div", className);
    wrapper.innerHTML = html;
    parent.append(wrapper);
  }

  function renderProjectDetail(article, project) {
    article.replaceChildren();

    const left = make("div", "");
    left.append(make("div", "detail-meta", project.detailEyebrow || ""));
    left.append(make("h3", "", project.title || ""));

    const copy = make("div", "detail-copy");
    if (project.detailLead) copy.append(make("p", "detail-lead", project.detailLead));

    if (Array.isArray(project.gallery) && project.gallery.length) {
      const gallery = make("div", "detail-gallery" + (project.gallery.length === 1 ? " single-image" : ""));
      project.gallery.forEach((item) => {
        const figure = make("figure", project.slug === "teapot" && item.image && item.image.endsWith("/tea_pot00.jpg") ? "teapot-use-image" : "");
        const img = make("img", "");
        img.src = item.image || "";
        img.alt = item.alt || item.caption || project.title || "";
        img.loading = "lazy";
        figure.append(img);
        if (item.caption) figure.append(make("figcaption", "", item.caption));
        gallery.append(figure);
      });
      copy.append(gallery);
    }

    const sections = Array.isArray(project.detailSections) ? project.detailSections : [];
    sections.forEach((section, index) => {
      const wrapper = make("section", "detail-text-section");
      if (section.heading) wrapper.append(make("h4", "", section.heading));
      if (section.body) wrapper.append(make("p", "", section.body));
      if (section.heading || section.body) copy.append(wrapper);
      if (section.imageAfter) {
        const item = section.imageAfter;
        const figure = make("figure", item.className || "");
        const img = make("img", "");
        img.src = item.image || "";
        img.alt = item.alt || item.caption || project.title || "";
        img.loading = "lazy";
        figure.append(img);
        if (item.caption) figure.append(make("figcaption", "", item.caption));
        copy.append(figure);
      }

      // The mobility model belongs directly after the project's approach section.
      if (project.diagramHtml && index === 1) appendHtml(copy, "detail-diagram-content", project.diagramHtml);
    });
    if (project.diagramHtml && sections.length < 2) appendHtml(copy, "detail-diagram-content", project.diagramHtml);

    appendHtml(copy, "detail-custom-content", project.customHtml);

    if (Array.isArray(project.resources) && project.resources.length) {
      const resources = make("div", "detail-resources");
      project.resources.forEach((resource) => {
        const link = make("a", "project-more", resource.label || resource.url || "Link öffnen");
        link.href = resource.url || "#";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        resources.append(link);
      });
      copy.append(resources);
    }

    if (project.embedUrl) {
      const embed = make("div", "digital-portfolio-embed");
      const frame = make("iframe", "digital-portfolio-frame");
      frame.src = project.embedUrl;
      frame.title = project.embedTitle || project.title || "Eingebetteter Projektinhalt";
      frame.loading = "lazy";
      frame.allowFullscreen = true;
      embed.append(frame);
      copy.append(embed);

      const fallback = make("p", "digital-portfolio-fallback");
      fallback.append(document.createTextNode("Falls die Einbettung nicht angezeigt wird: "));
      const link = make("a", "", "Digitales Portfolio direkt öffnen ↗");
      link.href = project.embedUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      fallback.append(link);
      copy.append(fallback);
      copy.append(make("p", "digital-portfolio-note", "Interaktives Portfolio · ursprüngliche Flash-Präsentation"));
    }

    article.append(left, copy);
  }

  fetch("content/projects.json")
    .then((response) => {
      if (!response.ok) throw new Error("Projektinhalte konnten nicht geladen werden.");
      return response.json();
    })
    .then((projects) => {
      if (!Array.isArray(projects)) throw new Error("Projektinhalte haben ein ungültiges Format.");
      const bySlug = new Map();
      for (const project of projects) {
        if (!project || typeof project.slug !== "string" || !project.slug) throw new Error("Ein Projekt hat keine gültige Projektkennung.");
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

      document.querySelectorAll(".project-detail[id^='detail-']").forEach((article) => {
        const project = bySlug.get(article.id.slice("detail-".length));
        if (!project) {
          console.warn("Portfolio CMS: Keine Projektdaten für Detailseite", article.id);
          return;
        }
        renderProjectDetail(article, project);
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
