import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = getFirestore();

let discount = 0;

function displayCheckout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const checkoutItemsDiv = document.getElementById("checkout-items");
    const checkoutEmptyMsg = document.getElementById("checkout-empty");
    const itemCountSpan = document.getElementById("item-count");
    const subtotalSpan = document.getElementById("subtotal");
    const shippingCostSpan = document.getElementById("shipping-cost");
    const discountSpan = document.getElementById("discount");
    const totalPriceSpan = document.getElementById("total-price");

    if (cart.length === 0) {
        checkoutEmptyMsg.style.display = "block";
        checkoutItemsDiv.innerHTML = "";
        itemCountSpan.textContent = "0";
        subtotalSpan.textContent = "$0.00";
        shippingCostSpan.textContent = "$0.00";
        discountSpan.textContent = "$0.00";
        totalPriceSpan.textContent = "$0.00";
    } else {
        checkoutEmptyMsg.style.display = "none";
        checkoutItemsDiv.innerHTML = "";
        let subtotal = 0;
        cart.forEach(item => {
            const itemPrice = parseFloat(item.price.replace("$", ""));
            const itemQuantity = item.quantity || 1;
            const itemTotal = itemPrice * itemQuantity;
            subtotal += itemTotal;

            const itemDiv = document.createElement("div");
            itemDiv.classList.add("checkout-item");
            itemDiv.innerHTML = `
                <div class="checkout-item-details">
                    <h3>${item.title}</h3>
                    <p>${item.price} x ${itemQuantity} = $${itemTotal.toFixed(2)}</p>
                </div>
            `;
            checkoutItemsDiv.appendChild(itemDiv);
        });

        const shippingMethod = document.querySelector('input[name="shipping"]:checked').value;
        const shipping = shippingMethod === "standard" ? 5.00 : 15.00;
        const total = subtotal + shipping - discount;

        itemCountSpan.textContent = cart.length;
        subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
        shippingCostSpan.textContent = `$${shipping.toFixed(2)}`;
        discountSpan.textContent = `$${discount.toFixed(2)}`;
        totalPriceSpan.textContent = `$${total.toFixed(2)}`;
    }
}

function applyPromo() {
    const promoCode = document.getElementById("promo-code").value.toUpperCase();
    if (promoCode === "SAVE10") {
        discount = 10.00;
        Swal.fire({
            icon: "success",
            title: "Promo Applied!",
            text: "$10 discount added.",
            timer: 2000,
            showConfirmButton: false
        });
    } else {
        discount = 0;
        Swal.fire({
            icon: "error",
            title: "Invalid Code",
            text: "Please enter a valid promo code.",
            timer: 2000,
            showConfirmButton: false
        });
    }
    displayCheckout();
}

async function placeOrder() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const fullName = document.getElementById("full-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const addressLine1 = document.getElementById("address-line1").value.trim();
    const addressLine2 = document.getElementById("address-line2").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const zip = document.getElementById("zip").value.trim();
    const country = document.getElementById("country").value.trim();
    const shippingMethod = document.querySelector('input[name="shipping"]:checked').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    if (cart.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Empty Cart",
            text: "Your cart is empty!",
            timer: 2000,
            showConfirmButton: false
        });
        return;
    }

    if (!fullName || !email || !phone || !addressLine1 || !city || !state || !zip || !country) {
        Swal.fire({
            icon: "error",
            title: "Missing Details",
            text: "Please fill in all required shipping details!",
            timer: 2000,
            showConfirmButton: false
        });
        return;
    }

    if (paymentMethod === "card") {
        const cardNumber = document.getElementById("card-number").value.trim();
        const cardExpiry = document.getElementById("card-expiry").value.trim();
        const cardCvv = document.getElementById("card-cvv").value.trim();
        if (!cardNumber || !cardExpiry || !cardCvv) {
            Swal.fire({
                icon: "error",
                title: "Missing Card Details",
                text: "Please fill in all card details!",
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }
    }

    const orderDetails = {
        cart: cart,
        shipping: { fullName, email, phone, addressLine1, addressLine2, city, state, zip, country },
        shippingMethod: shippingMethod,
        paymentMethod: paymentMethod,
        total: document.getElementById("total-price").innerText,
        status: "Pending",
        createdAt: new Date().toISOString()
    };

    try {
        await addDoc(collection(db, "orders"), orderDetails);
        Swal.fire({
            icon: "success",
            title: "Order Placed!",
            text: "Thank you for your purchase. Redirecting to home...",
            timer: 2500,
            showConfirmButton: false
        }).then(() => {
            localStorage.removeItem("cart");
            window.location.href = "home.html";
        });
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to place order: " + error.message,
            timer: 2000,
            showConfirmButton: false
        });
    }
}

document.querySelectorAll('input[name="payment"]').forEach(input => {
    input.addEventListener("change", () => {
        document.getElementById("card-details").style.display = input.value === "card" ? "block" : "none";
    });
});

document.querySelectorAll('input[name="shipping"]').forEach(input => {
    input.addEventListener("change", displayCheckout);
});

document.addEventListener("DOMContentLoaded", displayCheckout);