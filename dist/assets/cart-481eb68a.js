import{g as c,r as t,l as e}from"./utils-7cbb752c.js";function s(){const a=c("so-cart"),r=document.querySelector(".product-list");t(o,r,a)}function o(a){return`<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${a.Images.PrimaryMedium}"
      alt="${a.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${a.Name}</h2>
  </a>
  <p class="cart-card__color">${a.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${a.FinalPrice}</p>
</li>`}e();s();
