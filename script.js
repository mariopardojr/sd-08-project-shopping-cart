// const fetch = require('node-fetch');

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

const fetchMBL = () => new Promise(() => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
    .then((data) => {
      const compMBL = data.results.map(element => (
        {
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        } // 10
      ));
      compMBL.forEach((element) => {
        const itemsLocal = document.querySelector('.items');
        itemsLocal.appendChild(createProductItemElement(element));
      });
      const itemsLocal = document.querySelector('.items');
      itemsLocal.addEventListener('click', function (event) {
        if (event.target.className === 'item__add') {
          const idSku = getSkuFromProductItem(event.target.parentNode);
          fetch(`https://api.mercadolibre.com/items/${idSku}`) // 20
            .then(response => response.json())
              .then((data) => {
                const { id: sku, title: name, price: salePrice } = data;
                const olCartLocal = document.querySelector('ol, .cart__items');
                olCartLocal.appendChild(createCartItemElement({ sku, name, salePrice }));
              });  
        }
      });
    });
});

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  //
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() {
  fetchMBL();
};
