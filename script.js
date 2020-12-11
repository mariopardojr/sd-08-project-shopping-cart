let cartItems = [];

function getItem(id) {
  return fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json())
    .then(data => data);
}

function getCartTotal() {
  return new Promise(async (resolve) => {
    const itemsPromises = cartItems.map(cartItem => getItem(cartItem.id));
    const items = await Promise.all(itemsPromises).then(data => data);
    const total = items.reduce((acc, cur) => acc + cur.price, 0);
    resolve(total);
  });
}

function updateCartTotal() {
  return new Promise(async (resolve) => {
    const total = await getCartTotal();
    const totalElement = document.querySelector('.total-price');
    totalElement.textContent = `${total}`;
    resolve('success');
  });
}

function updateStorage() {
  localStorage.setItem('cartItems', JSON.stringify(cartItems.map(item => item.id)));
}

async function removeCartItem(itemToRemove) {
  cartItems = cartItems.filter(item => item.elem !== itemToRemove);
  await updateCartTotal();
  itemToRemove.remove();
  updateStorage();
}

function cartItemClickListener(event) {
  removeCartItem(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createCartItem(id) {
  return new Promise(async (resolve) => {
    const item = await getItem(id);
    const { id: sku, title: name, price: salePrice } = item;
    const newCartItem = createCartItemElement({ sku, name, salePrice });
    resolve(newCartItem);
  });
}

async function addCartItem(id) {
  const itemsContainer = document.querySelector('.cart__items');
  const newItem = await createCartItem(id);
  cartItems.push({ id, elem: newItem });
  await updateCartTotal();
  itemsContainer.appendChild(newItem);
  updateStorage();
}

async function init() {
  const savedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  savedItems.reduce((curPromise, id) => (
    curPromise.then(() => addCartItem(id))
  ), Promise.resolve());
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

async function clearCart() {
  cartItems = [];
  const itemsContainer = document.querySelector('.cart__items');
  Array.from(itemsContainer.children).forEach(item => item.remove());
  updateCartTotal();
  updateStorage();
}

function addItemToCartHandler(event) {
  if (event.target.classList.contains('item__add')) {
    const parent = event.target.parentNode;
    const id = getSkuFromProductItem(parent);
    addCartItem(id);
  }
}

async function createItems() {
  const items = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => data.results);

  document.querySelector('.loading').remove();
  const itemsContainer = document.querySelector('.items');
  items.forEach((item) => {
    const { id: sku, title: name, thumbnail: image } = item;
    const productItem = createProductItemElement({ sku, name, image });
    productItem.addEventListener('click', addItemToCartHandler);
    itemsContainer.appendChild(productItem);
  });
}

window.onload = function onload() {
  createItems();
  init();
  document.querySelector('.empty-cart').addEventListener('click', clearCart);
};
