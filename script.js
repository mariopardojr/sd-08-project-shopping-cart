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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function loading() {
  const loadingMessage = document.querySelector('.loading');
  loadingMessage.remove();
}

async function productList(products) {
  const itemsSection = document.querySelector('.items');

  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${products}`);
  const { results } = await response.json();
  loading();
  results.forEach(product => itemsSection.appendChild(createProductItemElement(product)));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveShoppingCart() {
  const cart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cart);
}

function cartItemClickListener(event) {
  const parent = event.target.parentElement;
  parent.removeChild(event.target);
  saveShoppingCart();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

// fiz com a ajuda do plantão do shopping cart durante o recesso
function sumValueOfCartItems() {
  const items = document.querySelectorAll('.cart__item');
  let sum = 0;
  items.forEach((item) => {
    sum += parseFloat(item.innerHTML.split('$')[1]);
  });
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = Math.round(sum * 100) / 100;
}

function addProductToCart() {
  const items = document.querySelector('.items');

  items.addEventListener('click', async (event) => {
    if (event.target.classList.contains('item__add')) {
      const parent = event.target.parentElement;
      const response = await fetch(`https://api.mercadolibre.com/items/${getSkuFromProductItem(parent)}`);
      const results = await response.json();
      const cartItem = document.querySelector('.cart__items');
      cartItem.appendChild(createCartItemElement(results));
      saveShoppingCart();
      sumValueOfCartItems();
    }
  });
}

function loadShoppingCart() {
  const itemsSavedFromCart = localStorage.getItem('cart');
  const cartItem = document.querySelector('.cart__items');
  cartItem.innerHTML = itemsSavedFromCart;
  cartItem.addEventListener('click', (event) => {
    if (event.target.classList.contains('cart__item')) {
      cartItemClickListener(event);
      sumValueOfCartItems();
    }
  });
  sumValueOfCartItems();
}

function emptyCart() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const cartItem = document.querySelector('.cart__items');
    cartItem.innerHTML = '';
    saveShoppingCart();
    sumValueOfCartItems();
  });
}

window.onload = () => {
  productList('computador');
  addProductToCart();
  loadShoppingCart();
  emptyCart();
};
