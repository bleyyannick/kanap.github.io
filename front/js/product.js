/* 

*/

// fetch id of a product in url parameters
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const cart = JSON.parse(localStorage.getItem("cart")) || []; // a la place recupere ton panier

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

const colorProductTextHTML = (colorProduct) =>
  `<option value="${colorProduct}">${colorProduct}</option>`;

cartButton.addEventListener("click", () => {
  // la quantité de canapés
  const quantityProduct = parseInt(inputQuantity.value);

  // si on a selectionné une couleur, que le produit est entre 1 et 100
  // on crée un produit et on l'ajoute au panier
  // question : et s'il y a déjà un canapé du même type dans le panier ?
  if (selectColor.value && quantityProduct > 0 && quantityProduct < 100) {
    const colorArticle = selectColor.value;
    let quantityArticle = parseInt(inputQuantity.value);
    const article = {
      id: productId,
      qty: quantityArticle,
      color: colorArticle,
    };
    const shippedArticle = cart.find(
      (art) => art.id == article.id && art.color == article.color
    );
    console.log(shippedArticle);
    if (shippedArticle) {
      shippedArticle.qty += article.qty;
    } else {
      cart.push(article);
    }
    window.localStorage.setItem("cart", JSON.stringify(cart));
  } else {
    // mettre une alerte pour dire au user
  }
});

const product = getProduct();
displayProduct(product);
