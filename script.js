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

// function cartItemClickListener(event) {

// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const requestApi = async url => fetch(url);

const listItems = (data) => {
  const getSection = document.querySelector('.items');
  data.results.forEach((iten) => {
    const { id: sku, title: name, thumbnail: image } = iten;
    const newEl = createProductItemElement({ sku, name, image });
    getSection.appendChild(newEl);
  });
};

const promiseApi = async (url, callback) => {
  try {
    const resultRequest = await requestApi(url);
    const data = await resultRequest.json();
    if (typeof data === 'object') {
      callback(data);
    } else {
      console.log(`URL NÃO ENCONTRADA ${data}`);
    }
  } catch (err) {
    throw err;
  }
};

const getProductApi = (id) => {
  const url = `https://api.mercadolibre.com/items/${id}`;
  const [getOl] = document.querySelectorAll('.cart__items');
  promiseApi(url, (data) => {
    const { id: sku, title: name, price: salePrice } = data;
    const newEl = createCartItemElement({ sku, name, salePrice });
    getOl.appendChild(newEl);
    console.log(data);
  });
};

const getIdProduct = (event) => {
  const parent = event.target.parentNode;
  const id = getSkuFromProductItem(parent);
  getProductApi(id);
};

const addEventBtnAddCar = () => {
  const btn = document.querySelectorAll('.item__add');
  btn.forEach(el => el.addEventListener('click', event => getIdProduct(event)));
};

window.onload = async function onload() {
  const PRODUCT = 'computador';
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${PRODUCT}`;
  await promiseApi(API_URL, listItems);
  await addEventBtnAddCar();
};
