const container = document.getElementById("cart__items");
const totalQuantityProducts = document.getElementById("totalQuantity");
const totalPriceProducts = document.getElementById("totalPrice");
const temporaryCart = JSON.parse(localStorage.getItem("cart")) || [];

const getProducts = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/products");
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    const products = await response.json();
    return products;
  } catch (error) {
    alert(`Impossible d'obtenir les produits`);
  }
};

const completedPriceProducts = async (cart) => {
  const allProducts = await getProducts();
  for (const cartItem of cart) {
    const productId = cartItem.id;
    const correspondingProduct = allProducts.find(
      ({ _id }) => _id == productId
    );
    cartItem.price = correspondingProduct.price;
    cartItem.name = correspondingProduct.name;
    cartItem.imageUrl = correspondingProduct.imageUrl;
    cartItem.altTxt = correspondingProduct.altTxt;
  }
};

const displayCart = (cart) => {
  const htmlCart = cart.map((product) => buildCartHtml(product));
  container.innerHTML = htmlCart.join("");
};

const selectedProductsPrice = (cart) =>
  cart.map(({ qty, price }) => qty * price);

const buildCartHtml = (article) => `
<article class="cart__item" data-id="${article.id}" data-color="${article.color}">
    <div class="cart__item__img">
      <img src="${article.imageUrl}" alt="${article.altTxt}"/>
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
          <h2>${article.name}</h2>
          <p>${article.color}</p>
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

const getTotalPrice = (cart) => {
  const priceProducts = selectedProductsPrice(cart);
  const totalPrice = priceProducts.reduce((acc, curr) => acc + curr, 0);
  return totalPrice;
};
const displayAmountProducts = (cart) => {
  const amountProducts = getTotalPrice(cart);
  totalPriceProducts.textContent = amountProducts;
};
const displayQuantityProducts = (cart) => {
  const numberOfProducts = cart.reduce((acc, curr) => acc + curr.qty, 0);
  totalQuantityProducts.textContent = numberOfProducts;
};
const searchProductToHandle = (item, cart) => {
  const article = item.closest(".cart__item");
  const idProduct = article.dataset.id;
  const colorProduct = article.dataset.color;
  const productToEdit = cart.find(
    ({ id, color }) => id === idProduct && color === colorProduct
  );
  return productToEdit;
};
const deleteProduct = (cart) => {
  const itemsToDelete = document.querySelectorAll(".deleteItem");
  itemsToDelete.forEach((item) => {
    item.addEventListener("click", (e) => {
      const productToDelete = searchProductToHandle(item, cart);
    });
  });
};
const editQuantityProducts = (cart) => {
  const inputProducts = document.querySelectorAll(".itemQuantity");
  inputProducts.forEach((product) => {
    product.addEventListener("change", (e) => {
      const productToEdit = searchProductToHandle(product, cart);
      productToEdit.qty = +e.target.value;
      let oldCart = JSON.parse(localStorage.getItem("cart"));
      const newCart = oldCart.map((product) => {
        if (
          product.id === productToEdit.id &&
          product.color === productToEdit.color
        )
          product.qty = productToEdit.qty;
        return product;
      });
      localStorage.clear();
      localStorage.setItem("cart", JSON.stringify(newCart));
      displayQuantityProducts(cart);
      displayAmountProducts(cart);
    });
  });
};

const main = async (cart) => {
  await completedPriceProducts(cart);
  displayAmountProducts(cart);
  displayQuantityProducts(cart);
  displayCart(cart);
  deleteProduct(cart);
  editQuantityProducts(cart);
};
main(temporaryCart);
