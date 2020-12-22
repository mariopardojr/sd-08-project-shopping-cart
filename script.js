
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

function Removeloading() {
  const loadPage = document.querySelector('.loading');
  loadPage.remove();
}

function localStorageSave() {
  localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);
}

function localStorageGet() {
  const loadingCart = localStorage.getItem('cart');
  document.querySelector('.cart__items').innerHTML = loadingCart;
}

function cartItemClickListener(event) {
  const element = event.target;
  element.parentNode.removeChild(element);
  localStorageSave();
}


function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductRequest() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then((object) => {
    Removeloading();
    object.results.forEach((element) => {
      const product = {
        sku: element.id,
        name: element.title,
        image: element.thumbnail,
      };
      document.querySelector('.items').appendChild(createProductItemElement(product));
    });
  });
}


function addProductToCart() {
  document.querySelector('.items').addEventListener('click', (Event) => {
    if (Event.target.classList.contains('item__add')) {
      const sku = getSkuFromProductItem(Event.target.parentNode);
      fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(response => response.json())
      .then((data) => {
        const item = {
          sku,
          name: data.title,
          salePrice: data.price,
        };
        document.querySelector('.cart__items').appendChild(createCartItemElement(item));
        localStorageSave();
      });
    }
  });
}
function buttonClear() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    localStorageSave();
  });
}

window.onload = function onload() {
  localStorageGet();
  createProductRequest();
  addProductToCart();
  buttonClear();
};
