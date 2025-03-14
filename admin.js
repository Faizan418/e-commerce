import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

// Auth Check
// onAuthStateChanged(auth, (user) => {
//     if (user) {
//         const userDocRef = doc(db, "users", user.uid);
//         getDoc(userDocRef).then((docSnap) => {
//             if (!docSnap.exists() || docSnap.data().role !== "admin") {
//                 Swal.fire({
//                     icon: "error",
//                     title: "Access Denied",
//                     text: "Only admins can view this page.",
//                 }).then(() => {
//                     window.location.href = "index.html";
//                 });
//             } else {
//                 loadDashboard();
//                 loadProducts();
//                 loadOrders();
//                 loadUsers();
//             }
//         });
//     } else {
//         window.location.href = "index.html";
//     }
// });

// Sidebar Navigation
function showSection(sectionId) {
    document.querySelectorAll(".content-section").forEach(section => {
        section.classList.remove("active");
    });
    document.querySelectorAll(".nav-links li").forEach(li => {
        li.classList.remove("active");
    });
    document.getElementById(sectionId).classList.add("active");
    document.querySelector(`[onclick="showSection('${sectionId}')"]`).classList.add("active");
}

// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");
    sidebar.classList.toggle("collapsed");
    if (sidebar.classList.contains("collapsed")) {
        sidebar.style.width = "60px";
        mainContent.style.marginLeft = "60px";
        mainContent.style.width = "calc(100% - 60px)";
    } else {
        sidebar.style.width = "250px";
        mainContent.style.marginLeft = "250px";
        mainContent.style.width = "calc(100% - 250px)";
    }
}

// Load Dashboard Stats with Chart
function loadDashboard() {
    onSnapshot(collection(db, "products"), (snapshot) => {
        document.getElementById("total-products").textContent = snapshot.size;
    });
    onSnapshot(collection(db, "orders"), (snapshot) => {
        document.getElementById("total-orders").textContent = snapshot.size;

        // Prepare data for sales chart
        const salesData = {};
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            salesData[dateStr] = 0;
        }

        snapshot.forEach(doc => {
            const order = doc.data();
            const orderDate = order.createdAt.split('T')[0];
            if (salesData[orderDate] !== undefined) {
                salesData[orderDate] += parseFloat(order.total.replace('$', ''));
            }
        });

        const labels = Object.keys(salesData);
        const data = Object.values(salesData);

        const ctx = document.getElementById('sales-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sales ($)',
                    data: data,
                    borderColor: '#ff9900',
                    backgroundColor: 'rgba(255, 153, 0, 0.2)',
                    fill: true,
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Sales ($)'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    });
    onSnapshot(collection(db, "users"), (snapshot) => {
        document.getElementById("total-users").textContent = snapshot.size;
    });
}
// Load Products
function loadProducts() {
    const productsTableBody = document.getElementById("products-table-body");
    onSnapshot(collection(db, "products"), (snapshot) => {
        productsTableBody.innerHTML = "";
        snapshot.forEach(doc => {
            const product = doc.data();
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${doc.id}</td>
                <td>${product.title}</td>
                <td>${product.price}</td>
                <td><img src="${product.image}" alt="${product.title}"></td>
                <td>${product.description}</td>
                <td>
                    <button class="btn btn-warning" onclick="editProduct('${doc.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteProduct('${doc.id}')">Delete</button>
                </td>
            `;
            productsTableBody.appendChild(row);
        });
    });
}

// Add Product
document.getElementById("add-product-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("product-title").value;
    const price = document.getElementById("product-price").value;
    const image = document.getElementById("product-image").value;
    const description = document.getElementById("product-description").value;

    try {
        await addDoc(collection(db, "products"), { title, price, image, description });
        Swal.fire({
            icon: "success",
            title: "Product Added",
            text: "Product has been added successfully!",
        });
        document.getElementById("add-product-form").reset();
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to add product: " + error.message,
        });
    }
});

// Delete Product
window.deleteProduct = async (id) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            await deleteDoc(doc(db, "products", id));
            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Product has been deleted.",
            });
        }
    });
};

// Load Orders
function loadOrders() {
    const ordersTableBody = document.getElementById("orders-table-body");
    onSnapshot(collection(db, "orders"), (snapshot) => {
        ordersTableBody.innerHTML = "";
        snapshot.forEach(doc => {
            const order = doc.data();
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${doc.id}</td>
                <td>${order.shipping.fullName}</td>
                <td>${order.total}</td>
                <td>${order.status || "Pending"}</td>
                <td>
                    <button class="btn btn-warning" onclick="updateOrderStatus('${doc.id}', 'Shipped')">Mark as Shipped</button>
                    <button class="btn btn-danger" onclick="deleteOrder('${doc.id}')">Delete</button>
                </td>
            `;
            ordersTableBody.appendChild(row);
        });
    });
}

// Update Order Status
window.updateOrderStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), { status });
    Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `Order status updated to ${status}.`,
    });
};

// Delete Order
window.deleteOrder = async (id) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            await deleteDoc(doc(db, "orders", id));
            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Order has been deleted.",
            });
        }
    });
};

// Load Users
function loadUsers() {
    const usersTableBody = document.getElementById("users-table-body");
    onSnapshot(collection(db, "users"), (snapshot) => {
        usersTableBody.innerHTML = "";
        snapshot.forEach(doc => {
            const user = doc.data();
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${doc.id}</td>
                <td>${user.email}</td>
                <td>${user.role || "user"}</td>
                <td>
                    <button class="btn btn-warning" onclick="changeUserRole('${doc.id}', '${user.role === 'admin' ? 'user' : 'admin'}')">
                        ${user.role === "admin" ? "Demote to User" : "Promote to Admin"}
                    </button>
                    <button class="btn btn-danger" onclick="deleteUser('${doc.id}')">Delete</button>
                </td>
            `;
            usersTableBody.appendChild(row);
        });
    });
}

// Change User Role
window.changeUserRole = async (id, newRole) => {
    await updateDoc(doc(db, "users", id), { role: newRole });
    Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `User role updated to ${newRole}.`,
    });
};

// Delete User
window.deleteUser = async (id) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            await deleteDoc(doc(db, "users", id));
            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "User has been deleted.",
            });
        }
    });
};