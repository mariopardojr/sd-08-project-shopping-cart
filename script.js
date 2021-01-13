const errorAlert = (error) => {
  window.alert(error);
};

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
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

const fetchItemByID = async (event) => {
  const clickedElementParent = event.target.parentNode;
  const idItem = getSkuFromProductItem(clickedElementParent);
  const objectItemID = await fetchAPIByID(idItem);
  const { id: sku, title: name, price: salePrice } = objectItemID;
  const cartItemList = createCartItemElement({ sku, name, salePrice });
  const cartList = document.querySelector('.cart__items');
  cartList.appendChild(cartItemList);
  // referencia projeto Rafael Guimarães
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
      }
    });
};

window.onload = function onload() {
  fetchProducts('computador');
};
