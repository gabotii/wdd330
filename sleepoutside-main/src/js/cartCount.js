// Cart Icon and Count
import { getLocalStorage, qs } from "./utils.mjs";

export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];

  const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  const cartCountElement = qs("#cart-count");
  const cartIcon = qs(".cart svg"); 

  if (cartCountElement && cartIcon) {
    cartCountElement.textContent = totalItems;
    cartCountElement.style.display = totalItems > 0 ? "flex" : "none";
    cartIcon.classList.add("cart-icon-animation");

    cartIcon.addEventListener(
      "animationend",
      () => {
        cartIcon.classList.remove("cart-icon-animation");
      },
      { once: true } 
    );

    console.log(`Cart updated: ${totalItems} items`);
  } else {
    console.warn("#cart-count or cart icon not found in the DOM");
  }
}

export function addCartListener(callback) {
  window.addEventListener("cart-change", callback);
}