
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

async function sumPrices() {
  const cartItem = document.querySelectorAll('.cart__item');
  let total = 0;
  cartItem.forEach((element) => {
    total += parseFloat(element.innerText.split('$')[1]);
  });
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = total;
}

function cartItemClickListener(event) {
  event.target.remove();
  sumPrices();
  saveListItemsCartLocalStorage();
}

function saveListItemsCartLocalStorage() {
  const cartItems = document.querySelector('.cart__items');
  localStorage.setItem('list', cartItems.innerHTML);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
function fetchProducts() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((object) => {
      document.querySelector('.loading').remove();
      object.results.forEach((element) => {
        const obj = { sku: element.id, name: element.title, image: element.thumbnail };
        creatItems(obj);
      });
    });
}
function move(event) {
  if (event.target.className === 'item__add') {
    const parentNode = event.target.parentNode;
    const sku = parentNode.querySelector('.item__sku').innerText;
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(response => response.json())
      .then((object) => {
        const obj = { sku, name: object.title, salePrice: object.price };
        creatMoveItems(obj);
        sumPrices();
        saveListItemsCartLocalStorage();
      });
  }
}

function addProductCartItems() {
  const items = document.querySelector('.items');
  items.addEventListener('click', move);
}

function emptyCart() {
  const emptyCarts = document.querySelector('.empty-cart');
  emptyCarts.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
    sumPrices();
    saveListItemsCartLocalStorage();
  });
}

function getListCartItemsLocalStorage() {
  const cartItemsLocalStorage = localStorage.getItem('list');
  const carItems = document.querySelector('.cart__items');
  carItems.innerHTML = cartItemsLocalStorage;
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
}

function creatItems(obj) {
  const itens = document.querySelector('.items');
  itens.appendChild(createProductItemElement(obj));
}

function creatMoveItems(obj) {
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(createCartItemElement(obj));
}

window.onload = function onload() {
  fetchProducts();
  addProductCartItems();
  getListCartItemsLocalStorage();
  emptyCart();
  searchProduct();
};
