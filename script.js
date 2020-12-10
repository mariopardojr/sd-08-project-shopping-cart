function saveInLocalStorage() {
  const cartItems = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cartItems);
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

function cartTotal() {
  const listItems = document.querySelectorAll('.cart__item');
  let total = 0;
  listItems.forEach((item) => {
    total += parseFloat(item.innerHTML.split('$')[1]);
  });
  document.querySelector('.total-price').innerHTML = total;
}

function cartItemClickListener(event) {
  const elementToRemove = event.target;
  elementToRemove.parentElement.removeChild(elementToRemove);
  cartTotal();
  saveInLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

function createLoading() {
  const body = document.body;
  const loading = document.createElement('h1');
  loading.className = 'loading';
  loading.innerHTML = 'loading...';
  body.appendChild(loading);
}

function removeLoading() {
  const body = document.body;
  const loading = document.querySelector('.loading');
  body.removeChild(loading);
}

function generateItemsList() {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  createLoading();
  fetch(API_URL)
    .then(response => response.json())
    .then((data) => {
      removeLoading();
      data.results.forEach((item) => {
        const obj = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(obj));
      });
    });
}

function addItemToCart() {
  document.querySelector('.items').addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const parentElement = event.target.parentElement;
      const sku = getSkuFromProductItem(parentElement);
      const skuURL = `https://api.mercadolibre.com/items/${sku}`;
      fetch(skuURL)
        .then(response => response.json())
        .then((data) => {
          const obj = {
            sku,
            name: data.title,
            salePrice: data.price,
          };
          document.querySelector('.cart__items').appendChild(createCartItemElement(obj));
          cartTotal();
          saveInLocalStorage();
        });
    }
  });
}

function loadFromLocalStorage() {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = localStorage.getItem('cart');
  cartList.addEventListener('click', ((event) => {
    if (event.target.classList.contains('cart__item')) {
      cartItemClickListener(event);
    }
  }));
  cartTotal();
}

function clearCart() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    cartTotal();
    saveInLocalStorage();
  });
}

window.onload = function onload() {
  loadFromLocalStorage();
  generateItemsList();
  addItemToCart();
  clearCart();
};
