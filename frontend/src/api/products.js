import { products } from "../data/products";

export async function getProducts() {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return products;
}

export async function getFeaturedProducts() {
  const all = await getProducts();
  return all.filter((product) => product.featured);
}

export async function getProductById(id) {
  const all = await getProducts();
  return all.find((product) => product.id === id);
}

