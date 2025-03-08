
import {
  addToCart,
  fixImagePath,
  calculateDiscountPercentage,
  clearSearch,
  setupPagination,
} from "./main.js";

export function displayBackpackProducts(products, pagination, isSearchResult = false) {
  const productList = document.querySelector(".product-list");

  if (!productList) {
    console.error("Product list element not found!");
    return;
  }

  productList.innerHTML = "";

  if (isSearchResult) {
    const searchResultsHeader = document.createElement("div");
    searchResultsHeader.classList.add("search-results-header");
    searchResultsHeader.innerHTML = `
      <h2>Search Results (${products.length} items found)</h2>
      <button id="clear-search">Clear Search</button>
    `;
    productList.insertAdjacentElement("beforebegin", searchResultsHeader);

    document
      .getElementById("clear-search")
      .addEventListener("click", clearSearch);
  }

  products.forEach((product) => {
    const productCard = document.createElement("li");
    productCard.classList.add("product-card");

    const discountPercentage = calculateDiscountPercentage(
      product.SuggestedRetailPrice,
      product.FinalPrice,
    );

    productCard.innerHTML = `
    <a href="../product_pages/backpacks-product-detail.html?product=${product.Id}">
      <img src="${fixImagePath(product.Images.PrimaryMedium)}" alt="${product.Name}" />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <div class="product-card__price-container">
        <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>
        ${
          discountPercentage > 0
            ? `
          <p class="product-card__msrp">MSRP: $${product.SuggestedRetailPrice.toFixed(2)}</p>
          <p class="product-card__discount">Saves ${discountPercentage}% </p>
        `
            : ""
        }
      </div>
    </a>
    <button class="quick-view-button" data-id="${product.Id}">Quick View</button>
  `;
    productList.appendChild(productCard);
  });

// Add event listeners for "Quick View" buttons
document.querySelectorAll(".quick-view-button").forEach((button) => {
  button.addEventListener("click", (event) => {
    console.log("Quick View button clicked"); 
    const productId = event.target.dataset.id;
    console.log("Product ID:", productId);
    showQuickViewModal(productId); 
  });
});

  setupPagination(pagination, productList);
}