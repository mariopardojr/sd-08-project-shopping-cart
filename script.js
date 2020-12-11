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
  allInfo.forEach((element) => {
    const section = createProductItemElement(element);
    const sectionItens = document.querySelector('.items');
    sectionItens.appendChild(section);
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// prettier-ignore
function cartItemClickListener() {
  addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
      event.target.remove();
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
}

function pickElementFromApi(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json())
    .then(resultInfos => addElementToCart(resultInfos));
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

window.onload = function onload() {
  getResultsFromApi('computador');
  checkButtonClicks();
  cartItemClickListener();
};
