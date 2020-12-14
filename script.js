const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

let cartSumPrices = 0;

function saveLocalStorage() {
  const cart = document.querySelector('.cart__items');
  localStorage.setItem('cart', cart.innerHTML);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.classList.add('removeOnClick');
  document.querySelector('.cart__items').removeChild(document.querySelector('.removeOnClick'));
  saveLocalStorage();
}

function loadCartFromLocalStorage() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart');
  document.querySelectorAll('li').forEach(li => li.addEventListener('click', cartItemClickListener));
}

function getLocalStoragePrice() {
  if (localStorage.length > 0) {
    document.querySelector('.display').innerHTML = localStorage.getItem('cart-sum');
  }
}

async function cartSumItems(id) {
  await fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json())
    .then((data) => {
      const { price } = data;
      cartSumPrices = parseInt(document.querySelector('.display').innerHTML, 10);
      cartSumPrices += price;
    });
  document.querySelector('.display').innerHTML = cartSumPrices;
  localStorage.setItem('cart-sum', cartSumPrices);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItemToCart(targetItemId) {
  fetch(`https://api.mercadolibre.com/items/${targetItemId}`)
    .then(response => response.json())
    .then((data) => {
      const { id, title, price } = data;
      const selectedItemObject = {
        sku: id,
        name: title,
        salePrice: price,
      };
      document.querySelector('.cart__items').appendChild(createCartItemElement(selectedItemObject));
      cartSumItems(id);
      saveLocalStorage();
    });
}

function selectItem(click) {
  click.target.classList.add('selected');
  const parentNodeFirstChildId = click.target.parentNode.firstChild.innerText;
  addItemToCart(parentNodeFirstChildId);
  click.target.classList.remove('selected');
}

// function clearChartList(click) {
//   document.querySelector('.chat__items').innerHTML = '';
//   localStorage.clear();
// }

// document.querySelector('.empty-chart').addEventListener('click', clearChartList);

function createCustomElement(element, className, innerText) {
  if (element === 'button') {
    const e = document.createElement(element);
    e.className = className;
    e.innerText = innerText;
    e.addEventListener('click', selectItem);
    return e;
  }
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

function fetchAPI(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => data.results.forEach((element) => {
      const elementObject = {
        sku: element.id,
        name: element.title,
        image: element.thumbnail,
      };
      document.querySelector('.items').appendChild(createProductItemElement(elementObject));
    }));
}

function clearChartList() {
  document.querySelector('.cart__items').innerHTML = '';
  document.querySelector('.display').innerHTML = 0;
  localStorage.clear();
}

const buttonClearAll = () => {
  const button = document.querySelector('button');
  button.addEventListener('click', clearChartList);
};

window.onload = function onload() {
  fetchAPI(API_URL); loadCartFromLocalStorage(); getLocalStoragePrice(); buttonClearAll();
};
