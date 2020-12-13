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

const sumItems = () => {
  const items = document.querySelectorAll('.cart__item');
  const arrayItems = Array.from(items).reduce((acc, curr) => {
    const total = parseFloat(curr.innerText.split('$')[1]);
    return acc + total;
  }, 0);
  const h1 = document.querySelector('.total-price');
  h1.innerHTML = `Preço total: $${arrayItems}`;
};

const creatLocalStorage = () => {
  const items = document.querySelectorAll('.cart__item');
  const arrayElement = [];
  Array.from(items).forEach((element) => {
    arrayElement.push(element.innerText);
  });
  localStorage.setItem('items', JSON.stringify(arrayElement));
};

function cartItemClickListener(event) {
  document.querySelector('ol').removeChild(event.target);
  sumItems();
  creatLocalStorage();
}

const getLocalStorage = () => {
  const ol = document.querySelector('ol');
  if (localStorage.length !== 0) {
    const items = JSON.parse(localStorage.getItem('items'));
    for (let index = 0; index < items.length; index += 1) {
      const li = document.createElement('li');
      li.classList = 'cart__item';
      li.innerText = items[index];
      ol.appendChild(li);
    }
  }
};
getLocalStorage();

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addId = async (event) => {
  const id = event.target.parentNode.firstChild.innerText;
  const product = await fetch(`https://api.mercadolibre.com/items/${id}`)
  .then(responde => responde.json())
  .then(data => data);
  const ol = document.querySelector('.cart__items');
  const { id: sku, title: name, price: salePrice } = product;
  const cartItem = createCartItemElement({ sku, name, salePrice });
  ol.appendChild(cartItem);
  sumItems();
  creatLocalStorage();
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = (createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.appendChild(button);
  button.addEventListener('click', addId);
  return section;
}

const creatLoading = () => {
  const body = document.querySelector('body');
  const h1 = document.createElement('h1');
  h1.classList = 'loading';
  h1.innerHTML = 'Loading....';
  body.appendChild(h1);
};

const removeLoading = () => {
  const body = document.querySelector('body');
  const h1 = document.querySelector('.loading');
  body.removeChild(h1);
};

const listProduct = async () => {
  creatLoading();
  const product = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(responde => responde.json())
  .then(data => data.results);
  removeLoading();
  const items = document.querySelector('.items');
  product.forEach((element) => {
    const { id: sku, title: name, thumbnail: image } = element;
    items.appendChild(createProductItemElement({ sku, name, image }));
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const buttonClear = () => {
  const button = document.querySelector('.empty-cart');
  const ol = document.querySelector('ol');
  button.addEventListener('click', () => {
    const li = document.querySelectorAll('.cart__item');
    for (let index = 0; index < li.length; index += 1) {
      ol.removeChild(li[index]);
    }
    sumItems();
    creatLocalStorage();
  });
};
buttonClear();

window.onload = function onload() {
  listProduct();
  sumItems();
};
