function displayCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsDiv = document.getElementById("cart-items");
    const cartEmptyMsg = document.getElementById("cart-empty");
    const itemCountSpan = document.getElementById("item-count");
    const subtotalSpan = document.getElementById("subtotal");
    const totalSpan = document.getElementById("total");

    if (cart.length === 0) {
        cartEmptyMsg.style.display = "block";
        cartItemsDiv.innerHTML = "";
        itemCountSpan.textContent = "0";
        subtotalSpan.textContent = "0.00";
        totalSpan.textContent = "0.00";
    } else {
        cartEmptyMsg.style.display = "none";
        cartItemsDiv.innerHTML = "";
        let totalPrice = 0;

        cart.forEach((item, index) => {
            const itemPrice = parseFloat(item.price.replace("$", ""));
            const itemTotal = itemPrice * (item.quantity || 1);
            totalPrice += itemTotal;

            const itemDiv = document.createElement("div");
            itemDiv.classList.add("cart-item");
            itemDiv.innerHTML = `
                <img src="${item.image || 'https://via.placeholder.com/150x150?text=Image+Not+Found'}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/150x150?text=Image+Not+Found';">
                <div class="cart-item-details">
                    <h2>${item.title}</h2>
                    <p class="price">${item.price}</p>
                    <p>${item.description}</p>
                    <div class="quantity-control">
                        <button onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity || 1}</span>
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
                </div>
            `;
            cartItemsDiv.appendChild(itemDiv);
        });

        itemCountSpan.textContent = cart.length;
        subtotalSpan.textContent = totalPrice.toFixed(2);
        totalSpan.textContent = totalPrice.toFixed(2); // Free shipping, so total = subtotal
    }
}

function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[index].quantity = (cart[index].quantity || 1) + change;
    if (cart[index].quantity < 1) {
        cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

document.addEventListener("DOMContentLoaded", displayCart);