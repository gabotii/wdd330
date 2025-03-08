
import { initializeSorting, loadProducts, initializePage } from "./main.js";
import { displayBackpackProducts } from "./renderBackpackProducts.js";
import BackpackData from "./BackpackData.mjs";
import { initializeSearch } from "./searchProducts.js";
import { setupModal, initializeQuickView } from "./sharedProductLogic.js";

const dataSource = new BackpackData();
window.dataSource = dataSource; 

function loadBackpacks(page = 1, sortOption = "name-asc") {
  loadProducts(displayBackpackProducts, dataSource, page, sortOption);
}

initializePage(loadBackpacks, initializeSearch, initializeSorting);
initializeSearch("backpack");

setupModal();
initializeQuickView(dataSource);