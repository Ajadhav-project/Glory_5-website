// Product data
const products = [
    {
        id: 1,
        name: "Classic Denim Jacket",
        price: 8999,
        category: "male",
        image: "image\\jacket.png"
    },
    {
        id: 2,
        name: "cosszy Knit hoodie",
        price: 5999,
        category: "male",
        image: "image\\hoodies-removebg.png"
    },
    {
        id: 3,
        name: "Leather Chelsea Boots",
        price: 12999,
        category: "male",
        image: "image\\black shose.png"
    },
    {
        id: 4,
        name: "Flowy Maxi Dress",
        price: 7999,
        category: "female",
        image: "image\\Floral Summer Dress.png"
    },
    {
        id: 5,
        name: "Silk  Saree",
        price: 4999,
        category: "female",
        image: "image\\Red Silk Saree.png"
    },
    {
        id: 6,
        name: "White Crop Top",
        price: 9999,
        category: "female",
        image: "image\\White Crop Top.webp"
    },
    {
        id: 7,
        name: "Graphic cotton ware",
        price: 3999,
        category: "kids",
        image: "image\\imge.jpg"
    },
    {
        id: 8,
        name: "Cargo Pants",
        price: 3499,
        category: "kids",
        image: "image\\img3.jpg"
    },
    {
        id: 9,
        name: "dangry",
        price: 5499,
        category: "kids",
        image: "image\\img2.jpg"
    }
];

// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const navLinks = document.querySelectorAll('.nav-link');
const cartModal = document.getElementById('cartModal');
const cartIcon = document.getElementById('cartIcon');
const cartCount = document.getElementById('cartCount');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.querySelector('.checkout-btn');

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
    renderProducts('all');
    updateCartCount();
    setupEventListeners();
});

function setupEventListeners() {
    // Navigation category filter
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.dataset.category;

            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');

            renderProducts(category);
        });
    });

    // Cart modal
    cartIcon.addEventListener('click', () => {
        renderCart();
        cartModal.style.display = 'block';
    });

    // Close cart modal
    closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert(`Proceeding to checkout with ${cart.reduce((sum, item) => sum + item.quantity, 0)} items totaling $${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}! (Demo)`);
    });
}

// Render products (SIMPLIFIED - no wishlist)
function renderProducts(category = 'all') {
    const filteredProducts = category === 'all'
        ? products
        : products.filter(product => product.category === category);

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-category">${product.category.toUpperCase()}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn btn-secondary" onclick="quickView(${product.id})">
                        <i class="fas fa-eye"></i> Quick View
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartCount();

    // Visual feedback
    const btn = event.target.closest('.btn-primary');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Added!';
    btn.style.background = '#00b894';

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
    }, 1500);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
}

function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartCount();
            renderCart();
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; font-size: 1.1rem;">Your cart is empty</p>';
        cartTotal.textContent = '0';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)}</p>
                <div style="margin-top: 0.5rem;">
                    <button onclick="updateCartQuantity(${item.id}, -1)" style="background: none; border: 1px solid #ddd; padding: 0.3rem 0.7rem; border-radius: 5px; margin-right: 0.5rem; cursor: pointer;">-</button>
                    <span style="font-weight: bold; margin: 0 1rem; min-width: 20px; display: inline-block;">${item.quantity}</span>
                    <button onclick="updateCartQuantity(${item.id}, 1)" style="background: none; border: 1px solid #ddd; padding: 0.3rem 0.7rem; border-radius: 5px; cursor: pointer;">+</button>
                </div>
            </div>
            <div style="margin-left: auto; display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
                <p style="font-weight: bold; font-size: 1.1rem;">$${(item.price * item.quantity).toFixed(2)}</p>
                <button class="remove-item" onclick="removeFromCart(${item.id})" style="background: #ff4757; color: white; border: none; padding: 0.3rem 0.7rem; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Quick view function (replaces wishlist button)
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    alert(`Quick View:\n\n${product.name}\nPrice: $${product.price.toFixed(2)}\nCategory: ${product.category.toUpperCase()}\n\nClick "Add to Cart" to purchase!`);
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
// Export functions for onclick handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.quickView = quickView;