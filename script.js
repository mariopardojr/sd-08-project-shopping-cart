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
  const cartItems = document.getElementsByClassName('cart__items')[0];
  const pos = Array.prototype.indexOf.call(cartItems.children, event.target);
  cartItems.removeChild(event.target);

  const localItens = JSON.parse(window.localStorage.getItem('cart'));
  localItens.splice(pos, 1);
  window.localStorage.setItem('cart', JSON.stringify(localItens));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemToLocalStorage = (item) => {
  const data = window.localStorage.getItem('cart') || '[]';
  const loaded = JSON.parse(data);
  const curr = [...loaded, item];
  window.localStorage.setItem('cart', JSON.stringify(curr));
};

const itemToCartBtn = async (event) => {
  const itemId = getSkuFromProductItem(event.target.parentNode);
  const url = `https://api.mercadolibre.com/items/${itemId}`;
  try {
    const response = await fetch(url);
    const { id, title, price } = await response.json();
    const itemAdd = { sku: id, name: title, salePrice: price };
    const li = createCartItemElement(itemAdd);
    addItemToLocalStorage(itemAdd);
    document.getElementsByClassName('cart__items')[0].appendChild(li);
  } catch (err) {
    console.log(err);
  }
};

const loadCart = () => {
  const cart = JSON.parse(window.localStorage.getItem('cart'));
  cart.forEach((item) => {
    const li = createCartItemElement(item);
    document.getElementsByClassName('cart__items')[0].appendChild(li);
  });
};

window.onload = function onload() {
  const localStorage = window.localStorage;
  if (localStorage.getItem('cart') !== null) {
    loadCart();
  }

  const urlAPI = 'https://api.mercadolibre.com/sites/MLB/search?q=';
  const items = document.getElementsByClassName('items')[0];
  fetch(`${urlAPI}computador`)
    .then(resp => resp.json())
    .then(({ results }) => results)
    .then(respArr =>
      respArr.forEach(({ id, title, thumbnail }) => {
        const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
        items.appendChild(item);
        item.addEventListener('click', itemToCartBtn);
      }))
    .catch(err => console.log(err));
};
