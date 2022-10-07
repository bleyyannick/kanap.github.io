// Retrieving id of the product in url parameters
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const img = document.querySelector(".item__img");
const price = document.getElementById("price");
const description = document.getElementById("description");
const colors = document.getElementById("colors");

console.log(img);
// Fetching product from backend API
const getProduct = async () => {
  const product = await fetch(
    `http://localhost:3000/api/products/${productId}`
  ).then((response) => {
    if (response.ok) {
      return response.json();
    }
  });
  return product;
};

const displayProduct = (data) => {
  data.then((product) => {
    img.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    price.innerHTML = `${product.price}`;
    description.innerHTML = `${product.description}`;
  });
};

const product = getProduct();
displayProduct(product);
