const errorAlert = (error) => {
  window.alert(error);
};
const saveCartList = () => {
  localStorage.clear();
  const ol = document.querySelector('.cart__items');
  localStorage.setItem('cartList', ol.innerHTML);
};
const createLoading = () => {
  const loading = document.createElement('p');
  loading.className = 'loading';
  loading.innerText = 'loading...';
  return loading;
};

const subPrice = (price) => {
  const textItem = price.innerText;
  const lastString = textItem.substring(textItem.lastIndexOf('$') + 1);
  // ref: https://pt.stackoverflow.com/questions/314079/pegar-a-ultima-ocorr%C3%AAncia-num-string-javascript#:~:text=Basta%20usar%20lastIndexOf%20que%20retorna,substring(texto.
  const priceItem = parseInt(lastString, 10);
  const total = document.querySelector('.price');
  const numberTotal = parseInt(total.innerText, 10);
  const totalPrice = numberTotal - priceItem;
  total.innerHTML = totalPrice;
};

function cartItemClickListener(event) {
  const cartOL = document.querySelector('.cart__items');
  cartOL.removeChild(event.target);
  subPrice(event.target);
  saveCartList();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
const fetchAPIByID = (itemID) => {
  const apiProductByID = `https://api.mercadolibre.com/items/${itemID}`;
  return fetch(apiProductByID)
    .then(response => response.json())
    .then((object) => {
      const productByID = object;
      return productByID;
    })
    .catch(error => errorAlert(error));
};

const sumPrice = async (price) => {
  const total = document.querySelector('.price');
  const numberTotal = parseInt(total.innerText, 10);
  const totalPrice = numberTotal + price;
  total.innerHTML = totalPrice;
};

const fetchItemByID = async (event) => {
  const clickedElementParent = event.target.parentNode;
  const idItem = getSkuFromProductItem(clickedElementParent);
  const cartList = document.querySelector('.cart__items');
  cartList.appendChild(createLoading());
  const objectItemID = await fetchAPIByID(idItem);
  const loading = document.querySelector('.loading');
  cartList.removeChild(loading);
  const { id: sku, title: name, price: salePrice } = objectItemID;
  const cartItemList = createCartItemElement({ sku, name, salePrice });
  cartList.appendChild(cartItemList);
  await sumPrice(objectItemID.price);
  saveCartList();
  // referência projeto Rafael Guimarães
};
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', fetchItemByID);
  }
  return e;
}
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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
const filterResultsObject = (array) => {
  const addItems = document.querySelector('.items');
  const idNameImageProducts = array
  .map(({ id, title, thumbnail }) => ({ sku: id, name: title, image: thumbnail }))
  .forEach((element) => {
    addItems.appendChild(createProductItemElement(element));
  });
  return idNameImageProducts;
};
const fetchProducts = (product) => {
  const productByCategory = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  fetch(productByCategory)
    .then(response => response.json())
    .then((object) => {
      if (object.error) {
        throw new Error(object.error);
      } else {
        filterResultsObject(object.results);
        const addItems = document.querySelector('.items');
        const loading = document.querySelector('.loading');
        addItems.removeChild(loading);
      }
    });
};

const removeAllItems = () => {
  const ol = document.querySelector('.cart__items');
  const total = document.querySelector('.price');

  while (ol.firstChild) {
    ol.removeChild(ol.firstChild);
  }
  total.innerHTML = 0;
  saveCartList();
};

const clearCartButton = () => {
  const clearAllButton = document.querySelector('.empty-cart');
  clearAllButton.addEventListener('click', removeAllItems);
};
const newSession = () => {
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = localStorage.getItem('cartList');
};
const callLoading = () => {
  const addItems = document.querySelector('.items');
  addItems.appendChild(createLoading());
};
window.onload = function onload() {
  callLoading();
  fetchProducts('computador');
  clearCartButton();
  newSession();
};
