// ================================================================
export function initializeSorting() {
  const sortSelect = document.getElementById("sort-options");
  if (sortSelect) {
    sortSelect.addEventListener("change", (event) => {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("sort", event.target.value);
      urlParams.set("page", 1); 
      window.location.search = urlParams.toString();
    });
  }
}

export async function loadProducts(displayFunction, dataSource, page = 1, sortOption = "name-asc") {
  const urlParams = new URLSearchParams(window.location.search);
  page = Number.parseInt(urlParams.get("page")) || page;
  sortOption = urlParams.get("sort") || sortOption;

  console.log(`Loading products for page: ${page}, sort: ${sortOption}`); 
  const { products, pagination } = await dataSource.getData(page, sortOption);

  console.log(`Fetched products:`, products); 
  console.log(`Fetched pagination:`, pagination); 

  displayFunction(products, pagination);
}

export function initializePage(loadFunction, initializeSearch, initializeSorting) {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("initializeSorting is a function:", typeof initializeSorting === "function"); 

    const urlParams = new URLSearchParams(window.location.search);
    const sortOption = urlParams.get("sort") || "name-asc";
    const sortSelect = document.getElementById("sort-options");
    if (sortSelect) sortSelect.value = sortOption;

    loadFunction();
    initializeSearch();
    initializeSorting();
  });
}





// renderBackpack and SleepingBags =================================================================
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { updateCartCount } from "./cartCount.js";

export function clearSearch() {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.delete("search");
  window.location.search = urlParams.toString();
}

export function fixImagePath(imagePath) {
  return imagePath.replace(/^\.\./, "");
}

export function calculateDiscountPercentage(msrp, finalPrice) {
  if (msrp <= 0 || finalPrice <= 0) return 0;
  return Math.round(((msrp - finalPrice) / msrp) * 100);
}

export function addToCart(event, products) {
  const productId = event.target.dataset.id;
  const product = products.find((p) => p.Id === productId);

  if (product) {
    const cart = getLocalStorage("so-cart") || [];
    const existingProductIndex = cart.findIndex((item) => item.Id === product.Id);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 1) + 1;
    } else {
      product.quantity = 1;
      cart.push(product);
    }

    setLocalStorage("so-cart", cart);
    window.dispatchEvent(new Event("cart-change"));

    alert("Item added to cart successfully!");
  } else {
    console.error("Product not found in the products list.");
  }
}






export function setupPagination(pagination, productList) {
  if (pagination) {
    // Remove existing pagination
    const existingPagination = document.querySelector(".pagination");
    if (existingPagination) {
      existingPagination.remove();
    }

    // Update the "Per page" information
    const perPageInfo = document.querySelector(".sort-container span");
    if (perPageInfo) {
      perPageInfo.innerHTML = `<h4>Per page: ${pagination.perPage} | Total: ${pagination.totalCount}</h4>`;
    }

    // Add pagination controls
    const paginationContainer = document.createElement("div");
    paginationContainer.classList.add("pagination");
    paginationContainer.innerHTML = `
      <button id="prev-page" ${pagination.currentPage === 1 ? "disabled" : ""}>Previous</button>
      <span>Page ${pagination.currentPage} of ${pagination.totalPages}</span>
      <button id="next-page" ${pagination.currentPage === pagination.totalPages ? "disabled" : ""}>Next</button>
    `;
    productList.after(paginationContainer);

    // Add event listeners for pagination buttons
    document.getElementById("prev-page").addEventListener("click", () => {
      if (pagination.currentPage > 1) {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("page", pagination.currentPage - 1);
        window.location.search = urlParams.toString();
      }
    });

    document.getElementById("next-page").addEventListener("click", () => {
      if (pagination.currentPage < pagination.totalPages) {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("page", pagination.currentPage + 1);
        window.location.search = urlParams.toString();
      }
    });
  }
}




// SORT/SEARCH PRODUCTS.js ========================================================
function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
  }
}

export class BaseData {
  constructor(category) {
    this.category = category;
    this.path = `../json/${this.category}.json`;
  }

