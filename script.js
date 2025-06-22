const API_TOKEN = 'patu4rl1RgVOkZQmf.63aefb3d103dd693730bff34df288a03b8a61bb495720383b51761c7f6a909e4';
const BASE_ID = 'appbMQJ3qhcx04rtO';
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/products_featured`;

const cartProducts = JSON.parse(localStorage.getItem('cart')) || [];


function toggleDropdownForOrder() {
    const dropdownMenu = document.querySelector('.dropdown');
    const isVisible = dropdownMenu && dropdownMenu.style.display === 'flex';

    dropdownMenu.style.display = isVisible ? 'none' : 'flex';
}

function toggleDropdownForFilter() {
    const dropdownMenu = document.querySelector('.dropdown-filter');
    const isVisible = dropdownMenu && dropdownMenu.style.display === 'block';

    dropdownMenu.style.display = isVisible ? 'none' : 'block';
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



const productsContent = document.querySelector('.products-content');

function createProductCard(product) {
    const divCard = document.createElement('div');
    divCard.classList.add('product-card');

    const divImg = document.createElement('div');
    divImg.classList.add('img');

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

/* document.addEventListener('DOMContentLoaded', async () => {
    const containers = document.querySelectorAll('.products-content[data-table]');
    await Promise.all(
        Array.from(containers).map(container => getProducts(container))
    );
}); */

async function renderAllSections() {
    const products = await getProducts();
    document.querySelectorAll('.products-content[data-category]').forEach(container => {
        const category = container.dataset.category;
        const filtered = products.filter(p => p.category === category);
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
                    renderCartItems(); // Solo actualiza la vista del carrito
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
        <img src="../${product.image}" alt="${product.name}" style="max-width:200px;">
        <p>Precio: $${product.price}</p>
        <p>${product.description || ''}</p>
        <!-- Agrega más campos si lo deseas -->
    `;

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
        <td><input type="text" value="${product.category || ''}" data-field="category"></td>
        <td><input type="text" value="${product.image || ''}" data-field="image"></td>
        <td>
            <button class="save-btn">Guardar</button>
        </td>
    `;

    tr.querySelector('.save-btn').addEventListener('click', async () => {
        const inputs = tr.querySelectorAll('input');
        const updatedFields = {};
        inputs.forEach(input => {
            const field = input.dataset.field;
            let value = input.value;
            
            if (field == "price") {
            value = parseFloat(value);
            }

            updatedFields[field] = value;
        });
        await updateProduct(product.id, updatedFields);
        alert('Producto actualizado');
    });

    return tr;
}

async function renderAdminList() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = `<table>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Imagen</th>
                <th>Acción</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>`;
    const tbody = productList.querySelector('tbody');
    const products = await getProducts();
    products.forEach(product => {
        tbody.appendChild(renderProductRow(product));
    });
}



if (document.getElementById('product-list')) {
    renderAdminList();
}


if (document.getElementById('product-detail')) {
    renderProductDetail();
}


if (document.querySelector('.products-content')) {
    renderAllSections();


}

if (document.getElementById('cart-icon')) {
    showCart();
    closeCart();
}