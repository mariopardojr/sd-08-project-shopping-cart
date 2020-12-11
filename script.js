window.onload = function onload() {
  listProduct();
};

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

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = (createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.appendChild(button);

  button.addEventListener('click', async (event) => {
    const id = event.target.parentNode.firstChild.innerText;
    const product = await fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(responde => responde.json())
    .then(data => data);
    const ol = document.querySelector('.cart__items');
    const { id: sku, title: name, price: salePrice } = product;
    ol.appendChild(createCartItemElement({ sku, name, salePrice }));
  });
  
  return section;
}

const listProduct = async () => {
  const product = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(responde => responde.json())
  .then(data => data.results);
  const items = document.querySelector('.items');
  product.forEach((element) => {
    const { id: sku, title: name, thumbnail: image } = element;
    items.appendChild(createProductItemElement({ sku, name, image }));
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const ol = document.querySelector('ol');
  const product = event.target;
  ol.removeChild(product);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
