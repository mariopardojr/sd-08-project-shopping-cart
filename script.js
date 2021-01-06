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

function createProductsList() {
  return new Promise((resolve) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json()).then((data) => {
      document.querySelector('.loading').remove();
      data.results.forEach((result) => {
        const product = { sku: result.id, name: result.title, image: result.thumbnail };
        const items = document.querySelector('.items');
        items.appendChild(createProductItemElement(product));
        resolve();
      });
    });
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveProductsList() {
  localStorage.setItem('Cart Items', document.querySelector('.cart__items').innerHTML);
}

function sumPrices() {
  return new Promise((resolve) => {
    let sum = 0;
    document.querySelectorAll('.cart__item').forEach((item) => {
      value = parseFloat(item.innerText.split('$')[1]);
      sum += value;
    });
    resolve(sum);
  });
}

async function totalPrice() {
  const sum = await sumPrices();
  document.querySelector('.total-price').innerHTML = `Preço total: $${sum}`;
}

function cartItemClickListener(event) {
  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(event.target);
  totalPrice();
  saveProductsList();
}

function loadProductsList() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = localStorage.getItem('Cart Items');
  document.querySelectorAll('.cart__item').forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
  totalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart() {
  const items = document.querySelector('.items');
  items.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      return new Promise((resolve) => {
        fetch(`https://api.mercadolibre.com/items/${getSkuFromProductItem(event.target.parentElement)}`)
        .then(response => response.json())
        .then((data) => {
          const product = { sku: data.id, name: data.title, salePrice: data.price };
          const cartItems = document.querySelector('.cart__items');
          cartItems.appendChild(createCartItemElement(product));
          totalPrice();
          saveProductsList();
          resolve();
        });
      });
    }
    return null;
  });
}

function emptyCart() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    totalPrice();
    saveProductsList();
  });
}

window.onload = function onload() {
  createProductsList();
  addToCart();
  loadProductsList();
  emptyCart();
};
