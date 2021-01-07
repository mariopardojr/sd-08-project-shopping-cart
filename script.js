// const fetch = require('node-fetch');

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

const sumCartPrices = () => {
  let sum = 0;
  const olCartLocal = document.querySelectorAll('.cart__item');
  for (let index = 0; index < olCartLocal.length; index += 1) {
    const idElemento = String(olCartLocal[index].innerText).split('$')[1];
    sum += Number(idElemento);
  }
  const cartLocal = document.querySelector('.cart');
  if (cartLocal.lastChild.className === 'total-price') {
    cartLocal.lastChild.innerText = sum;
  } else {
    const span = document.createElement('span');
    span.className = 'total-price';
    span.innerText = sum;
    cartLocal.appendChild(span);
  }
};

async function clearCart() {
  const olCartLocal = document.querySelector('.cart__items');
  while (olCartLocal.firstChild) {
    olCartLocal.removeChild(olCartLocal.firstChild);
  }
  localStorage.clear();
  await sumCartPrices();
}

async function cartItemClickListener(event) {
  const olCartLocal = await document.querySelector('ol, .cart__items');
  await olCartLocal.removeChild(event.target);
  await localStorage.removeItem(String(event.target.id));
  await sumCartPrices();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.id = sku;
  localStorage.setItem(sku, li.innerText);
  return li;
}

async function innerCartNewElement(idElemento) {
  const dataEle = await fetch(`https://api.mercadolibre.com/items/${idElemento}`)
    .then(response => response.json());
  const { id: sku, title: name, price: salePrice } = await dataEle;
  const olCartLocal = await document.querySelector('ol, .cart__items');
  await olCartLocal.appendChild(createCartItemElement({ sku, name, salePrice }));
  await sumCartPrices();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.addEventListener('click', function (event) {
    if (event.target.className === 'item__add') {
      const idSku = getSkuFromProductItem(event.target.parentNode);
      innerCartNewElement(idSku);
    }
  });
  return section;
}

const fetchMBL = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((data) => {
      const itemsLocal = document.querySelector('.items');
      itemsLocal.innerText = '';
      const compMBL = data.results.map(el => ({ sku: el.id, name: el.title, image: el.thumbnail }));
      compMBL.forEach((element) => {
        itemsLocal.appendChild(createProductItemElement(element));
      });
    });
};

function openLocalStorage() {
  if (localStorage.length !== 0) {
    const lSArray = Object.values(localStorage);
    const lSArrayKeys = Object.keys(localStorage);
    const olCartLocal = document.querySelector('ol, .cart__items');
    for (let index = 0; index < lSArray.length; index += 1) {
      const li = document.createElement('li');
      li.innerText = lSArray[index];
      li.className = 'cart__item';
      li.innerText = lSArray[index];
      li.addEventListener('click', cartItemClickListener);
      li.id = lSArrayKeys[index];
      olCartLocal.appendChild(li);
    }
  }
}

window.onload = async function onload() {
  fetchMBL();
  openLocalStorage();
  const itemsLocal = document.querySelector('.loading');
  itemsLocal.innerText = 'loading';
  await sumCartPrices();
};
