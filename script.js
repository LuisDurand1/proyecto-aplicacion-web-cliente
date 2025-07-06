const API_TOKEN = 'patu4rl1RgVOkZQmf.63aefb3d103dd693730bff34df288a03b8a61bb495720383b51761c7f6a909e4';
const BASE_ID = 'appbMQJ3qhcx04rtO';
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/products_featured`;

// Retrieve cart products from localStorage or initialize an empty array
const cartProducts = JSON.parse(localStorage.getItem('cart')) || [];
const productsContent = document.querySelector('.products-content');

// Initialize empty arrays for different product categories
let productosPeripherals = [];
let productosVideoCards = [];
let productSearch = [];


const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');



//Mobile buttons functions
function toggleDropdownForOrder() {
    const dropdownMenu = document.querySelector('.dropdown');
    const isVisible = dropdownMenu && dropdownMenu.style.display === 'flex';

    dropdownMenu.style.display = isVisible ? 'none' : 'flex';
}

function toggleDropdownForFilter() {
    const dropdownMenu = document.querySelector('.dropdown-filter');
    const isVisible = dropdownMenu && dropdownMenu.style.display === 'contents';

    dropdownMenu.style.display = isVisible ? 'none' : 'contents';
}



const getProducts = async () => {
    try {
        const res = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        return data.records.map(r => r.fields);
    } catch (err) {
        console.error('Error al cargar productos:', err);
        return [];
    }
};


function createProductCard(product) {
    const divCard = document.createElement('div');
    divCard.classList.add('product-card');

    const divImg = document.createElement('div');
    divImg.classList.add('img-container');

    divImg.addEventListener('click', () => {
        window.location.href = `/sections/product.html?id=${product.id}`;
    });

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    divImg.appendChild(img);

    const h3 = document.createElement('h3');
    h3.innerText = product.name;

    h3.addEventListener('click', () => {
        window.location.href = `/sections/product.html?id=${product.id}`;
    });

    const divPrice = document.createElement('div');
    divPrice.classList.add('price');
    divPrice.innerText = `$${product.price}`;
    const divbuyButton = document.createElement('div');
    divbuyButton.classList.add('buy-button');
    divbuyButton.innerText = 'Comprar';

    divbuyButton.addEventListener('click', () => {
        const existingProduct = cartProducts.find(p => p.name === product.name);
        if (!existingProduct) {
            cartProducts.push(product);
            localStorage.setItem('cart', JSON.stringify(cartProducts));
        }
    }
    )

    divCard.append(divImg, h3, divPrice, divbuyButton);

    return divCard;
}


function mapProducts(products, container) {
    container.innerHTML = '';

    const productsFeatured = document.createElement('section');
    productsFeatured.classList.add('products-featured');

    const divCont = document.createElement('div');
    divCont.classList.add('cont');

    const divTitle = document.createElement('div');
    const h2 = document.createElement('h2');
    h2.innerText = container.dataset.title || '';
    divTitle.appendChild(h2);

    const divCardsContainer = document.createElement('div');
    divCardsContainer.classList.add('cards-container');

    products.forEach(product => {
        const card = createProductCard(product);
        divCardsContainer.appendChild(card);
    });

    divCont.append(divTitle, divCardsContainer);
    productsFeatured.appendChild(divCont);

    container.appendChild(productsFeatured);
}



async function renderAllSections() {
    const products = await getProducts();
    const params = new URLSearchParams(window.location.search);
    let min = Number(params.get('min')) || null;
    let max = Number(params.get('max')) || null;
    document.querySelectorAll('.products-content[data-category]').forEach(container => {
        const category = container.dataset.category;
        let filtered = products.filter(p => p.category === category);


        if (min !== null || max !== null) {
            filtered = filtered.filter(p => {
                const price = Number(p.price);
                if (min !== null && price < min) return false;
                if (max !== null && price > max) return false;
                return true;
            });
        }

        switch (category) {
            case 'peripherals':
                productosPeripherals = filtered;
            case 'video_cards':
                productosVideoCards = filtered;
            default:
                break;
        }

        mapProducts(filtered, container);
    });
}

function renderCartItems() {
    const cartItems = document.querySelector('.cart-items');
    const cartOverlay = document.getElementById('cart-overlay');
    cartItems.innerHTML = '';
    cartOverlay.style.display = 'flex';

    const body = document.querySelector('body');
    body.style.overflow = 'hidden';

    if (cartProducts.length === 0) {
        cartItems.style.backgroundColor = '#1A2A3A';
        const divCont = document.createElement('div');
        divCont.classList.add('cart-empty');
        const h2 = document.createElement('h2');
        h2.innerText = 'El carrito está vacío';

        divCont.appendChild(h2);
        cartItems.appendChild(divCont);
    } else {
        cartItems.style.backgroundColor = 'white';
        cartProducts.forEach(product => {
            const divCard = document.createElement('div');
            divCard.classList.add('cart-item');

            const divImg = document.createElement('div');
            divImg.classList.add('img');
            const img = document.createElement('img');
            img.src = product.image;
            img.alt = product.name;
            divImg.appendChild(img);

            const h3 = document.createElement('h3');
            h3.innerText = product.name;

            const divPrice = document.createElement('div');
            divPrice.classList.add('price');
            divPrice.innerText = `$${product.price}`;

            const divQuantity = document.createElement('div');
            divQuantity.classList.add('quantity');
            divQuantity.innerText = `Cantidad: ${product.quantity || 1}`;

            const divRemoveButton = document.createElement('div');
            divRemoveButton.classList.add('remove-button');
            divRemoveButton.innerText = 'Eliminar';

            divRemoveButton.addEventListener('click', () => {
                const index = cartProducts.findIndex(p => p.id === product.id);
                if (index > -1) {
                    cartProducts.splice(index, 1);
                    localStorage.setItem('cart', JSON.stringify(cartProducts));
                    renderCartItems();
                }
            });

            divCard.append(divImg, h3, divPrice, divQuantity, divRemoveButton);
            cartItems.appendChild(divCard);
        });
    }
}



function showCart() {
    const cartIcon = document.getElementById('cart-icon');
    cartIcon.addEventListener('click', renderCartItems);
}

function closeCart() {
    const closeCart = document.querySelector('.close-cart');
    closeCart.addEventListener('click', () => {
        const cartOverlay = document.getElementById('cart-overlay');
        const body = document.querySelector('body');

        body.style.overflow = 'auto';
        cartOverlay.style.display = 'none';
    })
}


function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function fetchProductById(id) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await res.json();
    console.log(data);
    return data.fields;
}


async function renderProductDetail() {
    const id = getProductIdFromUrl();
    if (!id) {
        document.getElementById('product-detail').innerText = 'Producto no encontrado';
        return;
    }
    const product = await fetchProductById(id);
    if (!product) {
        document.getElementById('product-detail').innerText = 'Producto no encontrado';
        return;
    }
    const detailDiv = document.getElementById('product-detail');
    detailDiv.innerHTML = `
        <h2>${product.name}</h2>
        <img src="${product.image}" alt="${product.name}" style="max-width:200px;">
        <p class="price">Precio: $${product.price}</p>
        <div class="description-container">
                <p id="product-description">${product.description || ''}</p>
        </div>
        `
        ;

    const divbuyButton = document.createElement('div');
    divbuyButton.classList.add('buy-button');
    divbuyButton.innerText = 'Comprar';



    divbuyButton.addEventListener('click', () => {
        const existingProduct = cartProducts.find(p => p.name === product.name);
        if (!existingProduct) {
            cartProducts.push(product);
            localStorage.setItem('cart', JSON.stringify(cartProducts));
        }
    }
    )

    detailDiv.appendChild(divbuyButton);
}


// Admin Productos

async function createProduct(fields) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields })
    });
    return res.json();
}

function renderCreateProductForm() {
    const formDiv = document.getElementById('create-product-form');
    formDiv.innerHTML = `
        <form id="new-product-form">
                        <strong>Crear nuevo producto</strong><br>
            <input type="text" name="name" placeholder="Nombre" required style="margin:4px 0; width:100%;">
            <input type="number" name="price" placeholder="Precio" required style="margin:4px 0; width:100%;">
            <select name="category" required style="margin:4px 0; width:100%;">
                <option value="">Selecciona categoría</option>
                <option value="products_featured">products_featured</option>
                <option value="month_offers">month_offers</option>
            </select>
            <textarea name="description" placeholder="Descripción" required style="margin:4px 0; width:100%;"></textarea>
            <input type="text" name="image" placeholder="URL Imagen" required style="margin:4px 0; width:100%;">
            <button type="submit" class="save-btn" style="margin-top:6px;">Crear</button>
        </form>
    `;

    formDiv.querySelector('#new-product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const fields = {
            name: form.name.value,
            price: parseFloat(form.price.value),
            category: form.category.value,
            description: form.description.value,
            image: form.image.value
        };
        await createProduct(fields);
        alert('Producto creado');
        form.reset();
        renderAdminListToEdit();
    });
}


async function updateProduct(id, fields) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields })
    });
    return res.json();
}

function renderProductRow(product) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" value="${product.name || ''}" data-field="name"></td>
        <td><input type="number" value="${product.price || ''}" data-field="price"></td>
         <td>
            <select data-field="category">
                <option value="products_featured" ${product.category === 'products_featured' ? 'selected' : ''}>products_featured</option>
                <option value="month_offers" ${product.category === 'month_offers' ? 'selected' : ''}>month_offers</option>
            </select>
        </td>
        <td><input type="text" value="${product.description || ''}" data-field="description"></td>
        <td><input type="text" value="${product.image || ''}" data-field="image"></td>
        <td>
            <button class="save-btn">Guardar</button>
        </td>
    `;

    tr.querySelector('.save-btn').addEventListener('click', async () => {
        const inputs = tr.querySelectorAll('input,select');
        const updatedFields = {};
        inputs.forEach(input => {
            const field = input.dataset.field;
            console.log(field);
            let value = input.value;

            if (field == "price") {
                value = parseFloat(value);
            }

            updatedFields[field] = value;
        });
        try {
            await updateProduct(product.id, updatedFields);
            alert('Producto actualizado');
        } catch (error) {
            alert('No se pudo actualizar el producto');
        }
    });

    return tr;
}

