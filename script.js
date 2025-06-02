const API_TOKEN = 'patu4rl1RgVOkZQmf.63aefb3d103dd693730bff34df288a03b8a61bb495720383b51761c7f6a909e4';
const BASE_ID = 'appbMQJ3qhcx04rtO';
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/`;

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



const getProducts = async (container) => {
    await fetch(API_URL + container.dataset.table, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(data => {
            mapProducts(data.records, container);
        })
        .catch(err => console.error('Error al cargar productos:', err));
}



const productsContent = document.querySelector('.products-content');

function createProductCard(product) {
    const divCard = document.createElement('div');
    divCard.classList.add('product-card');

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
    const divbuyButton = document.createElement('div');
    divbuyButton.classList.add('buy-button');
    divbuyButton.innerText = 'Comprar';

    divbuyButton.addEventListener('click', () => {
        const existingProduct = cartProducts.find(p => p.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            console.log('Adding product to cart:', product);
            console.log('Current cart:', cartProducts);
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
        const card = createProductCard(product.fields);
        divCardsContainer.appendChild(card);
    });

    divCont.append(divTitle, divCardsContainer);
    productsFeatured.appendChild(divCont);

    container.appendChild(productsFeatured);
}

document.addEventListener('DOMContentLoaded', async () => {
    const containers = document.querySelectorAll('.products-content[data-table]');
    await Promise.all(
        Array.from(containers).map(container => getProducts(container))
    );
});


function showCart() {
    const cartIcon = document.getElementById('cart-icon');
    const cartItems = document.querySelector('.cart-items');

    cartIcon.addEventListener('click', () => {
        const cartOverlay = document.getElementById('cart-overlay');

        const body = document.querySelector('body');
        body.style.overflow = 'hidden';
        cartItems.innerHTML = '';
        cartOverlay.style.display = 'flex'

        if (cartProducts.length === 0) {
            const divCont = document.createElement('div');
            divCont.classList.add('cart-empty');
            const h2 = document.createElement('h2');
            h2.innerText = 'El carrito está vacío';

            divCont.appendChild(h2);
            cartItems.appendChild(divCont);
        }

    })
    /* 
 
     cartContainer.innerHTML = '';
 
     if (cartProducts.length === 0) {
         cartContainer.innerHTML = '<p>No hay productos en el carrito.</p>';
         return;
     }
 
     const cartTitle = document.createElement('h2');
     cartTitle.innerText = 'Carrito de Compras';
     cartContainer.appendChild(cartTitle);
 
     const cartList = document.createElement('ul');
 
     cartProducts.forEach(product => {
         const listItem = document.createElement('li');
         listItem.innerText = `${product.name} - $${product.price} x ${product.quantity}`;
         cartList.appendChild(listItem);
     });
 
     cartContainer.appendChild(cartList); */
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



showCart();
closeCart();