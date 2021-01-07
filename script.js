function localSave() {
  const itemsFromCart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', itemsFromCart);
}

function totalPrice() {
  const items = document.querySelectorAll('.cart__item');
  let total = 0;
  items.forEach((item) => {
    total += parseFloat(item.innerHTML.split('$')[1]);
  });
  document.querySelector('.total-price').innerHTML = total;
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
  const parent = event.target.parentElement;
  parent.removeChild(event.target);
  totalPrice();
  localSave();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}


function gerarLista() {
  createLoading();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((data) => {
      removeLoading();
      data.results.forEach((item) => {
        const obj = { sku: item.id, name: item.title, image: item.thumbnail };
        const section = document.querySelector('.items');
        section.appendChild(createProductItemElement(obj));
      });
    });
}

function addItem() {
  document.querySelector('.items')
  .addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const parent = event.target.parentElement;
      const SKU = getSkuFromProductItem(parent);
      console.log(SKU);
      fetch(`https://api.mercadolibre.com/items/${SKU}`)
      .then(response => response.json())
      .then((data) => {
        const obj = { sku: data.id, name: data.title, salePrice: data.price };
        document.querySelector('.cart__items')
        .appendChild(createCartItemElement(obj));
        totalPrice();
        localSave();
      });
    }
  });
}
function loadLocalSave() {
  const list = document.querySelector('.cart__items');
  list.innerHTML = localStorage.getItem('cart');
  list.addEventListener('click', ((event) => {
    if (event.target.classList.contains('cart__item')) {
      cartItemClickListener(event);
    }
  }));
  totalPrice();
}

function clearAll() {
  document.querySelector('.total-price').innerHTML = '0';
  document.querySelector('.cart__items').innerHTML = '';
  totalPrice();
  localSave();
}


window.onload = function onload() {
  gerarLista();
  addItem();
  loadLocalSave();
  document.querySelector('.empty-cart').addEventListener('click', clearAll);
};
