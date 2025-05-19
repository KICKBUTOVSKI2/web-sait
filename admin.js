// Основной модуль админ-панели
console.log('Админ-скрипт загружен!');

// Пустые моковые данные (будут заменены на API)
const mockData = {
    orders: [
        {
            id: 0,
            date: 'YYYY-MM-DD',
            customer: 'Клиент',
            amount: 0,
            status: 'processing',
            items: [
                { name: 'Товар', price: 0, quantity: 1 }
            ]
        }
    ],
    products: [
        { id: 0, name: 'Товар', price: 0, stock: 0, category: 'Категория' }
    ],
    customers: [
        { id: 0, name: 'Клиент', email: 'email@example.com', phone: '+70000000000', orders: 0 }
    ],
    stats: {
        totalOrders: 0,
        totalRevenue: 0,
        popularProducts: [
            { name: 'Товар', orders: 0 }
        ]
    }
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    
    initSidebar();
    initModal();
    loadDashboard();
    
    document.getElementById('logoutBtn').addEventListener('click', logout);
});

// Функция проверки авторизации
function checkAuth() {
    if (localStorage.getItem('isAdmin') !== 'true') {
        window.location.href = '../index.html';
        return false;
    }
    return true;
}

// Инициализация бокового меню
function initSidebar() {
    document.querySelectorAll('.admin-sidebar li').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.admin-sidebar li').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const section = this.dataset.section;
            showSection(section);
        });
    });
}

// Показ соответствующего раздела
function showSection(section) {
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    
    const activeSection = document.getElementById(`${section}Section`);
    if (activeSection) {
        activeSection.classList.add('active');
        
        switch(section) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'orders':
                loadOrders();
                break;
            case 'products':
                loadProducts();
                break;
            case 'customers':
                loadCustomers();
                break;
            case 'stats':
                loadStats();
                break;
        }
    }
}

// ======================== РАЗДЕЛ "ГЛАВНАЯ" ========================
function loadDashboard() {
    const section = document.getElementById('dashboardSection');
    section.innerHTML = `
        <div class="dashboard-grid">
            <div class="dashboard-card">
                <h3><i class="fas fa-shopping-bag"></i> Заказы</h3>
                <div class="card-value">0</div>
                <div class="card-label">Всего заказов</div>
            </div>
            <div class="dashboard-card">
                <h3><i class="fas fa-ruble-sign"></i> Доход</h3>
                <div class="card-value">0 ₽</div>
                <div class="card-label">Общий доход</div>
            </div>
            <div class="dashboard-card">
                <h3><i class="fas fa-box"></i> Товары</h3>
                <div class="card-value">0</div>
                <div class="card-label">Товаров в каталоге</div>
            </div>
            <div class="dashboard-card">
                <h3><i class="fas fa-users"></i> Клиенты</h3>
                <div class="card-value">0</div>
                <div class="card-label">Зарегистрировано</div>
            </div>
        </div>
        
        <div class="recent-orders">
            <h3><i class="fas fa-clock"></i> Последние заказы</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Клиент</th>
                        <th>Сумма</th>
                        <th>Статус</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="4" class="empty-placeholder">Нет данных</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

// ======================== РАЗДЕЛ "ЗАКАЗЫ" ========================
function loadOrders() {
    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="empty-placeholder">Нет данных о заказах</td>
        </tr>
    `;
}

function showOrderDetails() {
    const modal = document.getElementById('orderModal');
    document.getElementById('orderId').textContent = '0';
    
    document.querySelector('.order-details').innerHTML = `
        <div class="detail-row">
            <span class="detail-label">Клиент:</span>
            <span class="detail-value">Клиент</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Дата:</span>
            <span class="detail-value">YYYY-MM-DD</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Статус:</span>
            <span class="detail-value status-badge processing">В обработке</span>
        </div>
        <h4>Состав заказа:</h4>
        <ul class="order-items">
            <li>
                <span>Товар</span>
                <span>1 × 0 ₽ = 0 ₽</span>
            </li>
        </ul>
        <div class="order-total">
            <strong>Итого:</strong> 0 ₽
        </div>
    `;
    modal.style.display = 'block';
}

// ======================== РАЗДЕЛ "ТОВАРЫ" ========================
// ======================== РАЗДЕЛ "ТОВАРЫ" ========================
function loadProducts() {
    const section = document.getElementById('productsSection');
    section.innerHTML = `
        <div class="section-header">
            <h2><i class="fas fa-box"></i> Управление товарами</h2>
            <div class="section-actions">
                <button class="btn-refresh"><i class="fas fa-sync-alt"></i></button>
                <button class="btn-add" id="addProductBtn"><i class="fas fa-plus"></i> Добавить товар</button>
                <button class="btn-export"><i class="fas fa-file-export"></i> Экспорт</button>
            </div>
        </div>
        <div class="table-container">
            <table id="productsTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Категория</th>
                        <th>Цена</th>
                        <th>Остаток</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="6" class="empty-placeholder">Нет данных о товарах</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <!-- Модальное окно добавления товара -->
        <div id="addProductModal" class="modal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3><i class="fas fa-plus-circle"></i> Добавить новый товар</h3>
                <form id="productForm">
                    <div class="form-group">
                        <label for="productName">Название товара:</label>
                        <input type="text" id="productName" required>
                    </div>
                    <div class="form-group">
                        <label for="productCategory">Категория:</label>
                        <select id="productCategory" required>
                            <option value="Цветы">Цветы</option>
                            <option value="Букеты">Букеты</option>
                            <option value="Растения">Растения</option>
                            <option value="Аксессуары">Аксессуары</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="productPrice">Цена (₽):</label>
                        <input type="number" id="productPrice" min="0" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="productStock">Количество на складе:</label>
                        <input type="number" id="productStock" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="productImage">Изображение (URL):</label>
                        <input type="text" id="productImage" placeholder="https://example.com/image.jpg">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Добавить товар</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Инициализация модального окна
    const modal = document.getElementById('addProductModal');
    const addBtn = document.getElementById('addProductBtn');
    const closeBtn = modal.querySelector('.close-modal');
    
    addBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Обработка формы добавления товара
    document.getElementById('productForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newProduct = {
            id: generateId(),
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            price: parseFloat(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            image: document.getElementById('productImage').value || 'img/default-product.jpg'
        };
        
        // Добавляем товар в массив (в реальном проекте будет запрос к API)
        mockData.products.push(newProduct);
        
        // Закрываем модальное окно
        modal.style.display = 'none';
        
        // Обновляем таблицу товаров
        renderProductsTable();
        
        // Очищаем форму
        this.reset();
        
        // Показываем уведомление
        showNotification('Товар успешно добавлен!');
    });
}

// Генерация ID для нового товара
function generateId() {
    return mockData.products.length > 0 
        ? Math.max(...mockData.products.map(p => p.id)) + 1 
        : 1;
}

// Отрисовка таблицы товаров
function renderProductsTable() {
    const tbody = document.querySelector('#productsTable tbody');
    
    if (mockData.products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-placeholder">Нет данных о товарах</td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = mockData.products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.price} ₽</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn-edit"><i class="fas fa-edit"></i></button>
                <button class="btn-delete"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Показ уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ======================== РАЗДЕЛ "КЛИЕНТЫ" ========================
function loadCustomers() {
    const section = document.getElementById('customersSection');
    section.innerHTML = `
        <div class="section-header">
            <h2><i class="fas fa-users"></i> Управление клиентами</h2>
            <div class="section-actions">
                <button class="btn-refresh"><i class="fas fa-sync-alt"></i></button>
                <button class="btn-export"><i class="fas fa-file-export"></i> Экспорт</button>
            </div>
        </div>
        <div class="table-container">
            <table id="customersTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Email</th>
                        <th>Телефон</th>
                        <th>Заказов</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="6" class="empty-placeholder">Нет данных о клиентах</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

// ======================== РАЗДЕЛ "СТАТИСТИКА" ========================
function loadStats() {
    const section = document.getElementById('statsSection');
    section.innerHTML = `
        <div class="section-header">
            <h2><i class="fas fa-chart-bar"></i> Статистика магазина</h2>
            <div class="section-actions">
                <select id="statsPeriod">
                    <option value="week">За неделю</option>
                    <option value="month">За месяц</option>
                    <option value="year">За год</option>
                </select>
                <button class="btn-refresh"><i class="fas fa-sync-alt"></i></button>
            </div>
        </div>
        
        <div class="stats-grid">
            <div class="stats-card">
                <h3>Продажи</h3>
                <div class="empty-chart">График будет отображаться здесь</div>
            </div>
            <div class="stats-card">
                <h3>Популярные товары</h3>
                <div class="empty-placeholder">Нет данных</div>
            </div>
        </div>
    `;
}

// ======================== ОБЩИЕ ФУНКЦИИ ========================
function initModal() {
    const modal = document.getElementById('orderModal');
    document.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function getStatusText(status) {
    const statuses = {
        'completed': 'Выполнен',
        'processing': 'В обработке',
        'cancelled': 'Отменен'
    };
    return statuses[status] || status;
}

function logout() {
    localStorage.removeItem('isAdmin');
    window.location.href = '../index.html';
}

// Экспорт данных
function exportOrders() {
    console.log('Функция экспорта данных');
}