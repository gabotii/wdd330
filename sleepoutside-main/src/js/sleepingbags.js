
import { initializeSorting, loadProducts, initializePage } from "./main.js";
import { displaySleepingBagProducts } from "./renderSleepingBagProducts.js";
import SleepingBagData from "./SleepingBagData.mjs";
import { initializeSearch } from "./searchProducts.js";
import { setupModal, initializeQuickView } from "./sharedProductLogic.js";


const dataSource = new SleepingBagData();
window.dataSource = dataSource; 

function loadSleepingBags(page = 1, sortOption = "name-asc") {
  loadProducts(displaySleepingBagProducts, dataSource, page, sortOption);
}

initializePage(loadSleepingBags, initializeSearch, initializeSorting);
initializeSearch("sleepingbag");

setupModal();
initializeQuickView(dataSource);