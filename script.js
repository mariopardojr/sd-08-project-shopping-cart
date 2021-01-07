window.onload = function onload() { };

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createListOfProducts() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then(object => (object.results).forEach((element) => {
    const item = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    document.querySelector('.items').appendChild(createProductItemElement(item));
  }));
}

function addButton() {
  document.querySelectorAll('.items').addEventListener('click', (Event) => {
    if (Event.target.classList.contains('item__add')) {
      const itemId = getSkuFromProductItem(Event.target.parentNode);
      fetch(`https://api.mercadolibre.com/items/${idItem}`)
      .then(response => response.json())
      .then((object) => {
        const item = {
          sku: object.id,
          name: object.title,
          salePrice: object.price,
        };
        document.querySelector('.cart__items').appendChild(createCartItemElement(item));
      });
    }
  });
}
window.onload = function onload() {
  createListOfProducts();
  addButton();
};
