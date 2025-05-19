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

    // ==================== АВТОРИЗАЦИЯ ====================
    const initAuth = () => {
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
            
            // Всегда показываем уведомление о успешном входе
            showWelcomeNotification();
            
            // Закрываем модальное окно
            authModal.style.display = 'none';
            document.body.style.overflow = '';
            
            // Меняем кнопку на профиль
            const authBtn = document.getElementById('authBtn');
            authBtn.innerHTML = '<i class="fas fa-user-check"></i> Профиль';
        });

        // Функция показа уведомления
            function showWelcomeNotification() {
                const notification = document.createElement('div');
                notification.className = 'notification welcome';
                notification.innerHTML = `
                    <i class="fas fa-smile"></i>
                    <span>Рады вас видеть!</span>
                `;
                document.body.appendChild(notification);
                
                // Запускаем анимацию появления
                setTimeout(() => {
                    notification.classList.add('show');
                }, 10);
                
                // Автоскрытие через 2.5 секунды
                setTimeout(() => {
                    notification.classList.add('fade-out');
                    setTimeout(() => notification.remove(), 300);
                }, 2500);
            }
    };

    // ==================== ОФОРМЛЕНИЕ ЗАКАЗА ====================
    const initOrder = () => {
        document.getElementById('orderForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Собираем данные
            const formData = {
                name: this.querySelector('input[type="text"]').value,
                phone: this.querySelector('input[type="tel"]').value,
                email: this.querySelector('input[type="email"]').value,
                items: getCartItems(),
                total: document.getElementById('totalPrice').textContent
            };
            
            // Здесь можно отправить данные на сервер или просто показать

            
            // Закрываем корзину и очищаем ее
            document.getElementById('cartModal').style.display = 'none';
            clearCart();
        });
    };

    // Вспомогательные функции
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
        localStorage.removeItem('cart');
    }

    // Запуск всех функций
    initSlider();
    initCart();
    initAuth();
    initOrder();
});

document.addEventListener('DOMContentLoaded', function() {
    // Элементы
    const registerForm = document.querySelector('#register form');
    const registrationSuccess = document.getElementById('registrationSuccess');
    const overlay = document.getElementById('registrationOverlay');
    const closeSuccessModal = document.getElementById('closeSuccessModal');

    // Обработчик отправки формы регистрации
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Отменяем перезагрузку страницы

        // Проверка паролей (если нужно)
        const password = registerForm.querySelector('input[type="password"]').value;
        const confirmPassword = registerForm.querySelector('input[type="password"][placeholder="Повторите пароль"]').value;

        if (password !== confirmPassword) {
            alert('Пароли не совпадают!');
            return;
        }

        // Показываем окно успешной регистрации
        registrationSuccess.style.display = 'block';
        overlay.style.display = 'block';

        setTimeout(() => {
            registrationSuccess.style.display = 'none';
            overlay.style.display = 'none';
        }, 2000);
    });

    // Закрытие окна успеха
    closeSuccessModal.addEventListener('click', function() {
        registrationSuccess.style.display = 'none';
        overlay.style.display = 'none';
    });

    // Закрытие при клике на оверлей
    overlay.addEventListener('click', function() {
        registrationSuccess.style.display = 'none';
        overlay.style.display = 'none';
    });
});

// Элементы для окна заказа
const orderForm = document.getElementById('orderForm');
const orderSuccess = document.getElementById('orderSuccess');
const orderOverlay = document.getElementById('orderOverlay');
const closeOrderSuccess = document.getElementById('closeOrderSuccess');

// Обработчик отправки формы заказа
orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Показываем окно успеха
    orderSuccess.style.display = 'block';
    orderOverlay.style.display = 'block';
    
    // Автоматическое закрытие через 3 секунды
    setTimeout(() => {
        orderSuccess.style.display = 'none';
        orderOverlay.style.display = 'none';
    }, 3000);
});

// Закрытие по кнопке "Хорошо"
closeOrderSuccess.addEventListener('click', function() {
    orderSuccess.style.display = 'none';
    orderOverlay.style.display = 'none';
});

// Закрытие по клику на оверлей
orderOverlay.addEventListener('click', function() {
    orderSuccess.style.display = 'none';
    orderOverlay.style.display = 'none';
});

