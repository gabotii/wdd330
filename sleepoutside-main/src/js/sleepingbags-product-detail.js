
import { getParam } from "./utils.mjs"
import { renderProductDetails } from "../js/main.js"
import SleepingBagData from "./SleepingBagData.mjs"

const dataSource = new SleepingBagData()

async function init() {
  const productId = getParam("product")
  if (!productId) {
    document.querySelector(".product-detail").innerHTML = "Product not found"
    return
  }

  try {
    console.log("Fetching product with ID:", productId)
    const product = await dataSource.findProductById(productId)
    console.log("Fetched product data:", product)

    if (!product) {
      throw new Error("Product not found")
    }

    renderProductDetails(product)
  } catch (error) {
    console.error("Error loading product:", error)
    document.querySelector(".product-detail").innerHTML = `Error loading product: ${error.message}`
  }
}

init()
