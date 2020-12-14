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

const lengthStorage = (storage) => {
  if (storage.length > 0) {
    localStorage.setItem('items', JSON.stringify(storage));
  } else {
    localStorage.clear();
  }
};

const removeItenStore = (id) => {
  const localItens = JSON.parse(localStorage.getItem('items'));
  const element = localItens.find(el => el.id === id);
  localItens.splice(localItens.indexOf(element), 1);
  lengthStorage(localItens);
};

function cartItemClickListener(event) {
  removeItenStore(event.target.id);
  event.target.parentNode.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const promiseApi = (url) => {
  const results = new Promise((resolve, reject) => {
    fetch(url).then(response => response.json())
      .then(data => resolve(data))
      .catch(err => reject(err));
  });
  return results;
};

// const getImgBest = async (id) => {
//   const url = `https://api.mercadolibre.com/items/${id}`;
//   const { pictures: [{ secure_url: image } = picture] } = await promiseApi(url);
//   return image;
// };

const getListIdsProduct = async () => {
  const PRODUCT = 'computador';
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${PRODUCT}`;
  const [getSection] = document.querySelectorAll('.items');
  const { results } = await promiseApi(url);
  getSection.innerText = '';
  results.forEach((item) => {
    const { id: sku, title: name, thumbnail: image } = item;
    // const image = await getImgBest(sku);
    const elProduct = createProductItemElement({ sku, name, image });
    getSection.appendChild(elProduct);
  });
};

const localStorageSave = (description) => {
  const items = [];
  const { sku, name, salePrice } = description;
  const item = { id: sku, title: name, price: salePrice };
  if (JSON.parse(localStorage.getItem('items')) === null) {
    items.push(item);
    localStorage.setItem('items', JSON.stringify(items));
  } else {
    const localItens = JSON.parse(localStorage.getItem('items'));
    localItens.push(item);
    localStorage.setItem('items', JSON.stringify(localItens));
  }
};

const totalPrice = (item, add = false) => {
  if (add) item.addEventListener('click', totalPrice);
};

const addItemCar = async (event) => {
  const idItem = getSkuFromProductItem(event.target.parentNode);
  const [getShoppingCart] = document.getElementsByClassName('cart__items');
  const url = `https://api.mercadolibre.com/items/${idItem}`;
  const { id: sku, title: name, price: salePrice } = await promiseApi(url);
  const item = createCartItemElement({ sku, name, salePrice });
  totalPrice(item, true);
  getShoppingCart.appendChild(item);
  localStorageSave({ sku, name, salePrice });
};

const addEvenBtnCar = () => {
  const btns = document.querySelectorAll('.item__add');
  btns.forEach(el => el.addEventListener('click', addItemCar));
};

const storageLoadCar = (data) => {
  const [getOl] = document.querySelectorAll('.cart__items');
  const { id: sku, title: name, price: salePrice } = data;
  const newEl = createCartItemElement({ sku, name, salePrice });
  getOl.appendChild(newEl);
};

const localStorageLoad = () => {
  if (typeof localStorage !== 'undefined') {
    if (localStorage.length > 0) {
      const localItens = JSON.parse(localStorage.getItem('items'));
      localItens.forEach(async (el) => {
        storageLoadCar(el);
      });
    } else {
      console.log('No local');
    }
  } else {
    alert('LocalStorage is not available!!');
  }
};

window.onload = async function onload() {
  await getListIdsProduct();
  localStorageLoad();
  addEvenBtnCar();
};
