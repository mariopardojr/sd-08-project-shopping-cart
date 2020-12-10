function createLoading() {
  const cart = document.querySelector('.cart');
  const h2 = document.createElement('h2');
  h2.classList.add('loading');
  h2.innerText = 'loading...'
  cart.appendChild(h2);
}

function removeLoading() {
  const cart = document.querySelector('.cart');
  const h2 = document.querySelector('.loading');
  cart.removeChild(h2);
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

async function checkCurrentPrice() {
  const cart = document.querySelector('.cart__items');
  const priceTag = document.querySelector('.total-price');
  let price = 0;
  await cart.childNodes.forEach((li) => {
    price += getItemPrice(li);
  });
  priceTag.innerText = price;
}

async function handleCartAdd(event) {
  const cartList = document.querySelector('.cart__items');
  const itemSection = event.target.parentNode;
  const sku = getSkuFromProductItem(itemSection);
  createLoading();
  let productData = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const { id, title, price } = await productData.json();
  removeLoading();
  cartList.appendChild(createCartItemElement({sku: id, name: title, salePrice: price}));
  checkCurrentPrice();
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addToCartButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addToCartButton.addEventListener('click', handleCartAdd)
  section.appendChild(addToCartButton);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function getItemPrice(item) {
  return parseFloat(item.innerText.split('PRICE: $')[1]);
}

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
  checkCurrentPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function saveLocalStorage() {
  const cart = document.querySelector('.cart__items');
  localStorage.setItem('cartContent', cart.innerHTML);
}

function clearCart() {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = '';
  checkCurrentPrice();
}

window.onload = async function onload() {
  createLoading();
  const clearCartBtn = document.querySelector('.empty-cart');
  clearCartBtn.addEventListener('click', clearCart);
  const items = document.querySelector('.items');
  let products =  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  products = await products.json();
  removeLoading();
  products = products.results;
  products.forEach(({ id, title, thumbnail }) => {
    const product = { sku: id, name: title, image: thumbnail };
    items.appendChild(createProductItemElement(product));
  });
};
