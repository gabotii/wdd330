import{g as c}from"./productData-98a3baef.js";import{r as s}from"./utils-7cbb752c.js";function i(a){return`<li class="product-card">
    <a href="/product_pages/index.html?product=${a.Id}">
    <img
      src="${a.Images.PrimaryMedium}"
      alt="Image of ${a.Name}"
    />
    <h3 class="card__brand">${a.Brand.Name}</h3>
    <h2 class="card__name">${a.NameWithoutBrand}</h2>
    <p class="product-card__price">$${a.FinalPrice}</p></a>
  </li>`}async function m(a,e){const t=document.querySelector(a),r=await c(e);console.log(r),s(i,t,r),document.querySelector(".title").innerHTML=e}export{m as p};
