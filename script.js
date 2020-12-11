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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const getProduct = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json()
      .then((data) => {
        const arrayResults = data.results;
        arrayResults.map((prod) => {
          const apply = createProductItemElement({
            sku: prod.id,
            name: prod.title,
            image: prod.thumbnail });
          return document.querySelector('.items').appendChild(apply);
        });
      });
    });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
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

const getProductToCart = (sku) => {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then((response) => {
    response.json()
    .then((data) => {
      createCartItemElement(data);
    });
  });
}

const addToCart = () => {
  const productItems = document.querySelector('.item_add');
  productItems.addEventListener('click', () => {
    productSku = productItems.sku;
    getProductToCart(productSku);
  }
  )
}

window.onload = function onload() {
  getProduct();
};
