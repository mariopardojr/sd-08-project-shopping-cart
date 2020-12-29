window.onload = function onload() { };

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

}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function buttonClickListener(event) {
  const id = getSkuFromProductItem(event.currentTarget.parentNode);
  const url = `https://api.mercadolibre.com/items/${id}`;
  fetch(url)
    .then(response => response.json())
    .then((item) => {
      const product = {};

      product.sku = item.id;
      product.name = item.title;
      product.salePrice = item.price;

      document.querySelector('.cart__items').appendChild(createCartItemElement(product));
    });
}

fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then((data) => {
    data.results.forEach((item) => {
      const product = {};

      product.sku = item.id;
      product.name = item.title;
      product.image = item.thumbnail;

      document.querySelector('.items').appendChild(createProductItemElement(product));
    });
  })
  .then(() => {
    const itemList = document.querySelectorAll('.item');
    itemList.forEach(item => item.childNodes[3].addEventListener('click', buttonClickListener));
  });
