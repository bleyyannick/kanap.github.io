// Fetching data from the Backend API

let items = document.getElementById("items");

// fetch all products
const getAllProducts = async () => {
  const products = await fetch(`http://localhost:3000/api/products`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      data.map((product) => {
        items.insertAdjacentHTML(
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
  return products;
};
getAllProducts();
