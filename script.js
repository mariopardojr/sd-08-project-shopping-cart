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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const filterResultObject = (array) => {
  const idNameImageProducts = array
  .map(({ id, title, thumbnail}) => ({ sku: id, name: title, image: thumbnail}))
  .forEach((element) => {
    const addItens = document.querySelector('.items');
    addItens.appendChild(createProductItemElement(element));
  });
  return idNameImageProducts;
};

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

const fetchProducts = product => {
  const productByCategory = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;

  fetch(productByCategory)
    .then(response => response.json())
    .then(object => {
      if(object.error) {
        throw new Error(object.error);
      } else {
        filterResultObject(object.results);
      }
    });
};

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

window.onload = function onload() {
  fetchProducts('computador')
};
