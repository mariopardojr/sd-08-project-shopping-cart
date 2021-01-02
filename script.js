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
  event.currentTarget.remove();
}
let totalprice = 0;
async function fetchId(id) {
  return fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json());
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
async function addItemToCart(evt) {
  const parent = evt.target.parentNode;
  const id = getSkuFromProductItem(parent);
  const { id: sku, title: name, price: salePrice } = await fetchId(id);
  const ol = document.querySelector('.cart__items');
  ol.appendChild(createCartItemElement({ sku, name, salePrice }));
  totalprice += salePrice;
  localStorage.setItem('prices', totalprice);
  const spann = document.querySelector('.total-price');
  spann.innerText = `Preço Total:${totalprice} `;
  localStorage.setItem('lists', ol.innerHTML);
}
function fetchResponse() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json()).then(data => data.results);
}
function createItemsElements(items) {
  const item = document.querySelector('.items');
  item.addEventListener('click', addItemToCart);
  items.forEach((Element) => {
    const { id: sku, title: name, thumbnail: image } = Element;
    item.appendChild(createProductItemElement({ sku, name, image }));
  });
}

function addSpan() {
  const ol = document.querySelector('.cart__items');
  const span = document.createElement('span');
  span.className = 'total-price';
  span.innerText = `Preço Total:${totalprice} `;
  ol.parentNode.appendChild(span);
}

function addEventListenerClean() {
  const button = document.querySelector('.empty-cart');

  button.addEventListener('click', () => {
    const cartItemSelector = document.querySelectorAll('.cart__item');
    cartItemSelector.forEach(element => element.remove());
    totalprice = 0;
    const spann = document.querySelector('.total-price');
    spann.innerText = `Preço Total:${totalprice} `;
  });
}

function storageCart() {
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = localStorage.getItem('lists');
  totalprice = +((localStorage.getItem('prices')));
}
async function deleteLoading() {
  const deleteLoad = document.querySelector('.loading');
  deleteLoad.remove();
}

window.onload = async function () {
  await deleteLoading();
  storageCart();
  addSpan();
  addEventListenerClean();
  const items = await fetchResponse();
  createItemsElements(items);
};
