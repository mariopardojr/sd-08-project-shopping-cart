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

function removeFromLocalStorage(index) {
  const cartItems = localStorage.getItem('cart__items').split(' ');
  cartItems.splice(index, 1);
  localStorage.setItem('cart__items', cartItems.join(' '));
}

function cartItemClickListener(event) {
  let item = event.target;
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
}

function addToLocalStorage(id) {
  const cartItems = localStorage.getItem('cart__items');
  if (cartItems) {
    localStorage.setItem('cart__items', `${cartItems} ${id}`);
  } else {
    localStorage.setItem('cart__items', `${id}`);
  }
}

async function addToCart(event) {
  const id = getSkuFromProductItem(event.target.parentElement);
  addToLocalStorage(id);
  loadCartItem(id);
}

async function listProducts() {
  const items = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(res => res.json())
    .then(data => data.results);

  items.forEach((item) => {
    const { id: sku, title: name, thumbnail: image } = item;
    const product = createProductItemElement({ sku, name, image });
    product.querySelector('.item__add').addEventListener('click', addToCart);
    const section = document.querySelector('.items');
    section.appendChild(product);
  });
}

function cartInit() {
  const cartItems = localStorage.getItem('cart__items');
  if (cartItems && cartItems !== '') {
    cartItems.split(' ').forEach((id) => {
      loadCartItem(id);
    });
  }
}

function deleteCart() {
  document.querySelector('.cart__items').innerHTML = '';
}

window.onload = function onload() {
  listProducts();
  cartInit();
  document.querySelector('.empty-cart').addEventListener('click', deleteCart);
};
