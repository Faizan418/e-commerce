// script.js (continued)
let cartCount = 0;

function addToCart() {
    cartCount++;
    document.getElementById("cart-message").innerText = `Item added to cart! Total items: ${cartCount}`;
}



