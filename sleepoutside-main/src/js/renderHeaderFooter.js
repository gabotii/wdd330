
// Breadcrums -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  const loadComponent = async (url, selector) => {
    try {
      const response = await fetch(url);
      const content = await response.text();
      document.querySelector(selector).innerHTML = content;

      if (selector === "header") {
        const { updateCartCount } = await import("./cartCount.js");
        updateCartCount();
      }
    } catch (error) {
      console.error(`Error loading ${url}:`, error);
    }
  };

  const generateBreadcrumbs = async () => {
    const path = window.location.pathname;
    const paths = path.split("/").filter(p => p);
    const breadcrumbs = document.createElement("nav");
    breadcrumbs.classList.add("breadcrumbs");

    if (paths.length > 0) {
      let breadcrumbPath = "";
      paths.forEach((p, index) => {
        breadcrumbPath += `/${p}`;
        const link = document.createElement("a");
        link.href = breadcrumbPath;
        link.textContent = p.replace(".html", "").replace(/-/g, " ");
        breadcrumbs.appendChild(link);

        if (index < paths.length - 1) {
          const separator = document.createElement("span");
          separator.textContent = " > ";
          breadcrumbs.appendChild(separator);
        }
      });

      // Fetch JSON data to get the total count of products
      if (document.querySelector(".product-list")) {
        try {
          const category = paths[paths.length - 1].replace(".html", ""); 
          const jsonFilePath = `./json/${category}.json`;

          const response = await fetch(jsonFilePath); 
          if (!response.ok) {
            throw new Error("Failed to fetch product data");
          }
          const data = await response.json();

          const countSpan = document.createElement("span");
          const itemCount = data.Count || 4; 
          countSpan.textContent = ` (${itemCount} items)`;
          breadcrumbs.appendChild(countSpan);
        } catch (error) {
          console.error("Error fetching product count:", error);

          const countSpan = document.createElement("span");
          countSpan.textContent = ` (4 items)`;
          breadcrumbs.appendChild(countSpan);
        }
      }
    }

    return breadcrumbs;
  };

  await loadComponent("../product_pages/header.html", "header");
  await loadComponent("../product_pages/footer.html", "footer");

  const main = document.querySelector("main");
  if (main && window.location.pathname !== "/index.html" && window.location.pathname !== "/") {
    const breadcrumbs = await generateBreadcrumbs(); // Await the breadcrumbs
    main.insertBefore(breadcrumbs, main.firstChild);
  }
});








