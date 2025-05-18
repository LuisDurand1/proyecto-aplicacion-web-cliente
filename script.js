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
    const response = await fetch('https://dummyjson.com/products?limit=100');
    const data = await response.json();
    console.log(data.products);
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


    divCard.append(divImg, h3, divPrice, divbuyButton);
   
    return divCard;
}


function mapProducts(products, container) {
    const productsFeatured = document.createElement('section');
    productsFeatured.classList.add('products-featured');

    const divCont = document.createElement('div');
    divCont.classList.add('cont');


    const divTitle = document.createElement('div');
    const h2 = document.createElement('h2');
    h2.innerText = container.dataset.title;
    divTitle.appendChild(h2);


    const divCardsContainer = document.createElement('div');
    divCardsContainer.classList.add('cards-container');


    products.forEach(product => {
     const card= createProductCard(product);
     divCardsContainer.appendChild(card);
    });


    divCont.append(divTitle, divCardsContainer);

    productsFeatured.appendChild(divCont);

    productsContent.appendChild(productsFeatured);
}

document.addEventListener('DOMContentLoaded', () => {
document.querySelectorAll('.products-content[data-json]').forEach(container => {
    const jsonFile = container.dataset.json;
    fetch(`data/${jsonFile}`)
      .then(res => res.json())
      .then(data => {
        mapProducts(data.products, container);
      })
      .catch(err => console.error('Error al cargar productos:', err));
  });
})