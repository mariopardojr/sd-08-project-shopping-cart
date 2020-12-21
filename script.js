
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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductRequest() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then(object => object.results.forEach((element) => {
    const product = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    document.querySelector('.items').appendChild(createProductItemElement(product));
  }));
}

function eventButton() {
  const buttonProduct = document.querySelectorAll('.item__add');
  buttonProduct.forEach((element) => {
    element.addEventListener('click', (Event) => {
      const idItem = getSkuFromProductItem(Event.target.parentNode);
      fetch(`https://api.mercadolibre.com/items/${idItem}`)
      .then(response => response.json())
      .then((data) => {
        const item = {
          idItem,
          name: data.title,
          salesPrice: data.price,
        };
        document.querySelector('.cart__items').appendChild(createCartItemElement(item));
      });
    },
  );
  });
}
window.onload = function onload() {
  createProductRequest();
  eventButton();
};
