// const { promises } = require("fs");

function saveStorage() {
  const cart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cart);
}

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


  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
  saveStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchMercado = () => new Promise(() => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then((data) => {
    const obj = data.results.map(e => ({ sku: e.id, name: e.title, image: e.thumbnail }));
    obj.forEach((elemento) => {
      const localItems = document.querySelector('.items');
      localItems.appendChild(createProductItemElement(elemento));
    });
    const localItems = document.querySelector('.items');
    localItems.addEventListener('click', function (event) {
      if (event.target.className === 'item__add') {
        const idProduct = getSkuFromProductItem(event.target.parentNode);
        fetch(`https://api.mercadolibre.com/items/${idProduct}`)
        .then(response => response.json())
        .then((data2) => {
          const { id: sku, title: name, price: salePrice } = data2;
          const cartLi = document.querySelector('ol , .cart__items');
          cartLi.appendChild(createCartItemElement({ sku, name, salePrice }));
          saveStorage();
        });
      }
    });
  });
});

function loadCart() {
  const cartStorage = localStorage.getItem('cart');
  document.querySelector('.cart__items').innerHTML = cartStorage;
}


window.onload = function onload() {
  fetchMercado();
  loadCart();
};
