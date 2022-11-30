const URL = "http://localhost:3000/api/products";

// Fetching all products from backend API
const getProducts = async () => {
  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    const products = await response.json();
    return products;
  } catch (error) {
    alert(`Impossible d'obtenir les produits`);
  }
};
// displays all products
const displayProducts = (cartProducts) => {
  const container = document.getElementById("items");
  const html = cartProducts.map((product) => buildProductHTML(product));
  container.innerHTML = html.join("");
};
// Display every fetched product
const buildProductHTML = (
  product
) => `<a href="./product.html?id=${product._id}">
          <article>
          <img src="${product.imageUrl}" alt="${product.altTxt}">
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}</p>
          </article>
        </a>
      `;

const main = async () => {
  //wait for fetching products before displaying them
  const products = await getProducts();
  displayProducts(products);
};
main();
