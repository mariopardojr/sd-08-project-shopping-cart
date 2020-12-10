window.onload = function onload() {
  fetchDataFromMLB();
  loadLocalStorageCart();
  applyEventTocartItems();
  addEventToLimparCarrinho();
};

async function updatePrice() {
  const currentCartitems = document.querySelectorAll('.cart__item');
  let totalPrice = 0;
  currentCartitems.forEach(element => {
    const text = element.innerHTML;
    const price = +text.slice(text.lastIndexOf('$') + 1);
    totalPrice += price;
  });
  const totalPriceP = document.querySelector('.total-price');
  totalPrice = Math.floor(totalPrice * 100) / 100;
  totalPriceP.innerHTML = `R$${totalPrice}`;
}

function saveCartToLocal() {
  const olContainer = document.querySelector('.cart__items');
  localStorage.setItem('cart', olContainer.innerHTML);
}

function updateLocalStorage() {
  updatePrice();
  localStorage.clear();
  saveCartToLocal();
}

function limparCarrinho() {
  const olContainer = document.querySelector('.cart__items');
  olContainer.innerHTML = '';
  updateLocalStorage();
}

function addEventToLimparCarrinho() {
  const btnLimpar = document.querySelector('.empty-cart');
  btnLimpar.addEventListener('click', limparCarrinho);
}

function loadLocalStorageCart() {
  const olContainer = document.querySelector('.cart__items');
  const cartLocalData = localStorage.getItem('cart');
  olContainer.innerHTML = cartLocalData;
  updatePrice();
}

function applyEventTocartItems() {
  const currentCartitems = document.querySelectorAll('.cart__item');
  currentCartitems.forEach(item =>
    item.addEventListener('click', event => cartItemClickListener(event))
  );
}

async function fetchDataFromMLB() {
  const containerItems = document.querySelector('.items');
  const loadingDiv = document.querySelector('.loading ');
  loadingDiv.style.display = 'block';
  const data = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador').then(
    result =>
      result.json().then(data =>
        data.results.forEach(product => {
          const productHTML = createProductItemElement(product);
          const buttonAdicionar = productHTML.childNodes[3];
          buttonAdicionar.addEventListener('click', e => addToCart(e.path[1]));
          containerItems.appendChild(productHTML);
        })
      )
  );
  loadingDiv.style.display = 'none';
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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__id', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__id').innerText;
}

async function fetchItemData(itemId) {
  return fetch(`https://api.mercadolibre.com/items/${itemId}`);
}

async function addToCart(event) {
  const olContainer = document.querySelector('.cart__items');
  const itemId = getSkuFromProductItem(event);
  const loadingDiv = document.querySelector('.loading ');
  loadingDiv.style.display = 'block';
  const itemData = await fetchItemData(itemId).then(itemdata =>
    itemdata.json().then(result => {
      const itemCart = createCartItemElement(result);
      olContainer.appendChild(itemCart);
    })
  );
  loadingDiv.style.display = 'none';
  updatePrice();
  saveCartToLocal();
}

function cartItemClickListener(event) {
  const olContainer = event.path[1];
  const cartItem = event.path[0];
  olContainer.removeChild(cartItem);
  updatePrice();
  updateLocalStorage();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  /*   const pId = document.createElement('p');
  const pTitle = document.createElement('p');
  const pPrice = document.createElement('p'); */
  li.className = 'cart__item';
  li.innerText = `Id: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', e => cartItemClickListener(e));
  return li;
}
