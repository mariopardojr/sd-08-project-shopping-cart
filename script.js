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
  const itemsLocal = document.querySelector('.items');
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  itemsLocal.appendChild(section);
  return section;
}

const fetchMBL = () => new Promise(() => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
    .then(async (data) => {
      const compMBL = await data.results.map(element => (
        {
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        }
      ));
      compMBL.forEach((element) => {
        createProductItemElement(element);
      });
      // cartItemClickListener();
    });
});

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const cartItemClickListener = async() => {
    // const botaoLocal = await document.querySelectorAll('.item__add');
    // for 
    // botaoLocal.addEventListener('click', function() {
    //     console.log('entrei')
    // });
    // fetch(`https://api.mercadolibre.com/items/${sku}`)
};

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
