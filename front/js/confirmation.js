const orderSpan = document.getElementById("orderId");

const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

orderSpan.textContent = orderId;
