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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addItemCart);

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

async function addItemCart(event) {
  const id = event.target.parentNode.firstChild.innerText;
  const containerCart = document.querySelector('.cart__items');
  const itemFetch = await fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json())
    .then(data => data);
  const { id: sku, title: name, price: salePrice } = itemFetch;
  const carItem = createCartItemElement({ sku, name, salePrice });
  containerCart.appendChild(carItem);
}

const productsAPI = async () => {
  const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const items = await fetch(api)
    .then(element => element.json())
    .then(element => element.results);

  const contItems = document.querySelector('.items');
  items.forEach((element) => {
    const { id: sku, title: name, thumbnail: image } = element;
    const createItem = createProductItemElement({ sku, name, image });
    contItems.appendChild(createItem);
  });
};

window.onload = function onload() {
  productsAPI();
};
