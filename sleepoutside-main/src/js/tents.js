
import { displayProducts } from "./renderProducts.js";
import ProductData from "./ProductData.mjs";
import { initializeSearch } from "./search.js";
import { setupModal, initializeQuickView } from "./tentsModal.js";

// Create a global instance of ProductData for tents
const dataSource = new ProductData("tents");
window.dataSource = dataSource; // Make it globally accessible

// function loadTents(page = 1, sortOption = "name-asc") {
//   loadProducts(displayProducts, dataSource, page, sortOption);
// }

// Initialize page, search, and sorting
// initializePage(loadTents, initializeSearch, initializeSorting);
initializeSearch("tents");

// Initialize modal and quick view functionality
setupModal();
initializeQuickView(dataSource);