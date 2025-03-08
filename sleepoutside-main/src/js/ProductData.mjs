
function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`Bad Response: ${res.status}`);
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;

    const isProduction = window.location.hostname !== 'localhost' &&
                        window.location.hostname !== '127.0.0.1';

    if (isProduction) {
      this.path = `/json/${this.category}.json`;
    } else {
      const pathDepth = window.location.pathname.split('/').length - 2;
      const pathPrefix = '../'.repeat(pathDepth);
      this.path = `${pathPrefix}json/${this.category}.json`;
    }
  }

  async getData() {
    try {
      const response = await fetch(this.path);
      if (!response.ok) {
        throw new Error(`Bad Response: ${response.status}`);
      }
      return await convertToJson(response);
    } catch (error) {
      console.error(`Error fetching data from ${this.path}:`, error);
      throw error;
    }
  }

  async findProductById(id) {
    try {
      const products = await this.getData();
      const product = products.find((item) => item.Id === id);
      if (!product) {
        throw new Error(`Product not found with id: ${id}`);
      }
      return product;
    } catch (error) {
      console.error(`Error finding product ${id}:`, error);
      throw error;
    }
  }
}
