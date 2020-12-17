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

function listProducts () {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then(data => data.results.forEach((elem) => {
    const obj = {
      sku: elem.id,
      name: elem.title,
      image: elem.thumbnail,
    };
    document.querySelector('.items').appendChild(createProductItemElement(obj));
  }));
}

function addItemToCart () {
  document.querySelector('.items').addEventListener('click', 
  (event) => {
    if (event.target.className === 'item__add') {
      const parentElement = event.target.parentNode;
      const sku = getSkuFromProductItem(parentElement);
      fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(response => response.json())
      .then(data => {
        const obj = {
          sku: sku,
          name: data.title,
          salePrice: data.price,
        };
        document.querySelector('.cart__items').appendChild(createCartItemElement(obj));
      })
    }
  })
}

window.onload = function onload() {
  listProducts();
  addItemToCart();
};
