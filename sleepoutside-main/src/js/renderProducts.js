// // // Hardcoded Product IDs to Filter

// renderProducts.js
import Alert from "./Alert.js";
import { initializeSearch } from "./search.js";
import ProductData from "./ProductData.mjs";

const hardcodedProductIds = ["880RR", "985RF", "985PR", "344YJ"];

function calculateDiscountPercentage(suggestedRetailPrice, finalPrice) {
  if (finalPrice < suggestedRetailPrice) {
    const discount = suggestedRetailPrice - finalPrice;
    return Math.round((discount / suggestedRetailPrice) * 100);
  }
  return 0;
}

function fixImagePath(imagePath) {
  return imagePath.replace(/^\.\./, "");
}

function sortProducts(products, sortOption) {
  switch (sortOption) {
    case "name-asc":
      return products.sort((a, b) => a.Name.localeCompare(b.Name));
    case "name-desc":
      return products.sort((a, b) => b.Name.localeCompare(a.Name));
    case "price-asc":
      return products.sort((a, b) => a.FinalPrice - b.FinalPrice);
    case "price-desc":
      return products.sort((a, b) => b.FinalPrice - a.FinalPrice);
    default:
      return products;
  }
}

export function displayProducts(products, sortOption = "name-asc") {
  const productList = document.querySelector(".product-list");

  if (!productList) {
    console.error("Product list element not found!");
    return;
  }

  productList.innerHTML = "";

  // Filter products based on hardcoded IDs
  let filteredProducts = products.filter((product) => hardcodedProductIds.includes(product.Id));

  filteredProducts = sortProducts(filteredProducts, sortOption);
  filteredProducts.forEach((product) => {
    const productCard = document.createElement("li");
    productCard.classList.add("product-card");

    const discountPercentage = calculateDiscountPercentage(product.SuggestedRetailPrice, product.FinalPrice);

    productCard.innerHTML = `
      <a href="../product_pages/tents-product-detail.html?product=${product.Id}">
        <img src="${fixImagePath(product.Image)}" alt="${product.Name}" />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        <div class="product-card__price-container">
          <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>
          ${
            discountPercentage > 0
              ? `
            <p class="product-card__msrp">MSRP: $${product.SuggestedRetailPrice.toFixed(2)}</p>
            <p class="product-card__discount">${discountPercentage}% Off</p>
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
}

async function loadProducts() {
  try {
    const dataSource = new ProductData("tents");
    const products = await dataSource.getData();

    displayProducts(products);

    initializeSearch();

    const alertSystem = new Alert();
    await alertSystem.init();

    // Add event listener for sort dropdown
    const sortDropdown = document.getElementById("sort-options");
    if (sortDropdown) {
      sortDropdown.addEventListener("change", (event) => {
        displayProducts(products, event.target.value);
      });
    }
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

loadProducts();

