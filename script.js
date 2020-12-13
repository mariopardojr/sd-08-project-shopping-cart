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

// const fetch = require('node-fetch');
function getproducts(product) {
  return new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
      .then((response) => {
        response.json()
          .then((data) => {
            data.results.map((object) => {
              newObject = {};
              newObject.sku = object.id;
              newObject.name = object.title;
              newObject.image = object.thumbnail;
              const content = createProductItemElement(newObject);
              const sectionItems = document.querySelector('body > section > section.items');
              sectionItems.appendChild(content);
              resolve();
              return newObject;
            });
          });
      });
  });
}

window.onload = function onload() {
  getproducts('computador');
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }
