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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

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

function theItemsList() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((jsonObj) => jsonObj.results)
    .then((array) =>
      array.forEach((item) => {
        const eachItem = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        document
          .querySelector('.items')
          .appendChild(createProductItemElement(eachItem));
      }),
    );
}

function addItemToCart() {
  const itemsList = document.querySelector('.items');
  itemsList.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const parentEl = event.target.parentElement;
      const theSkuTxt = getSkuFromProductItem(parentEl);
      fetch(`https://api.mercadolibre.com/items/${theSkuTxt}`)
        .then((response) => response.json())
        .then((responsedJson) => {
          const cartItems = {
            sku: responsedJson.id,
            name: responsedJson.title,
            salePrice: responsedJson.price,
          };
          console.log(cartItems);
          document
            .querySelector('.cart__items')
            .appendChild(createCartItemElement(cartItems));
        });
    }
  });
}

function emptyCart() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
  });
}

function highLightButtons() {
  const theList = document.querySelector('.items');
  theList.addEventListener('mouseover', (event) => {
    if (
      event.target.className === 'item__add' &&
      event.target.style.opacity !== '0.85'
    ) {
      event.target.style.opacity = '0.85';
    }
  });
  theList.addEventListener('mouseout', (event) => {
    event.target.className === 'item__add' &&
    event.target.style.opacity === '0.85'
      ? (event.target.style.opacity = '1')
      : false;
  });
}
window.onload = function onload() {
  theItemsList();
  addItemToCart();
  highLightButtons();
  emptyCart();
};
