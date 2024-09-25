const apiURL = 'https://fakestoreapi.com/products';
let products = [];
let cart = [];
const platformFee = 5;

// When the page loads, fetch products
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    document.getElementById('searchBar').addEventListener('input', searchProducts);
});

// Fetch products from Fake Store API
async function fetchProducts() {
    const response = await fetch(apiURL);
    products = await response.json();
    displayProducts(products);
}

// Display products on the page
function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.description.substring(0, 100)}...</p>
            <p>Price: $${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productDiv);
    });
}

// Add items to the cart
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const cartItem = cart.find(item => item.id === id);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
}

// Remove an item from the cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Update cart display and total price
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    const totalMrp = document.getElementById('total-mrp');
    const totalItems = document.getElementById('total-items');
    const discountEl = document.getElementById('discount');

    cartItems.innerHTML = '';
    let total = 0;
    let totalDiscount = 0;
    let totalItemCount = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        totalItemCount += item.quantity;
        totalDiscount += item.price * item.quantity * 0.1; // 10% discount

        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div>
                <h4>${item.title}</h4>
                <p>Price: $${item.price.toFixed(2)}</p>
                <p>Quantity: <button onclick="increaseQuantity(${item.id})">+</button> ${item.quantity} <button onclick="decreaseQuantity(${item.id})">-</button></p>
            </div>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItems.appendChild(cartItemDiv);
    });

    const totalAfterDiscount = total - totalDiscount;

    totalPrice.innerText = `$${total.toFixed(2)}`;
    discountEl.innerText = `-$${totalDiscount.toFixed(2)}`;
    totalMrp.innerText = `$${(totalAfterDiscount + platformFee).toFixed(2)}`;
    totalItems.innerText = totalItemCount;
}

// Increase quantity of cart item
function increaseQuantity(id) {
    const cartItem = cart.find(item => item.id === id);
    cartItem.quantity++;
    updateCart();
}

// Decrease quantity of cart item
function decreaseQuantity(id) {
    const cartItem = cart.find(item => item.id === id);
    if (cartItem.quantity > 1) {
        cartItem.quantity--;
    } else {
        removeFromCart(id);
    }
    updateCart();
}

// Search functionality
function searchProducts() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const filteredProducts = products.filter(product => product.title.toLowerCase().includes(searchTerm));
    displayProducts(filteredProducts);
}

// Function to place an order
function placeOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
    } else {
        alert('Order placed successfully!');
        cart = [];
        updateCart();
    }
}
