// script.js
window.products = [
    { id: 1, title: "Cloths", price: "$29.99", image: "images/box1_image.jpg", description: "Stylish and comfortable clothing for all seasons." },
    { id: 2, title: "Health & Personal Care", price: "$15.50", image: "images/box2_image.jpg", description: "Essential health and personal care products." },
    { id: 3, title: "Furniture", price: "$199.99", image: "images/box3_image.jpg", description: "Modern furniture for your home." },
    { id: 4, title: "Mobile Phones", price: "$399.00", image: "images/box4_image.jpg", description: "Latest smartphones with advanced features." },
    { id: 5, title: "Beauty Picks", price: "$24.99", image: "images/box5_image.jpg", description: "Top beauty products for your routine." },
    { id: 6, title: "Pet Care", price: "$12.99", image: "images/box6_image.jpg", description: "Everything your pet needs." },
    { id: 7, title: "New Arrival in Toys", price: "$19.99", image: "images/box7_image.jpg", description: "Fun and exciting new toys for kids." },
    { id: 8, title: "Discover Fashion Trends", price: "$49.99", image: "images/box8_image.jpg", description: "Latest fashion trends to upgrade your wardrobe." }
];

// Check and replace with placeholder if local images are missing
window.products.forEach((product, index) => {
    if (!product.image.includes("http")) {
        const img = new Image();
        img.src = product.image;
        img.onerror = () => {
            product.image = `https://via.placeholder.com/300x300?text=Product+${index + 1}`; // Corrected placeholder
            console.log(`Replaced ${product.image} with placeholder for product ID ${product.id}`);
        };
    }
});

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get("id"));
    const product = window.products.find(p => p.id === productId);

    if (product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            product.quantity = 1;
            cart.push(product);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        document.getElementById("cart-message").innerText = `${product.title} added to cart!`;
        setTimeout(() => {
            window.location.href = "cart.html";
        }, 1000);
    } else {
        alert("Product not found!");
    }
}

function buyNow() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get("id"));
    const product = window.products.find(p => p.id === productId);

    if (product) {
        Swal.fire({
            title: "Redirecting to Checkout",
            text: "Proceeding to payment for " + product.title,
            icon: "info",
            showConfirmButton: false,
            timer: 2000
        }).then(() => {
            window.location.href = `checkout.html?productId=${productId}`;
        });
    } else {
        alert("Product not found!");
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

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const panel = document.querySelector(".panel");

    if (hamburger && panel) {
        hamburger.addEventListener("click", () => {
            panel.classList.toggle("active");
        });
    }
    console.log("Products loaded globally:", window.products);
});

window.products = window.products; // Double ensure