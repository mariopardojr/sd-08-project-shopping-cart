const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartTotalPrice() {
  let total = 0;
  document.querySelectorAll('.cart__item').forEach((item) => {
    total += parseFloat(item.innerHTML.split('$')[1]);
  });
  document.querySelector('.total-price').innerHTML = total;
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

function saveItems() {
  const item = document.querySelector('.cart__items').innerHTML;
  localStorage.removeItem('item');
  localStorage.setItem('item', item);
}

function cartItemClickListener(event) {
  event.target.parentElement.removeChild(event.target);
  cartTotalPrice();
  saveItems();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

function createLoading() {
  const loading = document.createElement('h1');
  loading.className = 'loading';
  loading.innerHTML = 'loading...';
  document.body.appendChild(loading);
}

function createResultListItem() {
  fetch(URL)
  .then(response => response.json())
  .then((data) => {
    data.results.forEach((item) => {
      const obj = {
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      };
      document.querySelector('.items').appendChild(createProductItemElement(obj));
    });
  });
}

function loadItems() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('item');
}

addEventListener('click', (event) => {
  if (event.target.className === 'item__add') {
    const sku = getSkuFromProductItem(event.target.parentElement);
    const idURL = `https://api.mercadolibre.com/items/${sku}`;
    fetch(idURL)
      .then(response => response.json())
      .then((data) => {
        const obj = {
          sku,
          name: data.title,
          salePrice: data.price,
        };
        document.querySelector('.cart__items').appendChild(createCartItemElement(obj));
        cartTotalPrice();
        saveItems();
      });
  } else if (event.target.className === 'cart__item') { cartItemClickListener(event); } else if (event.target.className === 'empty-cart') {
    document.querySelector('.cart__items').innerHTML = ' ';
    cartTotalPrice();
    saveItems();
  }
});

window.onload = function onload() {
  loadItems();
  createLoading();
  createResultListItem();
};
