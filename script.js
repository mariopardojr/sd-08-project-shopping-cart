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

function innerCartNewElement (idElemento) {
  fetch(`https://api.mercadolibre.com/items/${idElemento}`)
            .then(response => response.json())
              .then((data2) => {
                const { id: sku, title: name, price: salePrice } = data2;
                const olCartLocal = document.querySelector('ol, .cart__items');
                olCartLocal.appendChild(createCartItemElement({ sku, name, salePrice }));
              });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.addEventListener('click', function (event) {
    if (event.target.className === 'item__add') {
      const idSku = getSkuFromProductItem(event.target.parentNode);
      innerCartNewElement(idSku);
    }
  });
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // const itemRemoveLocal = document.querySelector
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchMBL = () => new Promise(() => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
    .then((data) => {
      const compMBL = data.results.map(el => ({ sku: el.id, name: el.title, image: el.thumbnail }));
      compMBL.forEach((element) => {
        const itemsLocal = document.querySelector('.items');
        itemsLocal.appendChild(createProductItemElement(element));
      });
    });
});

window.onload = function onload() {
  fetchMBL();
};
