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

function getCartItemPrice(item) {
  return item.match(/\$\d+.?\d+/)[0].slice(1);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function removeFromLocalStorage(index) {
  const cartItems = localStorage.getItem('cart__items').match(/<li(.+?)<\/li>/g);
  cartItems.splice(index, 1);
  localStorage.setItem('cart__items', cartItems.join('</li>'));
}

function addTotal(price) {
  const total = document.querySelector('.total-price');
  total.innerText = (parseFloat(total.innerText) + price).toFixed(2);
}

function cartItemClickListener(event) {
  let item = event.target;

  addTotal(-parseFloat(getCartItemPrice(item.innerText)));

  let index = 0;
  while (item.previousSibling) {
    item = item.previousSibling;
    index += 1;
  }

  removeFromLocalStorage(index);
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function loadCartItem(id) {
  const item = await fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(res => res.json());

  const { id: sku, title: name, price: salePrice } = item;

  const product = createCartItemElement({ sku, name, salePrice });
  product.addEventListener('click', cartItemClickListener);
  const cart = document.querySelector('.cart__items');
  cart.appendChild(product);
  addTotal(salePrice);
}

function addToLocalStorage() {
  const cartItems = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart__items', cartItems);
}

async function addToCart(event) {
  const id = getSkuFromProductItem(event.target.parentElement);
  await loadCartItem(id);
  addToLocalStorage();
}

async function listProducts() {
  const items = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(res => res.json())
    .then(data => data.results);

  document.querySelector('.loading').remove();

  items.forEach((item) => {
    const { id: sku, title: name, thumbnail: image } = item;
    const product = createProductItemElement({ sku, name, image });
    product.querySelector('.item__add').addEventListener('click', addToCart);
    const section = document.querySelector('.items');
    section.appendChild(product);
  });
}


function cartInit() {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = localStorage.getItem('cart__items');
  cart.childNodes.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
    addTotal(parseFloat(getCartItemPrice(item.innerText)));
  });
}

function deleteCart() {
  document.querySelector('.total-price').innerHTML = '0.00';
  document.querySelector('.cart__items').innerHTML = '';
  localStorage.setItem('cart__items', '');
}

window.onload = function onload() {
  listProducts();
  cartInit();
  document.querySelector('.empty-cart').addEventListener('click', deleteCart);
};
