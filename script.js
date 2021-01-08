
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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function creatItems(obj) {
  const itens = document.querySelector('.items');
  itens.appendChild(createProductItemElement(obj));
}
function fetchProducts() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(object => object.results.forEach((element) => {
      const obj = { sku: element.id, name: element.title, image: element.thumbnail };
      creatItems(obj);
    }));
}

function creatMoveItems(obj) {
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(createCartItemElement(obj));
}
function move(event) {
  if (event.target.className === 'item__add') {
    const parentNode = event.target.parentNode;
    const sku = parentNode.querySelector('.item__sku').innerText;
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(response => response.json())
      .then((object) => {
        const obj = { sku, name: object.title, salePrice: object.price };
        creatMoveItems(obj);
      });
  }
}

function addProductCartItems() {
  const items = document.querySelector('.items');
  items.addEventListener('click', move);
}

function emptyCart() {
  const emptyCarts = document.querySelector('.empty-cart');
  emptyCarts.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
  });
}

window.onload = function onload() {
  fetchProducts();
  addProductCartItems();
  emptyCart();
};
