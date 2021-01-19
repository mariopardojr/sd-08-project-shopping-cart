function saveLocalStorage() {
  const cart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cartContent', cart);
}

function Loading() {
  const cart = document.querySelector('.cart');
  const h2 = document.createElement('h2');
  h2.classList.add('loading');
  h2.innerText = 'loading...';
  cart.appendChild(h2);
}

function removeLoading() {
  const cart = document.querySelector('.cart');
  const h2 = document.querySelector('.loading');
  cart.removeChild(h2);
}

function getPrice(item) {
  return parseFloat(item.innerText.split('PRICE: $')[1]);
}

function updateTotalPrice() {
  const cart = document.querySelector('.cart__items');
  const priceElement = document.querySelector('.total-price');
  let price = 0;
  cart.childNodes.forEach((li) => {
    price += getPrice(li);
  });
  priceElement.innerText = price;
}


function shoopCartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
  updateTotalPrice();
  saveLocalStorage();
}

function bindCartRemoveItemEvent() {
  const cart = document.querySelector('.cart__items');
  cart.childNodes.forEach((li) => {
    li.addEventListener('click', shoopCartItemClickListener);
  });
}

function getLocalStorage() {
  const cart = document.querySelector('.cart__items');
  const storageContent = localStorage.getItem('cartContent');
  cart.innerHTML = storageContent;
  bindCartRemoveItemEvent();
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

function getSku(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', shoopCartItemClickListener);
  return li;
}

async function addToShoopCart(event) {
  const cartList = document.querySelector('.cart__items');
  const itemSection = event.target.parentNode;
  const sku = getSku(itemSection);
  Loading();
  const data = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const { id, title, price } = await data.json();
  removeLoading();
  cartList.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
  updateTotalPrice();
  saveLocalStorage();
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addToCartButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addToCartButton.addEventListener('click', addToShoopCart);
  section.appendChild(addToCartButton);

  return section;
}

function clearCart() {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = '';
  updateTotalPrice();
  saveLocalStorage();
}

function shoopCartFullClearEvent() {
  const clearCartBtn = document.querySelector('.empty-cart');
  clearCartBtn.addEventListener('click', clearCart);
}

async function FetchAndRenderProducts() {
  const items = document.querySelector('.items');
  const products = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const parsedProducts = await products.json();
  const productItems = parsedProducts.results;
  productItems.forEach(({ id, title, thumbnail }) => {
    const product = { sku: id, name: title, image: thumbnail };
    items.appendChild(createProductItemElement(product));
  });
}

window.onload = async function onload() {
  Loading();
  await FetchAndRenderProducts();
  shoopCartFullClearEvent();
  getLocalStorage();
  updateTotalPrice();
  removeLoading();
};
