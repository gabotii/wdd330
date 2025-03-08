
import ProductData from './ProductData.mjs';

const dataSource = new ProductData('tents');
const hardcodedProductIds = ["880RR", "985RF", "985PR", "344YJ"];

function fixImagePath(imagePath) {
  return imagePath.replace(/^\.\./, '');
}

export async function performSearch(query) {
  try {
    const products = await dataSource.getData();
    const lowercaseQuery = query.toLowerCase();
    const results = [];

    for (const product of products) {
      if (
        hardcodedProductIds.includes(product.Id) && 
        (
          product.Name.toLowerCase().includes(lowercaseQuery) ||
          product.NameWithoutBrand.toLowerCase().includes(lowercaseQuery) ||
          product.Brand.Name.toLowerCase().includes(lowercaseQuery)
        )
      ) {
        results.push(product);
      }
    }

    return results;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

export function displaySearchResults(results) {
  const productList = document.querySelector('.product-list');
  if (!productList) return;

  productList.innerHTML = '';

  results.forEach(product => {
    const li = document.createElement('li');
    li.className = 'product-card';
    li.innerHTML = `
      <a href="../product_pages/product-detail.html?product=${product.Id}">
        <img src="${fixImagePath(product.Image)}" alt="${product.Name}">
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>
      </a>
    `;
    productList.appendChild(li);
  });
}

export function initializeSearch() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const searchInput = document.getElementById('search-input');
        const searchForm = document.getElementById('search-form');

        if (searchInput && searchForm) {
          observer.disconnect();

          searchInput.addEventListener('input', debounce(async (e) => {
            const query = e.target.value.trim();
            if (query) {
              const results = await performSearch(query);
              displaySearchResults(results);
            } else {
              const allProducts = await dataSource.getData();
              const filteredProducts = [];

              for (const product of allProducts) {
                if (hardcodedProductIds.includes(product.Id)) {
                  filteredProducts.push(product);
                }
              }

              displaySearchResults(filteredProducts);
            }
          }, 300));

          searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
          });
        }
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
