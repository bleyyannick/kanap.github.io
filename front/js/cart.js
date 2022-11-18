const container = document.getElementById("cart__items");
const totalQuantityProducts = document.getElementById("totalQuantity");
const totalPriceProducts = document.getElementById("totalPrice");

const orderForm = document.querySelector(".cart__order__form");
const orderButton = document.getElementById("order");

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const addressInput = document.getElementById("address");
const cityInput = document.getElementById("city");
const emailInput = document.getElementById("email");

const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
const addressErrorMsg = document.getElementById("addressErrorMsg");
const cityErrorMsg = document.getElementById("cityErrorMsg");
const emailErrorMsg = document.getElementById("emailErrorMsg");

const MAIL_FORMAT = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const VALID_FORMAT = /^[A-Za-z]+$/;

const EMPTY_FIELD = "Veuillez remplir ce champ pour valider le formulaire";
const INVALID_MAIL_FIELD =
  "Veuillez remplir ce champ avec une adresse mail valide.";
const INVALID_FIELD = "Ce champ ne doit contenir que des lettres.";

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
  return priceProducts.reduce((acc, curr) => acc + curr, 0);
};

const displayAmountProducts = (cart) => {
  totalPriceProducts.textContent = getTotalPrice(cart);
};

const displayQuantityProducts = (cart) => {
  const numberOfProducts = cart.reduce((acc, curr) => acc + curr.qty, 0);
  totalQuantityProducts.textContent = numberOfProducts;
};

const deleteProduct = (cart) => {
  const itemsToDelete = document.querySelectorAll(".deleteItem");

  itemsToDelete.forEach((item) => {
    item.addEventListener("click", (e) => {
      deleteCartProduct(item, cart);
    });
  });
};

const updateCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
  displayQuantityProducts(cart);
  displayAmountProducts(cart);
};

const deleteCartProduct = (itemRef, cart) => {
  const article = itemRef.closest(".cart__item");

  const productToDelete = cart.find(
    ({ id, color }) =>
      id === article.dataset.id && color === article.dataset.color
  );
  const newCart = cart.filter((product) => product.id !== productToDelete.id);
  article.remove();
  updateCart(newCart);
};

const handleQuantityProduct = (cart) => {
  const quantityInputs = document.querySelectorAll(".itemQuantity");
  quantityInputs.forEach((inputQuantity) => {
    inputQuantity.addEventListener("change", (e) =>
      editProduct(cart, inputQuantity, +e.target.value)
    );
  });
};

const editProduct = (cart, itemRef, newQuantity) => {
  const article = itemRef.closest(".cart__item");

  const productToEdit = cart.find(
    ({ id, color }) =>
      id === article.dataset.id && color === article.dataset.color
  );

  productToEdit.qty = newQuantity;
  updateCart(cart);
};

const inputTextValidation = (inputRef, errorParagraph, errorText) => {
  if (inputRef.value.trim() === "") {
    errorParagraph.textContent = errorText;
    return false;
  } else {
    return true;
  }
};

const inputValidation = (
  inputRef,
  format,
  errorParagraph,
  errorFormat,
  errorText
) => {
  if (!inputRef.value.match(format)) {
    errorParagraph.textContent = errorFormat;
    return false;
  } else if (inputTextValidation(inputRef, errorParagraph, errorText)) {
    return true;
  }
};

const formValidation = () => {
  let isValidMailField = inputValidation(
    emailInput,
    MAIL_FORMAT,
    emailErrorMsg,
    INVALID_MAIL_FIELD,
    EMPTY_FIELD
  );
  let isValidFirstNameField = inputValidation(
    firstNameInput,
    VALID_FORMAT,
    firstNameErrorMsg,
    INVALID_FIELD,
    EMPTY_FIELD
  );

  let isValidLastNameField = inputValidation(
    lastNameInput,
    VALID_FORMAT,
    lastNameErrorMsg,
    INVALID_FIELD,
    EMPTY_FIELD
  );
  let isValidAddressField = inputTextValidation(
    addressInput,
    addressErrorMsg,
    EMPTY_FIELD
  );
  let isValidCityInput = inputTextValidation(
    cityInput,
    cityErrorMsg,
    EMPTY_FIELD
  );
  return (isAllValidFields =
    isValidMailField &&
    isValidLastNameField &&
    isValidCityInput &&
    isValidAddressField &&
    isValidFirstNameField);
};
orderButton.addEventListener("click", (e) => {
  e.preventDefault();
  formValidation();

  if (formValidation()) {
    console.log("POST");
  } else {
    console.log("RESTE LA");
  }
});

const main = async (cart) => {
  await completedPriceProducts(cart);
  displayAmountProducts(cart);
  displayQuantityProducts(cart);
  displayCart(cart);
  deleteProduct(cart);
  handleQuantityProduct(cart);
};
main(temporaryCart);
