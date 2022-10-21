const temporaryCart = JSON.parse(window.localStorage.getItem("cart")) || [];
const container = document.getElementById("cart__items");
const totalQuantityProducts = document.getElementById("totalQuantity");
const totalPriceProducts = document.getElementById("totalPrice");

const numberOfProducts = temporaryCart.reduce((acc, curr) => acc + curr.qty, 0);
const displayCart = (cart) => {
  const htmlCart = cart.map((product) => buildCartHtml(product));
  container.innerHTML = htmlCart.join("");
};
const selectedProductPrice = (products) =>
  products.map(({ qty, price }) => qty * price);

const priceProducts = selectedProductPrice(temporaryCart);
const totalPrice = priceProducts.reduce((acc, curr) => acc + curr, 0);

const buildCartHtml = (article) => `
<article class="cart__item" data-id="${article.id}" data-color="${article.color}">
    <div class="cart__item__img">
    ${article.img}
    </div>
    <div class="cart__item__content">
    <div class="cart__item__content__description">
        <h2>Nom du produit</h2>
        <p>Vert</p>
        <p>${article.price}</p>
    </div>
    <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.qty}">
        </div>
        <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
        </div>
    </div>
    </div>
</article>
`;
totalPriceProducts.textContent += totalPrice;
totalQuantityProducts.textContent += numberOfProducts;
displayCart(temporaryCart);
