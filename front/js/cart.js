const container = document.getElementById("cart__items");
const totalQuantityProducts = document.getElementById("totalQuantity");
const totalPriceProducts = document.getElementById("totalPrice");

const URL = "http://localhost:3000/api/products";

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
const VALID_FORMAT = /^[a-zA-Z]+$/;

const INVALID_MAIL_FIELD =
  "Veuillez remplir ce champ avec une adresse mail valide.";
const INVALID_FIELD = "Ce champ ne doit contenir que des lettres.";

const temporaryCart = JSON.parse(localStorage.getItem("cart")) || [];

// get all products from backend API
const getProducts = async () => {
  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    const products = await response.json();
    return products;
  } catch (error) {
    alert(`Impossible d'obtenir les produits`);
  }
};

// Give all informations of selected products that could not be shown in localStorage
// like prices
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

// Display each selected product
const displayCart = (cart) => {
  const htmlCart = cart.map((product) => buildCartHtml(product));
  container.innerHTML = htmlCart.join("");
};

// Compute prices products
const selectedProductsPrice = (cart) =>
  cart.map(({ qty, price }) => qty * price);

// return an HTML article displaying a product
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
// get the total price of selected products
const getTotalPrice = (cart) => {
  const priceProducts = selectedProductsPrice(cart);
  return priceProducts.reduce((acc, curr) => acc + curr, 0);
};

// Show the total price in the page
const displayAmountProducts = (cart) => {
  totalPriceProducts.textContent = getTotalPrice(cart);
};

// Compute and show the products quantity in the page
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
// update the quantity and price of products
const updateCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
  displayQuantityProducts(cart);
  displayAmountProducts(cart);
};

// select product that must be deleted or edited
const selectedProduct = (cart, itemRef) => {
  const article = itemRef.closest(".cart__item");
  return cart.find(
    ({ id, color }) =>
      id === article.dataset.id && color === article.dataset.color
  );
};
// Delete a product in the cart
const deleteCartProduct = (itemRef, cart) => {
  const article = itemRef.closest(".cart__item");
  const productToDelete = selectedProduct(cart, itemRef);
  const newCart = cart.filter(({ id }) => id !== productToDelete.id);
  article.remove();
  updateCart(newCart);
};

// Edit each quantity of each selected product in the cart
const handleQuantityProduct = (cart) => {
  const quantityInputs = document.querySelectorAll(".itemQuantity");
  quantityInputs.forEach((inputQuantity) => {
    inputQuantity.addEventListener("change", (e) =>
      editProduct(cart, inputQuantity, +e.target.value)
    );
  });
};

// Edit a product
const editProduct = (cart, itemRef, newQuantity) => {
  const productToEdit = selectedProduct(cart, itemRef);
  productToEdit.qty = newQuantity;
  updateCart(cart);
};
// Check if mail address field is valid
const isValidEmail = () => {
  const value = emailInput.value;
  if (!value.match(MAIL_FORMAT)) {
    emailErrorMsg.textContent = INVALID_MAIL_FIELD;
    return false;
  }
  return true;
};
// Check if last name field is valid
const isValidLastName = () => {
  const value = lastNameInput.value;
  if (value.length === 0) {
    lastNameErrorMsg.textContent = INVALID_FIELD;
    return false;
  }
  return true;
};

// Check if firstName field is valid
const isValidFirstName = () => {
  const value = firstNameInput.value;
  if (!value.match(VALID_FORMAT)) {
    firstNameErrorMsg.textContent = INVALID_FIELD;
    return false;
  }
  return true;
};

// Check if address field is valid
const isValidAddress = () => {
  const value = addressInput.value;
  if (value.length === 0) {
    lastNameErrorMsg.textContent = INVALID_FIELD;
    return false;
  }
  return true;
};

// Check if city field is valid
const isValidCity = () => {
  const value = cityInput.value;
  if (value.length === 0) {
    cityErrorMsg.textContent = INVALID_FIELD;
    return false;
  }
  return true;
};
// Function that displays an error msg if the form isn't correctly
const formError = () => {
  if (!isValidAddress()) {
    addressErrorMsg.textContent = INVALID_FIELD;
  }
  if (!isValidCity()) {
    cityErrorMsg.textContent = INVALID_FIELD;
  }
  if (!isValidLastName()) {
    lastNameErrorMsg.textContent = INVALID_FIELD;
  }
  if (!isValidFirstName()) {
    firstNameErrorMsg.textContent = INVALID_FIELD;
  }
  if (!isValidEmail()) {
    emailErrorMsg.textContent = INVALID_MAIL_FIELD;
  }
};

// Clear all input fields after submitting form
const clearInputs = () => {
  firstNameInput.value = " ";
  lastNameInput.value = " ";
  addressInput.value = " ";
  cityInput.value = " ";
  emailInput.value = " ";
};

// Handle the order with a POST request with ids of selected products and an object contact
const orderProducts = (cart, contact) => {
  const products = cart.map(({ id }) => id);
  try {
    const postProducts = async () => {
      const response = await fetch(`${URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contact, products }),
      });
      const result = await response.json();
      // after sending POST request, we clear localStorage for not keeping and sending cart informations
      // products in confirmation page
      localStorage.clear();
      window.location.href = `confirmation.html?id=${result.orderId}`;
    };
    postProducts();
  } catch (error) {
    alert(`Impossible d'effectuer votre commande.`);
  }
};

// Function that runs all defined functions below
const main = async (cart) => {
  await completedPriceProducts(cart);
  displayAmountProducts(cart);
  displayQuantityProducts(cart);
  displayCart(cart);
  deleteProduct(cart);
  handleQuantityProduct(cart);
};
main(temporaryCart);

// Handle the product order
orderButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    !isValidAddress() ||
    !isValidCity() ||
    !isValidEmail() ||
    !isValidFirstName() ||
    !isValidLastName()
  ) {
    formError();
  } else {
    // create a contact for the order
    const contact = {
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      address: addressInput.value,
      city: cityInput.value,
      email: emailInput.value,
    };
    orderProducts(temporaryCart, contact);
    clearInputs();
  }
});
