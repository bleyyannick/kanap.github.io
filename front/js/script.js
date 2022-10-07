// Fetching all products from the Backend API
const getProducts = async () => {
  const fetchProducts = await fetch(`http://localhost:3000/api/products`).then(
    (response) => {
      if (response.ok) {
        return response.json();
      }
    }
  );
  return fetchProducts;
};
// displaying products in UI
const displayProducts = (data) => {
  const container = document.getElementById("items");
  data.then((products) => {
    products.map((product) => {
      container.insertAdjacentHTML(
        "afterbegin",
        `
                 <a href="./product.html?id=${product._id}">
                     <article>
                     <img src="${product.imageUrl}" alt="${product.altTxt}">
                     <h3 class="productName">${product.name}</h3>
                     <p class="productDescription">${product.description}</p>
                     </article>
                 </a>
                 `
      );
    });
  });
};
const products = getProducts();
displayProducts(products);
