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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}
// prettier-ignore
function appendAllItemsElements(allInfo) {
  document.querySelector('.loading').remove();
  allInfo.forEach((element) => {
    const section = createProductItemElement(element);
    const sectionItens = document.querySelector('.items');
    sectionItens.appendChild(section);
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function updateLocalStorage() {
  const ol = document.querySelector('.cart__items');
  localStorage.list = ol.innerHTML;
}

function sumTotalPrice() {
  const items = document.querySelectorAll('.cart__item');
  if (items.length === 0) {
    return 0;
  }
  let sum = 0;
  items.forEach((product) => {
    const text = product.innerText;
    const initialPosition = text.indexOf('PRICE: $') + 8;
    const value = parseFloat(text.substr(initialPosition, text.length));
    sum += value;
  });
  return sum;
}

// prettier-ignore
function cartItemClickListener() {
  addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
      event.target.remove();
      updateLocalStorage();
      document.querySelector('.total-price').innerText = `${sumTotalPrice()}`;
    }
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// prettier-ignore
function putCartsOnPage(results) {
  const justNeedInfos = results.map((result) => {
    const obj = {
      sku: result.id,
      name: result.title,
      image: result.thumbnail,
    };
    return obj;
  });
  appendAllItemsElements(justNeedInfos);
}

function addElementToCart(result) {
  const sku = result.id;
  const name = result.title;
  const salePrice = result.price;
  const li = createCartItemElement({ sku, name, salePrice });
  document.querySelector('ol.cart__items').appendChild(li);
  document.querySelector(
    '.total-price',
  ).innerText = `${sumTotalPrice()}`;
}

function pickElementFromApi(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json())
    .then(resultInfos => addElementToCart(resultInfos))
    .then(() => updateLocalStorage());
}
// prettier-ignore
function checkButtonClicks() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((item) => {
    item.addEventListener('click', (element) => {
      pickElementFromApi(element.target.parentNode.childNodes[0].innerText);
    });
  });
}

function getResultsFromApi(key) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${key}`)
    .then(response => response.json())
    .then(data => putCartsOnPage(data.results))
    .then(() => checkButtonClicks());
}

function updateCart() {
  if (localStorage.list !== undefined) {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = localStorage.list;
    const totalPrice = sumTotalPrice();
    console.log(totalPrice);
    document.querySelector(
      '.total-price',
    ).innerText = `${totalPrice}`;
  }
}

function buttonClearCart() {
  const btnClear = document.querySelector('.empty-cart');
  btnClear.addEventListener('click', () => {
    document.querySelector('ol.cart__items').innerHTML = '';
    updateLocalStorage();
    document.querySelector('.total-price').innerText = '0';
  });
}

window.onload = function onload() {
  updateCart();
  buttonClearCart();
  getResultsFromApi('computador');
  checkButtonClicks();
  cartItemClickListener();
};
