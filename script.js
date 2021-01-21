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

function saveLocal() {
  localStorage.clear();

  const cart = document.querySelector('.cart__items');
  localStorage.setItem('cart', cart.innerHTML);
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

const priceTotal = () => {
  let total = 0;
  const totalCart = document.querySelectorAll('.cart__item');
  totalCart.forEach((element) => {
    total += parseFloat(element.innerHTML.split('$')[1]);
  });
  document.querySelector('.total-price').innerText = total;
};
function cartItemClickListener(event) {
  const cartRemove = document.querySelector('.cart__items');
  cartRemove.removeChild(event.target);
  priceTotal();
  saveLocal();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  const itensCart = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  itensCart.appendChild(li);
  return li;
}

function addingToCart(product) {
  const addItem = document.querySelector('.cart__items');
  const addlist = createCartItemElement(product);
  addItem.appendChild(addlist);
  priceTotal();
  saveLocal();
}

function listProducts() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint)
  .then(response => response.json())
  .then(infos => infos.results.forEach((item) => {
    const objects = document.querySelector('.items');
    objects.appendChild(createProductItemElement(item));
  }));
}

listProducts();

function searchItens(itemId) {
  const endpoint = `https://api.mercadolibre.com/items/${itemId}`;
  fetch(endpoint)
  .then(response => response.json())
  .then(infos => addingToCart(infos));
}

const addToList = (event) => {
  if (event.target.className === 'item__add') {
    const itemId = getSkuFromProductItem(event.target.parentElement);
    searchItens(itemId);
  }
};

const cartItens = () => {
  const getClick = document.querySelector('.items');
  getClick.addEventListener('click', addToList);
};

function clearCart() {
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', () => {
    const productsInCart = document.querySelector('.cart__items');
    productsInCart.innerHTML = '';
    sumValueItemsCart();
    saveLocal();
  });
}

setTimeout(() => {
  document.querySelector('.loading').remove();
  firsLoading('computador');
}, 3000);

function loadFromLocal() {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = localStorage.getItem('cart');
}

window.onload = function onload() {
  cartItens();
  clearCart();
  loadFromLocal();
};
