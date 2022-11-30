// fetch id of a product in url parameters
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const cart = JSON.parse(localStorage.getItem("cart")) || [];

const URL = "http://localhost:3000/api/products/";

// HTML elements
const img = document.querySelector(".item__img");
const price = document.getElementById("price");
const description = document.getElementById("description");
const selectColor = document.getElementById("colors");
const cartButton = document.getElementById("addToCart");
const inputQuantity = document.getElementById("quantity");
const title = document.getElementById("title");

// Get product with his id
const getProduct = async () => {
  try {
    const response = await fetch(`${URL}${productId}`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    const product = await response.json();
    return product;
  } catch (error) {
    alert(`Impossible de récupérer le produit`);
  }
};

// Display all product information in the page
const displayProduct = (element) => {
  img.innerHTML = `<img src="${element.imageUrl}" alt="${element.altTxt}">`;
  price.innerHTML = `${element.price}`;
  description.innerHTML = `${element.description}`;
  title.innerHTML = `${element.name}`;
  const colorsProduct = element.colors;
  const html = colorsProduct.map((colorProduct) =>
    colorProductTextHTML(colorProduct)
  );
  selectColor.innerHTML += html.join("");
};

// display all avalaible product colors
const colorProductTextHTML = (colorProduct) =>
  `<option value="${colorProduct}">${colorProduct}</option>`;

cartButton.addEventListener("click", () => {
  const quantityProduct = +inputQuantity.value;

  if (selectColor.value && quantityProduct > 0 && quantityProduct < 100) {
    const colorArticle = selectColor.value;
    let quantityArticle = +inputQuantity.value;
    // Create an article
    const article = {
      id: productId,
      qty: quantityArticle,
      color: colorArticle,
    };
    // find the selected article in the cart
    const selectedArticle = cart.find(
      ({ id, color }) => id == article.id && color == article.color
    );
    // if selected article is already in the cart, just update the article quantity
    if (selectedArticle) {
      selectedArticle.qty += article.qty;
    } else {
      cart.push(article);
    }
    // update the localStorage with the cart
    localStorage.setItem("cart", JSON.stringify(cart));
  } else {
    alert(
      "Vous devez choisir entre 1 et 100 canapés et selectionner une couleur pour commander"
    );
  }
});

const main = async () => {
  const product = await getProduct();
  displayProduct(product);
};

main();
