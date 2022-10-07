// Fetching data from the Backend API

// fetch all products
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
const displayProducts = (products) => {
  const container = document.getElementById("items");
  products.then((data) => {
    data.map((product) => {
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
