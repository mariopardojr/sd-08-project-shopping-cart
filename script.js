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

function cartSaveChange() {
  const cartSelect = document.querySelector('.cart__items');
  console.log(cartSelect);
  localStorage.setItem('cart', cartSelect.innerHTML);
}

async function priceTotal() {
  const items = document.querySelectorAll('.cart__item');
  let total = 0;
  items.forEach((item) => {
    total += parseFloat(item.innerHTML.split('$')[1]);
  });
  document.querySelector('.total-price').innerHTML = total;
}

function cartItemClickListener(event) {
  event.path[1].removeChild(event.path[0]);
  priceTotal();
  cartSaveChange();
}

function cartLoadChange() {
  const cartSelect = document.querySelector('.cart__items');
  if (localStorage.cart) {
    cartSelect.innerHTML = localStorage.getItem('cart');
    cartSelect.addEventListener('click', ((event) => {
      if (event.target.classList.contains('cart__item')) {
        cartItemClickListener(event);
      }
    }));
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
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

async function createCartItem(event) {
  const sku = getSkuFromProductItem(event.target.parentElement);
  createLoading();
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then((itemTarget) => {
      const objTarget = {
        sku,
        name: itemTarget.title,
        salePrice: itemTarget.price,
      };
      document.querySelector('.cart__items').appendChild(createCartItemElement(objTarget));
    });
  removeLoading();
  priceTotal();
  cartSaveChange();
}

function eventClickButtonItem() {
  const buttonItems = document.querySelectorAll('.item__add');
  buttonItems.forEach(buttonItem => buttonItem.addEventListener('click', createCartItem));
}

async function generateItemsList() {
  createLoading();
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((listItems) => {
      listItems.results.forEach((item) => {
        const obj = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(obj));
      });
    });
  removeLoading();
  eventClickButtonItem();
}

function createPriceElement(callback) {
  const pPrice = document.createElement('p');
  pPrice.className = 'total-price';
  document.querySelector('.cart').appendChild(pPrice);
  callback();
}

function clearCart() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    priceTotal();
    cartSaveChange();
  });
}

window.onload = function onload() {
  generateItemsList();
  cartLoadChange();
  createPriceElement(priceTotal);
  clearCart();
};
