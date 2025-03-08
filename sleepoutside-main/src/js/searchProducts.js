
import BackpackData from "./BackpackData.mjs";
import SleepingBagData from "./SleepingBagData.mjs";
import { displayBackpackProducts } from "./renderBackpackProducts.js";
import { displaySleepingBagProducts } from "./renderSleepingBagProducts.js";

export async function initializeSearch(productType) {
  let dataSource, displayFunction;

  if (productType === "backpack") {
    dataSource = new BackpackData();
    displayFunction = displayBackpackProducts;
  } else if (productType === "sleepingbag") {
    dataSource = new SleepingBagData();
    displayFunction = displaySleepingBagProducts;
  } else {
    console.error(`Invalid product type: ${productType}`);
    return;
  }

  document.addEventListener("submit", async (e) => {
    if (e.target.id === "search-form") {
      e.preventDefault();
      const searchInput = document.getElementById("search-input");
      const query = searchInput.value.trim();

      if (query) {
        try {
          const searchResults = await dataSource.searchProducts(query);
          displayFunction(searchResults, null, true);
        } catch (error) {
          console.error(`Error during ${productType} search:`, error);
        }
      }
    }
  });
}
