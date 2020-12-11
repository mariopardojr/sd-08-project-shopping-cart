const requestSpecs = {
  method: 'GET',
  headers: { Accept: 'application/json' },
};

const getProductRequest = (item) => {
  const searchItem = item;
  return new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${searchItem}`, requestSpecs)
      .then(response => response.json())
      .then(data => data.results)
      .then(results => resolve(results));
  });
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

const updateSoraged = () => {
  const listArray = document.getElementsByTagName('li');
  const storagedList = [];
  for (let i = 0; i < listArray.length; i += 1) {
    storagedList.push(listArray[i].innerHTML);
  }

  localStorage.setItem('storagedList', JSON.stringify(storagedList));
};
const createSumCart = (totalPrice) => {
  const span = document.createElement('span');
  span.className = 'total-price';
  span.innerHTML = `Preço Total: ${totalPrice.toFixed(2)}`;
  return span;
};

async function sumPrices() {
  let totalPrice = 0;
  const section = document.querySelector('.cart');
  const li = document.getElementsByTagName('li');
  for (let i = 0; i < li.length; i += 1) {
    const price = li[i].innerHTML.split(' $', 2)[1];
    totalPrice += parseFloat(price);
  }

  if (section.lastChild.className === 'total-price') {
    section.removeChild(document.querySelector('.total-price'));
  }
  section.appendChild(createSumCart(totalPrice));
}

function cartItemClickListener(event) {
  const parent = event.target.parentNode;
  parent.removeChild(event.target);
  updateSoraged();
  sumPrices();
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

async function getStoraged() {
  const localStoragedList = localStorage.getItem('storagedList');
  const cartList = document.querySelector('.cart__items');


  if (localStoragedList !== null && cartList.hasChildNodes() === false) {
    const storagedList = JSON.parse(localStoragedList);

    storagedList.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = item;
      li.addEventListener('click', cartItemClickListener);
      cartList.appendChild(li);
    });
  }
}

const HandleButton = (event) => {
  const Id = event.target.parentNode;
  const ItemID = getSkuFromProductItem(Id);

  fetch(`https://api.mercadolibre.com/items/${ItemID}`, requestSpecs)
    .then(response => response.json())
    .then((item) => {
      const cartList = document.querySelector('.cart__items');
      const product = createCartItemElement({ sku: item.id,
        name: item.title,
        salePrice: item.price,
      });
      cartList.appendChild(product);
      updateSoraged();
      sumPrices();
    });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAdd = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAdd.addEventListener('click', HandleButton);
  section.appendChild(btnAdd);

  return section;
}

window.onload = function onload() {
  getProductRequest('computador').then((response) => {
    const sectionContainer = document.querySelector('.items');
    response.forEach((item) => {
      const product = { sku: item.id, name: item.title, image: item.thumbnail };
      sectionContainer.appendChild(createProductItemElement(product));
    });
  });
  getStoraged();
  sumPrices();
};
