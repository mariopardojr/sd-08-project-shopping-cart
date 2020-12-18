function createLoadingElement() {
  const loadingElement = document.createElement('div');
  loadingElement.className = 'loading';
  loadingElement.innerText = 'loading...';
  document.getElementsByClassName('container')[0]
    .appendChild(loadingElement);
}

function deleteLoadingElement() {
  document.getElementsByClassName('loading')[0].remove();
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

async function priceCalc() {
  return Array.from(document.getElementsByClassName('cart__item'))
    .reduce((acc, el) => {
      const matchObj = el.innerText.match(/PRICE: \$(.*)/);
      return acc + parseFloat(matchObj[1]);
    }, 0);
}

function updatePriceElement() {
  priceCalc()
  .then((x) => {
    const priceEl = document.getElementsByClassName('total-price')[0];
    priceEl.innerHTML = `${x}`;
  });
}

function addProduct({ sku, name }) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(res => res.json())
    .then((data) => {
      const element = createCartItemElement({ sku, name, salePrice: data.price });
      document.querySelector('.cart__items').appendChild(element);
      localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);
      updatePriceElement();
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', (() => addProduct({ sku, name })));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(element) {
  return function () {
    element.parentNode.removeChild(element);
    localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);
    updatePriceElement();
  };
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener(li));
  localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);
  return li;
}

function emptyCart() {
  document.querySelector('.cart__items').innerHTML = '';
  localStorage.setItem('cart', '');
  updatePriceElement();
}

window.onload = function onload() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart');
  Array.from(document.getElementsByClassName('cart__item')).forEach((element) => {
    element.addEventListener('click', cartItemClickListener(element));
  });
  updatePriceElement();
  createLoadingElement()
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      deleteLoadingElement();
      return response.json();
    })
    .then(obj => obj.results.map(product =>
      ({ sku: product.id, name: product.title, image: product.thumbnail })))
    .then((products) => products.forEach(product => {
      const element = createProductItemElement(product);
      document.getElementsByClassName('items')[0]
        .appendChild(element);
    }));
};
