function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const updateTotalPrice = () => {
  const data = window.localStorage.getItem('cart') || '[]';
  const loaded = JSON.parse(data);
  const total = loaded.reduce((acc, { salePrice }) => acc + parseFloat(salePrice), 0);
  document.getElementsByClassName('total-price')[0].innerText = total;
};

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

const removeFromCart = (item) => {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  const pos = Array.prototype.indexOf.call(cartItems.children, item);
  cartItems.removeChild(item);

  const localItens = JSON.parse(window.localStorage.getItem('cart'));
  localItens.splice(pos, 1);
  window.localStorage.setItem('cart', JSON.stringify(localItens));
  updateTotalPrice();
};

function cartItemClickListener(event) {
  removeFromCart(event.target);
}

const clearCart = () => {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  while (cartItems.firstChild) {
    removeFromCart(cartItems.firstChild);
  }
};

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


const increaseTotalPrice = async (value) => {
  try {
    const currPrice = await document.getElementsByClassName('total-price')[0];
    const newPrice = await parseFloat(currPrice.innerText) + value;
    currPrice.innerText = newPrice;
  } catch (error) {
    console.log(error);
  }
};

const itemToCartBtn = async (event) => {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  const itemId = getSkuFromProductItem(event.target.parentNode);
  const url = `https://api.mercadolibre.com/items/${itemId}`;
  try {
    const loadingMessage = document.createElement('div');
    loadingMessage.innerText = 'loading';
    loadingMessage.className = 'loading';
    cartItems.appendChild(loadingMessage);
    const response = await fetch(url);
    const { id, title, price } = await response.json();
    const itemAdd = { sku: id, name: title, salePrice: price };
    increaseTotalPrice(price);
    cartItems.removeChild(loadingMessage);
    const li = createCartItemElement(itemAdd);
    addItemToLocalStorage(itemAdd);
    cartItems.appendChild(li);
  } catch (err) {
    console.log(err);
  }
};

const loadCart = () => {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  const cart = JSON.parse(window.localStorage.getItem('cart'));
  cart.forEach((item) => {
    const li = createCartItemElement(item);
    cartItems.appendChild(li);
  });
  updateTotalPrice();
};

const loadItems = () => {
  const urlAPI = 'https://api.mercadolibre.com/sites/MLB/search?q=';
  const items = document.getElementsByClassName('items')[0];
  const loadingMessage = document.createElement('div');
  loadingMessage.innerText = 'loading';
  loadingMessage.className = 'loading';
  loadingMessage.style.display = 'inline';
  items.appendChild(loadingMessage);
  fetch(`${urlAPI}computador`)
    .then((resp) => {
      items.removeChild(loadingMessage);
      return resp.json();
    })
    .then(({ results }) => results)
    .then(respArr =>
      respArr.forEach(({ id, title, thumbnail }) => {
        const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
        items.appendChild(item);
        item.addEventListener('click', itemToCartBtn);
      }))
    .catch(err => console.log(err));
};

window.onload = function onload() {
  const price = document.createElement('span');
  price.className = 'total-price';
  price.innerText = 0;
  document.getElementsByClassName('cart')[0].appendChild(price);
  const localStorage = window.localStorage;
  if (localStorage.getItem('cart') !== null) {
    loadCart();
  }

  loadItems();

  document.getElementsByClassName('empty-cart')[0].addEventListener('click', clearCart);
};
