
// Modal Logic
export function setupModal() {
    const modal = document.getElementById("quick-view-modal");
    const closeButton = document.querySelector(".close-button");
  
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }
  
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  }
  

  export function initializeQuickView(dataSource) {
    window.showQuickViewModal = async function (productId) {
      console.log("showQuickViewModal called with product ID:", productId);
      try {
        const product = await dataSource.findProductById(productId);
        console.log("Fetched product data:", product);
  
        if (!product) {
          console.error("Product not found");
          return;
        }
  
        const quickViewContent = document.getElementById("quick-view-content");
        quickViewContent.innerHTML = `
          <img src="${product.Image}" alt="${product.Name}" />
          <h2>${product.Name}</h2>
          <p>$${product.FinalPrice.toFixed(2)}</p>
          <p>${product.DescriptionHtmlSimple}</p>
        `;
  
        const modal = document.getElementById("quick-view-modal");
        modal.style.display = "block";
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
  }