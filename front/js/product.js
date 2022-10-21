/* 

*/

// fetch id of a product in url parameters
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const cart = JSON.parse(localStorage.getItem("cart")) || [];

// HTML elements
const img = document.querySelector(".item__img");
const price = document.getElementById("price");
const description = document.getElementById("description");
const selectColor = document.getElementById("colors");
const cartButton = document.getElementById("addToCart");
const inputQuantity = document.getElementById("quantity");

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

// display a product in product.html
const displayProduct = (dataPromise) => {
  dataPromise.then((product) => {
    img.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    price.innerHTML = `${product.price}`;
    description.innerHTML = `${product.description}`;
    const colorsProduct = product.colors;
    const html = colorsProduct.map((colorProduct) =>
      colorProductTextHTML(colorProduct)
    );
    selectColor.innerHTML += html.join("");
  });
};

// display colors values in colors select box
const colorProductTextHTML = (colorProduct) =>
  `<option value="${colorProduct}">${colorProduct}</option>`;

cartButton.addEventListener("click", () => {
  const quantityProduct = +inputQuantity.value;

  if (selectColor.value && quantityProduct > 0 && quantityProduct < 100) {
    const colorArticle = selectColor.value;
    const priceProduct = +price.textContent;
    let quantityArticle = +inputQuantity.value;
    const imgArticle = img.innerHTML;

    const article = {
      id: productId,
      qty: quantityArticle,
      color: colorArticle,
      price: priceProduct,
      img: imgArticle,
    };
    const shippedArticle = cart.find(
      (art) => art.id == article.id && art.color == article.color
    );
    if (shippedArticle) {
      shippedArticle.qty += article.qty;
    } else {
      cart.push(article);
      window.localStorage.setItem("cart", JSON.stringify(cart));
    }
  } else {
    // mettre une alerte pour dire au user
  }
});

const product = getProduct();
displayProduct(product);
window.localStorage.setItem("cart", JSON.stringify(cart));
