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
  const quantityProduct = +inputQuantity.value;

  if (selectColor.value && quantityProduct > 0 && quantityProduct < 100) {
    const colorArticle = selectColor.value;
    let quantityArticle = +inputQuantity.value;

    const article = {
      id: productId,
      qty: quantityArticle,
      color: colorArticle,
    };

    const choosenArticle = cart.find(
      ({ id, color }) => id == article.id && color == article.color
    );

    if (choosenArticle) {
      choosenArticle.qty += article.qty;
    } else {
      cart.push(article);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  } else {
    alert(
      "Vous devez choisir entre 1 et 100 canapés et selectionner une couleur pour commander"
    );
  }
});

const product = getProduct();
displayProduct(product);
