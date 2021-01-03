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

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createCartItem(event) {
  const sku = event.target.parentElement.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then((itemTarget) => {
      const objTarget = {
        sku,
        name: itemTarget.title,
        salePrice: itemTarget.price,
      };
      document.querySelector('.cart__items').appendChild(createCartItemElement(objTarget));
    });
}

function eventClickButtonItem() {
  const buttonItems = document.querySelectorAll('.item__add');
  buttonItems.forEach(buttonItem => buttonItem.addEventListener('click', createCartItem));
}

async function generateItemsList() {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((listItems) => {
      listItems.results.forEach((item) => {
        const obj = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(obj));
      });
    });
  eventClickButtonItem();
}

window.onload = function onload() {
  generateItemsList();
};