async function renderAdminListToEdit() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = `<strong>Editar productos</strong>
        <div class="admin-cards-container"></div>`;

    const cardsContainer = productList.querySelector('.admin-cards-container');

    getProducts().then(products => {
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'admin-product-card';

            card.innerHTML = `
                <div class="img-container">   
                <img src="${product.image}" alt="${product.name}" class="admin-product-img">
                </div>
                <div class="admin-product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price}</p>
                    <button class="edit-btn">Editar</button>
                </div>
            `;

            card.querySelector('.edit-btn').addEventListener('click', () => {
                openEditModal(product);
            });

            cardsContainer.appendChild(card);
        });
    });
}


function openEditModal(product) {
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'flex';

    document.getElementById('edit-product-image').src = product.image;
    document.getElementById('edit-name').value = product.name;
    document.getElementById('edit-price').value = product.price;
    document.getElementById('edit-category').value = product.category || '';
    document.getElementById('edit-description').value = product.description || '';
    document.getElementById('edit-image').value = product.image;

    // Guardar cambios
    const form = document.getElementById('edit-product-form');
    form.onsubmit = async (e) => {
        e.preventDefault();
        const fields = {
            name: document.getElementById('edit-name').value,
            price: parseFloat(document.getElementById('edit-price').value),
            category: document.getElementById('edit-category').value,
            description: document.getElementById('edit-description').value,
            image: document.getElementById('edit-image').value
        };
        await updateProduct(product.id, fields);
        alert('Producto actualizado');
        modal.style.display = 'none';
        renderAdminListToEdit();
    };

    // Cerrar modal
    document.getElementById('close-edit-modal').onclick = () => {
        modal.style.display = 'none';
    };
    // Cerrar al hacer click fuera del modal
    modal.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };
}


if (document.getElementById('create-product-form')){
    renderCreateProductForm();

}

if (document.getElementById('product-list')) {
    renderAdminListToEdit();
}

if (document.querySelector('.products-content')) {
    renderAllSections();
}


if (document.getElementById('product-detail')) {
    renderProductDetail();
}


if (document.getElementById('cart-icon')) {
    showCart();
    closeCart();
}



if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `/sections/products_search.html?search=${encodeURIComponent(query)}`;
        }
    });
}

function renderSortedProducts(products, container, order) {
    let sorted = [...products];
    if (order === 'asc') {
        sorted.sort((a, b) => a.price - b.price);
    } else if (order === 'desc') {
        sorted.sort((a, b) => b.price - a.price);
    }
    mapProducts(sorted, container);
}


document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);

    if (window.location.pathname.endsWith('products_search.html')) {
        const query = params.get('search')?.toLowerCase() || '';
        const products = await getProducts();

        const filtered = products.filter(p =>
            (p.name && p.name.toLowerCase().includes(query))
        );
        const container = document.querySelector('.products-content');
        container.innerHTML = '';

        if (filtered.length > 0) {
            mapProducts(filtered, container);
        } else {
            container.innerHTML = '<p>No se encontraron productos para tu búsqueda.</p>';
        }

        const sortProductsSearch = document.getElementById('sort-search');
        const lowPriceSearchMobile = document.getElementById('low-price-search');
        const highPriceSearchMobile = document.getElementById('high-price-search');
        sortProductsSearch.addEventListener('change', (e) => {
            renderSortedProducts(filtered, container, e.target.value);
        });

        if (lowPriceSearchMobile) {
            lowPriceSearchMobile.addEventListener('click', (e) => {
                e.preventDefault();
                renderSortedProducts(filtered, container, 'asc');
            });
        }
        if (highPriceSearchMobile) {
            highPriceSearchMobile.addEventListener('click', (e) => {
                e.preventDefault();
                renderSortedProducts(filtered, container, 'desc');
            });
        }

    }



    const sortPeripherals = document.getElementById('sort-peripherals');
    const containerPeripherals = document.querySelector('.products-content[data-category="peripherals"]');
    const lowPricePeripheralsMobile = document.getElementById('low-price-peripherals');
    const highPricePeripheralsMobile = document.getElementById('high-price-peripherals');
    if (sortPeripherals && containerPeripherals) {
        sortPeripherals.addEventListener('change', (e) => {
            renderSortedProducts(productosPeripherals, containerPeripherals, e.target.value);
        });

        if (lowPricePeripheralsMobile) {
            lowPricePeripheralsMobile.addEventListener('click', (e) => {
                e.preventDefault();
                renderSortedProducts(productosPeripherals, containerPeripherals, 'asc');
            });
        }

        if (highPricePeripheralsMobile) {
            highPricePeripheralsMobile.addEventListener('click', (e) => {
                e.preventDefault();
                renderSortedProducts(productosPeripherals, containerPeripherals, 'desc');
            });
        }
    }

    const sortVideoCards = document.getElementById('sort-video-cards');
    const containerVideoCards = document.querySelector('.products-content[data-category="video_cards"]');
    const lowPriceVideoCardsMobile = document.getElementById('low-price-video-cards');
    const highPriceVideoCardsMobile = document.getElementById('high-price-video-cards');
    if (sortVideoCards && containerVideoCards) {
        sortVideoCards.addEventListener('change', (e) => {
            renderSortedProducts(productosVideoCards, containerVideoCards, e.target.value);
        });

        if (lowPriceVideoCardsMobile) {
            lowPriceVideoCardsMobile.addEventListener('click', (e) => {
                e.preventDefault();
                renderSortedProducts(productosVideoCards, containerVideoCards, 'asc');
            });
        }

        if (highPriceVideoCardsMobile) {
            highPriceVideoCardsMobile.addEventListener('click', (e) => {
                e.preventDefault();
                renderSortedProducts(productosVideoCards, containerVideoCards, 'desc');
            });
        }
    }


});