// Храним активный таймер
let notificationTimer = null;

function showCartNotification() {
    const notification = document.getElementById('cartNotification');
    
    // Сбрасываем предыдущий таймер, если он есть
    if (notificationTimer) {
        clearTimeout(notificationTimer);
    }
    
    // Сбрасываем анимацию
    notification.classList.remove('show', 'hide');
    // Принудительно вызываем перерасчёт стилей
    void notification.offsetWidth;
    
    // Показываем уведомление
    notification.classList.add('show');
    
    // Устанавливаем новый таймер
    notificationTimer = setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');
    }, 3000); // 3 секунды
}

// Обработчики для кнопок "В корзину"
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Ваш код добавления в корзину...
        
        // Показываем уведомление
        showCartNotification();
        
        // Обновляем счётчик
        updateCartCount();
    });
});

// ===== 1. Проверка авторизации при загрузке =====
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
});

// ===== 2. Основные функции =====
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    updateAuthUI(isLoggedIn);
}

function updateAuthUI(isLoggedIn) {
    const authBtn = document.getElementById('authBtn');
    const userAvatar = document.getElementById('userAvatar');
    
    if (isLoggedIn) {
        authBtn.style.display = 'none';
        userAvatar.style.display = 'flex';
    } else {
        authBtn.style.display = 'block';
        userAvatar.style.display = 'none';
    }
}

// ===== 3. Функции для входа/выхода =====
// Новая версия (вставьте это)
function showAuthMessage(title, text) {
    document.getElementById('authMessageTitle').textContent = title;
    document.getElementById('authMessageText').textContent = text;
    document.getElementById('authMessage').style.display = 'block';
    document.getElementById('authOverlay').style.display = 'block';
    
    // Автозакрытие через 3 секунды (по желанию)
    setTimeout(hideAuthMessage, 3000);
}

function hideAuthMessage() {
    document.getElementById('authMessage').style.display = 'none';
    document.getElementById('authOverlay').style.display = 'none';
}

// Обновлённые функции входа/выхода
function handleLogin() {
    localStorage.setItem('isLoggedIn', 'true');
    updateAuthUI(true);
    showAuthMessage('Вход выполнен', 'Вы успешно вошли в систему');
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    updateAuthUI(false);
    showAuthMessage('Выход выполнен', 'Вы вышли из системы');
}

// Обработчики закрытия окна
document.getElementById('closeAuthMessage').addEventListener('click', hideAuthMessage);
document.getElementById('authOverlay').addEventListener('click', hideAuthMessage);

// ===== 4. Работа с корзиной =====
function showCartNotification() {
    // Ваш код для показа уведомлений
}

function updateCartCount() {
    // Ваш код для обновления счетчика
}

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        showCartNotification();
        updateCartCount();
    });
});

// В вашей форме входа
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Здесь проверка логина/пароля
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Если проверка прошла успешно:
    handleLogin();
});
// Обработчик кнопки выхода
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.stopPropagation(); // Чтобы не срабатывал hover при клике
    handleLogout();
});

// Модифицируем функцию updateAuthUI
function updateAuthUI(isLoggedIn) {
    const authBtn = document.getElementById('authBtn');
    const userAvatar = document.getElementById('userAvatar');
    
    if (isLoggedIn) {
        authBtn.style.display = 'none';
        userAvatar.style.display = 'flex';
    } else {
        authBtn.style.display = 'block';
        userAvatar.style.display = 'none';
    }
}


// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  setupOrderForm();
});

function showCartNotification(productName = '') {
  const notification = document.getElementById('cartNotification');
  
  // Если передано название товара, показываем его
  if(productName) {
    notification.querySelector('span').textContent = `${productName} добавлен в корзину!`;
  }
  
  // Показываем уведомление
  notification.classList.add('show');
  
  // Автоматическое скрытие через 3 секунды
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

/* ADMIN*/
// Обработчик формы входа
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (email === 'admin@admin' && password === 'admin') {
        localStorage.setItem('isAdmin', 'true');
        window.location.href = 'admin-panel.html';
    } 
});

// Проверка авторизации при загрузке
if (window.location.pathname.includes('admin-panel')) {
    if (localStorage.getItem('isAdmin') !== 'true') {
        window.location.href = 'index.html';
    }
}


