
function displayCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsDiv = document.getElementById("cart-items");
    const cartEmptyMsg = document.getElementById("cart-empty");

    if (cart.length === 0) {
        cartEmptyMsg.style.display = "block";
        cartItemsDiv.innerHTML = "";
    } else {
        cartEmptyMsg.style.display = "none";
        cartItemsDiv.innerHTML = "";
        cart.forEach((item, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("cart-item");
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-details">
                    <h2>${item.title}</h2>
                    <p>${item.price}</p>
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
    }
}

window.onload = displayCart;
