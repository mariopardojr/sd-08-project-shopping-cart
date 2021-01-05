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
  const itemBtn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  itemBtn.addEventListener('click', addCartItems);
  section.appendChild(itemBtn)
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
  getTotalPrices();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getTotalPrices() {
  const cart = document.querySelector('.cart__items');
  const element = document.querySelector('.total-price');
  let price = 0;
  cart.childNodes.forEach((li) => {
    price += getItemPrice(li);
  });
  element.innerText = price;
}

function getItemPrice(item) {
  return parseFloat(item.innerText.split('PRICE: $')[1]);
}

async function addCartItems(event) {
  const cart = document.querySelector('.cart__items');
  const item = event.target.parentNode;
  const sku = getSkuFromProductItem(item);
  const endPoint = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const { id, title, price } = await endPoint.json();
  cart.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
  getTotalPrices();
}

async function getProducts() {
  const items = document.querySelector('.items');
  const productsFetch = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const productsJson = await productsFetch.json();
  const products = productsJson.results;
  products.forEach(({ id, title, thumbnail }) => {
    const product = { sku: id, name: title, image: thumbnail };
    items.appendChild(createProductItemElement(product));
  });
}

window.onload = async function onload() {
  await getProducts();
};
