document.addEventListener('DOMContentLoaded', function() {
    // ==================== СЛАЙДЕР ====================
    const initSlider = () => {
        const slider = document.querySelector('.auto-slider');
        if (!slider) return;

        const slides = slider.querySelectorAll('.slide');
        const dotsContainer = slider.querySelector('.dots');
        let currentIndex = 0;
        let interval;

        // Создание точек навигации
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.toggle('active', index === 0);
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('span');

        const goToSlide = (index) => {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentIndex = index;
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            goToSlide(currentIndex);
        };

        const startSlider = () => {
            interval = setInterval(nextSlide, 2000);
        };

        const stopSlider = () => {
            clearInterval(interval);
        };

        // Инициализация
        goToSlide(0);
        startSlider();

        // Управление
        slider.addEventListener('mouseenter', stopSlider);
        slider.addEventListener('mouseleave', startSlider);
        slider.addEventListener('touchstart', stopSlider);
        slider.addEventListener('touchend', startSlider);
    };

    // ==================== КОРЗИНА ====================
    const initCart = () => {
        const cartBtn = document.querySelector('.cart');
        const cartModal = document.getElementById('cartModal');
        if (!cartBtn || !cartModal) return;

        const closeCart = document.querySelector('.close-cart');
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartCount = document.querySelector('.cart-count');
        const totalPriceElement = document.getElementById('totalPrice');
        const addToCartBtns = document.querySelectorAll('.add-to-cart');
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Функции
        const saveCart = () => {
            localStorage.setItem('cart', JSON.stringify(cart));
        };

        const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

        const getTotalPrice = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);

        const updateCart = () => {
            updateCartItems();
            cartCount.textContent = getTotalItems();
            totalPriceElement.textContent = getTotalPrice();
            saveCart();
        };

        const updateCartItems = () => {
            cartItemsContainer.innerHTML = '';
            
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                        <div>
                            <h4>${item.name}</h4>
                            <p>${item.price} ₽ × ${item.quantity}</p>
                        </div>
                    </div>
                    <div class="cart-item-controls">
                        <span>${item.price * item.quantity} ₽</span>
                        <div class="quantity-controls">
                            <button class="decrease" data-index="${index}" aria-label="Уменьшить">−</button>
                            <span>${item.quantity}</span>
                            <button class="increase" data-index="${index}" aria-label="Увеличить">+</button>
                        </div>
                        <button class="remove-item" data-index="${index}" aria-label="Удалить">×</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });

            addCartEventListeners();
        };

        const addCartEventListeners = () => {
            document.querySelectorAll('.increase').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = this.dataset.index;
                    cart[index].quantity++;
                    updateCart();
                });
            });

            document.querySelectorAll('.decrease').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = this.dataset.index;
                    cart[index].quantity > 1 ? cart[index].quantity-- : cart.splice(index, 1);
                    updateCart();
                });
            });

            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = this.dataset.index;
                    cart.splice(index, 1);
                    updateCart();
                });
            });
        };

        // Обработчики событий
        cartBtn.addEventListener('click', () => {
            cartModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

        closeCart.addEventListener('click', () => {
            cartModal.style.display = 'none';
            document.body.style.overflow = '';
        });

        window.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });

        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const product = this.closest('.product');
                const productName = product.querySelector('h3').textContent;
                const productPrice = parseInt(product.querySelector('p').textContent.replace(/\D/g, ''));
                const productImage = product.querySelector('img').src;

                const existingItem = cart.find(item => item.name === productName);
                
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: 1
                    });
                }
                
                updateCart();
                
                // Анимация кнопки
                const originalText = this.textContent;
                this.textContent = '✓ Добавлено';
                this.classList.add('added-to-cart');
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.classList.remove('added-to-cart');
                }, 800);
            });
        });

        // Инициализация
        updateCart();
    };

    // Запуск всех функций
    initSlider();
    initCart();
});
// Авторизация/регистрация
const authBtn = document.getElementById('authBtn');
const authModal = document.getElementById('authModal');
const closeAuth = document.querySelector('.close-auth');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Открытие модального окна
authBtn.addEventListener('click', function() {
    authModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

// Закрытие модального окна
closeAuth.addEventListener('click', function() {
    authModal.style.display = 'none';
    document.body.style.overflow = '';
});

// Закрытие при клике вне окна
window.addEventListener('click', function(e) {
    if(e.target === authModal) {
        authModal.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// Переключение между вкладками
tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Удаляем активный класс у всех кнопок и контента
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Добавляем активный класс текущей кнопке и контенту
        this.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Обработка формы входа
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if(email === 'lazarevroman@mail.ru' && password === 'roman') {
        // Успешный вход
        alert('Вы успешно вошли!');
        authModal.style.display = 'none';
        document.body.style.overflow = '';
        
        // Меняем кнопку на профиль
        const authBtn = document.getElementById('authBtn');
        authBtn.innerHTML = '<i class="fas fa-user-check"></i> Профиль';
    } else {
        alert('Неверный email или пароль!');
    }
});
// Обработка оформления заказа
document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Собираем данные
    const formData = {
        name: this.querySelector('input[type="text"]').value,
        phone: this.querySelector('input[type="tel"]').value,
        email: this.querySelector('input[type="email"]').value,
        items: getCartItems(), // Функция должна возвращать товары в корзине
        total: document.getElementById('totalPrice').textContent
    };
    
    // Здесь можно отправить данные на сервер или просто показать
    console.log('Данные заказа:', formData);
    alert('Заказ оформлен! Мы свяжемся с вами в ближайшее время.');
    
    // Закрываем корзину и очищаем ее
    document.getElementById('cartModal').style.display = 'none';
    clearCart(); // Функция очистки корзины
});

// Вспомогательные функции (добавьте в script.js)
function getCartItems() {
    const items = [];
    document.querySelectorAll('.cart-item').forEach(item => {
        items.push({
            name: item.querySelector('h4').textContent,
            price: item.querySelector('.cart-item-controls span').textContent,
            quantity: item.querySelector('.quantity-controls span').textContent
        });
    });
    return items;
}

function clearCart() {
    document.querySelector('.cart-items').innerHTML = '';
    document.querySelector('.cart-count').textContent = '0';
    document.getElementById('totalPrice').textContent = '0';
}

