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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')).addEventListener('click', (event) => { 
    const test = event.target.parentNode;
    const idItem = getSkuFromProductItem(test);
    fetch(`https://api.mercadolibre.com/items/${idItem}`)
    .then(resolve => resolve.json())
    .then(data => {
      const item = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      const itemSelect = document.querySelector('.cart__items');
      itemSelect.appendChild(createCartItemElement(item));
    });
  });

  return section;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

// Req1 - Criando os itens a partir da API e ligando com a função createProductItemElement
const products = () => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=computador`)
  .then(response => response.json())
  .then((data) => { data.results.forEach((product) => {
    const object = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    };
    const items = document.querySelector('.items');
    items.appendChild(createProductItemElement(object));
  });
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Req2
const addProducts = (event) => {
  const test = event.target.parentNode;
  const idItem = getSkuFromProductItem(test);
  fetch(`https://api.mercadolibre.com/items/${idItem}`)
  .then(resolve => resolve.json())
  .then(data => {
    const item = {
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    };
    const itemSelect = document.querySelector('.cart__items');
    itemSelect.appendChild(createCartItemElement(item));
  });
};

window.onload = function onload() {
  products();
};
