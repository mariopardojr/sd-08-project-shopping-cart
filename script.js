
let shoppingCart = [];

const getItemPromise = ((item) => {
  const result = fetch(`https://api.mercadolibre.com/items/${item}`)
    .then(response => response.json())
    .then(data => data)
    .catch(err => console.log(err));

  return result;
});

function localStorageUpdate() {
  localStorage.setItem('savedCart', JSON.stringify(shoppingCart));
}

function cartItemClickListener(event) {
  const item = event.target;
  const itemId = item.innerText.match(/(SKU: )([^\s]+)(\s)/, '$2')[2];
  const parent = item.parentNode;

  parent.removeChild(item);
  const productIndex = shoppingCart.findIndex(product => product === itemId);
  if (shoppingCart.length === 1) {
    shoppingCart.pop();
  } else {
    shoppingCart = shoppingCart.filter((currentItem, index) => index !== productIndex);
  }
  localStorageUpdate();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');

  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  ol.appendChild(li);
  shoppingCart.push(sku);
  localStorageUpdate();

  return li;
}

async function starterShoppingCart(savedCart) {
  const itemsPromises = savedCart.map(item => getItemPromise(item));
  const results = await Promise.all(itemsPromises);

  localStorage.setItem('savedCart', '');
  results.map(produto => createCartItemElement(produto));
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function getItemToCart(event) {
  const itemId = getSkuFromProductItem(event.target.parentNode);

  const results = await getItemPromise(itemId);

  createCartItemElement(results);
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const sectionItems = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', getItemToCart);
  section.appendChild(button);

  sectionItems.appendChild(section);

  return section;
}

async function getListItem() {
  const results = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => data)
    .catch(err => console.log(err));

  results.results.map(result => createProductItemElement(result));
}

window.onload = function onload() {
  if (localStorage.getItem('savedCart') && localStorage.getItem('savedCart') !== '') {
    const parse = JSON.parse(localStorage.getItem('savedCart'));
    starterShoppingCart(parse);
  }

  getListItem();
};
