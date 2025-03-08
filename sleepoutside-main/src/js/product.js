
import { setLocalStorage, getLocalStorage, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import { updateCartCount, addCartListener } from "./cartCount.js";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
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
  updateCartCount();
  alert("Item added to cart successfully!");
}

function calculateDiscount(suggestedRetailPrice, finalPrice) {
  return suggestedRetailPrice - finalPrice;
}

async function renderProductDetails(productId) {
  const product = await dataSource.findProductById(productId);
  document.querySelector(".tents-product-detail").innerHTML = productTemplate(product);
  document.getElementById("addToCart").addEventListener("click", () => addProductToCart(product));
}

function productTemplate(product) {
  const discount = calculateDiscount(product.SuggestedRetailPrice, product.FinalPrice);
  const discountPercentage = (discount / product.SuggestedRetailPrice) * 100;

  return `
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img
      class=""
      src="${product.Image}"
      alt="${product.NameWithoutBrand}"
    />
    <div class="tents-product-card__price-container">
      <p class="tents-product-card__price">$${product.FinalPrice.toFixed(2)}</p>
      <p class="tents-product-card__suggested-price">MSRP: $${product.SuggestedRetailPrice.toFixed(2)}</p>
      ${
        discount > 0
          ? `
        <p class="tents-product-card__discount">
          You save: $${discount.toFixed(2)} (${discountPercentage.toFixed(0)}% off)
        </p>
      `
          : ""
      }
    </div>
    <p class="tents-product__color">${product.Colors[0].ColorName}</p>
    <p class="tents-product__description">
    ${product.DescriptionHtmlSimple}
    </p>
    <div class="tents-product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>`;
}

const productId = getParam("product");
renderProductDetails(productId);

addCartListener(updateCartCount);