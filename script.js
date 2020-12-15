// const fetch = require("node-fetch");

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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  ).addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`).then(response => {
      response.json().then(data => {
        const price = data.base_price;
        const applyClick = createCartItemElement({
          sku,
          name,
          salePrice: price,
        });
        document.querySelector('.cart__items').appendChild(applyClick);
      });
    });
  });
  section.appendChild(button);

  return section;
}
const getProduct = () => fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador').then(
  response => {
    response.json().then(data => {
      const arrayResults = data.results;
      arrayResults.forEach(prod => {
        const apply = createProductItemElement({
          sku: prod.id,
          name: prod.title,
          image: prod.thumbnail,
        });
        document.querySelector('.items').appendChild(apply);
      });
    });
  },
);

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

window.onload = function onload() {
  getProduct();
};
