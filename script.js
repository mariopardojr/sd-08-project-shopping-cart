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
  event.target.remove();
}
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  saverList();
  return li;
}
const productList = data =>
  data.map(({ id, title, thumbnail }) =>
    document.querySelector('.items').appendChild(
      createProductItemElement({
        sku: id,
        name: title,
        image: thumbnail,
      })));
const FetchMercadoLibreProduct = async (item) => {
  const response = await fetch(
    `https://api.mercadolibre.com/sites/MLB/search?q=$${item}`);
  const data = await response.json();
  productList(data.results);
};
const FetchMercadoLibrePrice = async (item) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${item}`);
  const data = await response.json();
  const cart = { sku: data.id, name: data.title, salePrice: data.price };
  document
    .querySelector('.cart__items')
    .appendChild(createCartItemElement(cart));
  saverList();
};
const addCart = () => {
  document.querySelectorAll('.item__add').forEach(element => element.addEventListener('click', ({ target }) => {
    const selected = getSkuFromProductItem(target.parentNode);
    FetchMercadoLibrePrice(selected);
  }));
};
function rightContentClear() {
  document
    .querySelector('.empty-cart')
    .addEventListener('click', () => {
      const getRightContent = document.querySelector('ol.cart__items');
      while (getRightContent.hasChildNodes()) {
        getRightContent.removeChild(getRightContent.firstChild);
      }
      saverList();
    });
}

function saverList() {
  localStorage.clear();
  localStorage.setItem('cartList', document.querySelector('ol.cart__items').innerHTML);
}
function loadList() {
  const storageLoad = localStorage.getItem('cartList');
  if (storageLoad) {
    document.querySelector('ol.cart__items').innerHTML = storageLoad;
  }
}

window.onload = async function onload() {
  loadList();
  await FetchMercadoLibreProduct('computador');
  await addCart();
  await rightContentClear();
};
