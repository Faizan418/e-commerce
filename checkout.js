
        let discount = 0;

        function displayCheckout() {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const checkoutItemsDiv = document.getElementById("checkout-items");
            const checkoutEmptyMsg = document.getElementById("checkout-empty");
            const subtotalSpan = document.getElementById("subtotal");
            const shippingCostSpan = document.getElementById("shipping-cost");
            const discountSpan = document.getElementById("discount");
            const totalPriceSpan = document.getElementById("total-price");

            if (cart.length === 0) {
                checkoutEmptyMsg.style.display = "block";
                checkoutItemsDiv.innerHTML = "";
                subtotalSpan.innerText = "$0.00";
                shippingCostSpan.innerText = "$0.00";
                discountSpan.innerText = "$0.00";
                totalPriceSpan.innerText = "$0.00";
            } else {
                checkoutEmptyMsg.style.display = "none";
                checkoutItemsDiv.innerHTML = "";
                let subtotal = 0;
                cart.forEach(item => {
                    const itemDiv = document.createElement("div");
                    itemDiv.classList.add("checkout-item");
                    const itemPrice = parseFloat(item.price.replace("$", ""));
                    const itemQuantity = item.quantity || 1;
                    const itemTotal = itemPrice * itemQuantity;
                    subtotal += itemTotal;
                    itemDiv.innerHTML = `
                        <div class="checkout-item-details">
                            <h3>${item.title}</h3>
                            <p>${item.price} x ${itemQuantity} = $${itemTotal.toFixed(2)}</p>
                        </div>
                    `;
                    checkoutItemsDiv.appendChild(itemDiv);
                });
                const shipping = document.querySelector('input[name="shipping"]:checked').value === "standard" ? 5 : 15;
                const total = subtotal + shipping - discount;

                subtotalSpan.innerText = `$${subtotal.toFixed(2)}`;
                shippingCostSpan.innerText = `$${shipping.toFixed(2)}`;
                discountSpan.innerText = `$${discount.toFixed(2)}`;
                totalPriceSpan.innerText = `$${total.toFixed(2)}`;
            }
        }

        function applyPromo() {
            const promoCode = document.getElementById("promo-code").value;
            if (promoCode.toUpperCase() === "SAVE10") {
                discount = 10;
                alert("Promo code applied! $10 discount.");
            } else {
                discount = 0;
                alert("Invalid promo code!");
            }
            displayCheckout();
        }

        function placeOrder() {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const fullName = document.getElementById("full-name").value;
            const email = document.getElementById("email").value;
            const phone = document.getElementById("phone").value;
            const addressLine1 = document.getElementById("address-line1").value;
            const addressLine2 = document.getElementById("address-line2").value;
            const city = document.getElementById("city").value;
            const state = document.getElementById("state").value;
            const zip = document.getElementById("zip").value;
            const country = document.getElementById("country").value;
            const shippingMethod = document.querySelector('input[name="shipping"]:checked').value;
            const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }
            if (!fullName || !email || !phone || !addressLine1 || !city || !state || !zip || !country) {
                alert("Please fill in all required shipping details!");
                return;
            }
            if (paymentMethod === "card") {
                const cardNumber = document.getElementById("card-number").value;
                const cardExpiry = document.getElementById("card-expiry").value;
                const cardCvv = document.getElementById("card-cvv").value;
                if (!cardNumber || !cardExpiry || !cardCvv) {
                    alert("Please fill in all card details!");
                    return;
                }
            }

            const orderDetails = {
                cart: cart,
                shipping: { fullName, email, phone, addressLine1, addressLine2, city, state, zip, country },
                shippingMethod: shippingMethod,
                paymentMethod: paymentMethod,
                total: document.getElementById("total-price").innerText
            };
            localStorage.setItem("lastOrder", JSON.stringify(orderDetails));
            alert("Order placed successfully!");
            localStorage.removeItem("cart");
            window.location.href = "home.html";
        }

        document.querySelectorAll('input[name="payment"]').forEach(input => {
            input.addEventListener("change", () => {
                document.getElementById("card-details").style.display = input.value === "card" ? "block" : "none";
            });
        });

        document.querySelectorAll('input[name="shipping"]').forEach(input => {
            input.addEventListener("change", displayCheckout);
        });

        window.onload = displayCheckout;
