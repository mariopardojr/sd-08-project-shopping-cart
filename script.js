// const { promises } = require("fs");

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const cartBtn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  cartBtn.addEventListener('click', selectedProduct);
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(cartBtn);

  return section;
}

const clearCartBtn = () => {
  const clearBtn = document.querySelector('.empty-cart');
  clearBtn.addEventListener('click', () => {
    const allItems = document.querySelector('.cart__items');
    allItems.innerHTML = '';  
  });
}


function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.targe.remove();
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const loadMarket = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then((data) => {
    const localItems = document.querySelector('.items');
    data.results.map(e => {
      const product =({ sku: e.id, name: e.title, image: e.thumbnail });
      localItems.appendChild(createProductItemElement(product));
    });
    });
  };

const selectedProduct = (event) => {
  const itemId = event.target.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then(response => response.json())
  .then((object) => {
    listCart = document.querySelector('.cart__items');
    const product = {sku: object.id, name: object.name, salePrice: object.price};
    listCart.appendChild(createCartItemElement(product));
  });
};


window.onload = function onload() {
  loadMarket();
  clearCartBtn();
};
