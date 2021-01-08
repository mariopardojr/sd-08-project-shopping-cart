const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

async function sumPrice() {
  const cartItem = document.querySelectorAll('.cart__item');
  let sumPrices = 0;
  cartItem.forEach((element) => {
    const price = Number(element.innerText.split('$')[1]);
    sumPrices += price;
  });
  sumPrices = sumPrices;
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = sumPrices;
}

function saveLocalStorage() {
  const cartItems = document.querySelector('.cart__items');
  localStorage.setItem('savedCart', cartItems.innerHTML);
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  sumPrice();
  saveLocalStorage();
}

function loadLocalStorage() {
  const cartItems = document.querySelector('.cart__items');
  const savedCart = localStorage.getItem('savedCart');
  if (savedCart) {
    cartItems.innerHTML = savedCart;
    cartItems.addEventListener('click', ((event) => {
      if (event.target.classList.contains('cart__item')) {
        cartItemClickListener(event);
      }
    }));
  }
  sumPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchItems = async () => {
  const req = await fetch(API_URL);
  const { results } = await req.json();
  document.querySelector('.loading').remove();
  results.forEach((item) => {
    const section = document.querySelector('.items');
    section.append(createProductItemElement(item));
  });
};

async function addToCartFunction(event) {
  const itemId = event.target.parentNode.querySelector('.item__sku').innerText;
  const reqItem = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const result = await reqItem.json();
  const listItems = document.querySelector('.cart__items');
  listItems.appendChild(createCartItemElement(result));
  sumPrice();
  saveLocalStorage();
}

function addEventToBtns() {
  const addBtn = document.querySelectorAll('.item__add');
  addBtn.forEach((btn) => {
    btn.addEventListener('click', addToCartFunction);
  });
}

const clearCart = () => {
  const cartItem = document.querySelector('.cart__items');
  const totalPrice = document.querySelector('.total-price');
  while (cartItem.lastChild) {
    cartItem.removeChild(cartItem.lastChild);
  }
  totalPrice.innerHTML = 0;
};

const emptyCart = () => {
  const emptyCartBtn = document.querySelector('.empty-cart');
  emptyCartBtn.addEventListener('click', clearCart);
};

window.onload = async function onload() {
  await fetchItems();
  addEventToBtns();
  emptyCart();
  loadLocalStorage();
};