  async getData(page = 1, sortOption = "name-asc") {
    const res = await fetch(this.path);
    const data = await convertToJson(res);
    const sortedProducts = this.sortProducts(data.Result, sortOption);
    const startIndex = (page - 1) * data.PerPage;
    const endIndex = startIndex + data.PerPage;
    return {
      products: sortedProducts.slice(startIndex, endIndex),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(data.Count / data.PerPage),
        nextPageUrl: data.NextPageUrl,
        lastPageUrl: data.LastPageUrl,
        perPage: data.PerPage,
        totalCount: data.Count,
      },
    };
  }


  sortProducts(products, sortOption) {
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

  async findProductById(id) {
    const res = await fetch(this.path);
    const data = await convertToJson(res);
    return data.Result.find((item) => item.Id === id);
  }

  async searchProducts(query) {
    const res = await fetch(this.path);
    const data = await convertToJson(res);
    const lowercaseQuery = query.toLowerCase();
    return data.Result.filter(
      (product) =>
        product.Name.toLowerCase().includes(lowercaseQuery) ||
        product.NameWithoutBrand.toLowerCase().includes(lowercaseQuery) ||
        product.Brand.Name.toLowerCase().includes(lowercaseQuery)
    );
  }
}




// PRODUCT DETAIL .JS =========================================================
export function addProductToCart(product) {
  const cart = JSON.parse(localStorage.getItem("so-cart")) || [];
  const existingProductIndex = cart.findIndex((item) => item.Id === product.Id);

  if (existingProductIndex !== -1) {
    cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 0) + product.quantity;
  } else {
    cart.push(product);
  }

  localStorage.setItem("so-cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-change"));
  updateCartCount();
  alert(`${product.quantity} item(s) added to cart successfully!`);
}

export function calculateDiscount(suggestedRetailPrice, finalPrice) {
  const discount = suggestedRetailPrice - finalPrice;
  const percentage = Math.round((discount / suggestedRetailPrice) * 100);
  return { discount, percentage };
}

export function setupImageMagnifier(imageContainer, image) {
  const magnifier = document.createElement("div");
  magnifier.className = "magnifier";
  imageContainer.appendChild(magnifier);

  imageContainer.addEventListener("mousemove", (e) => {
    const rect = imageContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const magnifierSize = 150;
    const zoomFactor = 2;

    magnifier.style.left = `${x - magnifierSize / 2}px`;
    magnifier.style.top = `${y - magnifierSize / 2}px`;

    const backgroundX = x * zoomFactor - magnifierSize / 2;
    const backgroundY = y * zoomFactor - magnifierSize / 2;
    magnifier.style.backgroundImage = `url(${image.src})`;
    magnifier.style.backgroundPosition = `-${backgroundX}px -${backgroundY}px`;
    magnifier.style.backgroundSize = `${imageContainer.offsetWidth * zoomFactor}px`;
  });

  imageContainer.addEventListener("mouseenter", () => {
    magnifier.style.display = "block";
  });

  imageContainer.addEventListener("mouseleave", () => {
    magnifier.style.display = "none";
  });
}

export function setupQuantityControls() {
  const quantityInput = document.querySelector(".quantity-input");
  const decreaseBtn = document.querySelector(".quantity-decrease");
  const increaseBtn = document.querySelector(".quantity-increase");

  decreaseBtn.addEventListener("click", () => {
    const currentValue = Number.parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });

  increaseBtn.addEventListener("click", () => {
    const currentValue = Number.parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
  });
}

export function renderProductDetails(product) {
  if (!product) {
    console.error("Product data is undefined");
    return;
  }

  const { discount, percentage } = calculateDiscount(product.SuggestedRetailPrice, product.FinalPrice);

  // Main image container
  const mainImageContainer = document.querySelector(".product-detail__main-image");
  mainImageContainer.innerHTML = `
    <img src="${product.Images?.PrimaryExtraLarge || ""}" alt="${product.Name || ""}" class="main-image" />
    <span class="zoom-hint">Click to expand</span>
  `;

  // Setup image magnifier
  const mainImage = mainImageContainer.querySelector(".main-image");
  setupImageMagnifier(mainImageContainer, mainImage);

  // Thumbnails
  const thumbnailsContainer = document.querySelector(".product-detail__thumbnails");
  thumbnailsContainer.innerHTML = `
    <img src="${product.Images?.PrimaryMedium || ""}" alt="${product.Name || ""}" class="thumbnail active" />
    ${
      product.Images?.ExtraImages?.map(
        (image) => `
      <img src="${image.Src || ""}" alt="${image.Title || ""}" class="thumbnail" />
    `
      ).join("") || ""
    }
  `;

   // Ratings and Reviews under the thumbnail
   const ratingsContainer = document.createElement("div");
   ratingsContainer.className = "product-ratings";
   ratingsContainer.innerHTML = `
   <br>
     <div class="average-rating">
       <span>Average Rating:</span>
       <div class="stars" style="--rating: ${product.Reviews?.AverageRating || 0}"></div>
       <span>(${product.Reviews?.ReviewCount || 0} Reviews)</span>
     </div>
   `;
   thumbnailsContainer.insertAdjacentElement("afterend", ratingsContainer);

  // Product info
  const productInfo = document.querySelector(".product-detail__info");
  productInfo.innerHTML = `
    <h1>${product.Name || ""}</h1>
    <p class="product-id">Item #${product.Id || ""}</p>

    <div class="product-price">
      <span class="current-price">$${(product.FinalPrice || 0).toFixed(2)}</span>
      <span class="original-price">Compare at $${(product.SuggestedRetailPrice || 0).toFixed(2)}</span>
      <span class="savings">Save ${percentage}%</span>
    </div>
    <div class="product-colors">
      <h2>Colors Available:</h2>
      <div class="color-options">
        ${
          product.Colors?.map(
            (color) => `
          <button class="color-swatch"
            data-color="${color.ColorCode || ""}"
            style="background-image: url('${color.ColorChipImageSrc || ""}')"
            title="${color.ColorName || ""}">
          </button>
        `
          ).join("") || ""
        }
      </div>
      <p class="selected-color">${product.Colors?.[0]?.ColorName || ""} (${product.Colors?.[0]?.ColorCode || ""})</p>
    </div>

    <div class="product-sizes">
      <h2>Size:</h2>
      <div class="size-options">
        ${
          product.SizesAvailable?.SIZE?.map(
            (size) => `
          <button class="size-option" data-size="${size}">${size}</button>
        `
          ).join("") || ""
        }
      </div>
    </div>

    <div class="product-quantity">
      <h2>Quantity:</h2>
      <div class="quantity-controls">
        <button class="quantity-decrease">-</button>
        <input type="number" value="1" min="1" class="quantity-input" />
        <button class="quantity-increase">+</button>
      </div>
    </div>
    <button class="add-to-cart" data-id="${product.Id || ""}">ADD TO CART</button>
  `;


  // Tabs Section
  const tabsSection = document.createElement("div");
  tabsSection.className = "tabs";
  tabsSection.innerHTML = `
    <div class="tabs-header">
      <button class="tab-button active">Overview</button>
      <button class="tab-button">Specs</button>
      <button class="tab-button">Reviews</button>
      <button class="tab-button">Brand Info</button>
    </div>
    <div class="tabs-content">
      <div class="tab-content active">
        <h3>Overview</h3>
        <p>${product.DescriptionHtmlSimple || "No overview available."}</p>
      </div>
      <div class="tab-content">
        <h3>Specifications</h3>
        <ul>
          <li><strong>Weight:</strong> ${product.Weight || "N/A"}</li>
          <li><strong>Dimensions:</strong> ${product.Dimensions || "N/A"}</li>
          <li><strong>Material:</strong> ${product.Material || "N/A"}</li>
        </ul>
      </div>

      <div class="tab-content">

        <h3>Reviews</h3>
        ${
          product.Reviews?.ReviewCount > 0
            ? `
          <div class="reviews">
            <div class="average-rating">
              <span>Average Rating:</span>
              <div class="stars" style="--rating: ${product.Reviews.AverageRating || 0}"></div>
            </div>
            <div class="review-list">
              ${product.Reviews.ReviewsUrl ? `<a href="${product.Reviews.ReviewsUrl}">View All Reviews</a>` : "No reviews available."}
            </div>
          </div>
        `
            : `<p>No reviews available.</p>`
        }


      </div>

      <div class="tab-content">
        <h3>Brand Info</h3>
        <div class="brand-info">
          <img src="${product.Brand?.LogoSrc || ""}" alt="${product.Brand?.Name || ""}" />
          <p>${product.Brand?.Name || "No brand info available."}</p>
          <a href="${product.Brand?.Url || "#"}">Visit Brand Page</a>
        </div>
      </div>
    </div>
  `;

  // Append tabs section to the product detail wrapper
  const productDetailWrapper = document.querySelector(".product-detail__wrapper");
  productDetailWrapper.appendChild(tabsSection);

  setupQuantityControls();

  // Thumbnail click handlers
  document.querySelectorAll(".thumbnail").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      mainImage.src = thumb.src.replace("~160", "~600");
      document.querySelectorAll(".thumbnail").forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
    });
  });

  // Add to cart handler
  document.querySelector(".add-to-cart").addEventListener("click", () => {
    const quantity = Number.parseInt(document.querySelector(".quantity-input").value);
    const productToAdd = { ...product, quantity: quantity };
    addProductToCart(productToAdd);
  });

  // Tab Functionality
  document.querySelectorAll(".tab-button").forEach((button, index) => {
    button.addEventListener("click", () => {

      document.querySelectorAll(".tab-button").forEach((btn) => btn.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"));

      button.classList.add("active");
      document.querySelectorAll(".tab-content")[index].classList.add("active");
    });
  });
}
