const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function selectItem(click) {
  if (click.target.classList.contains('selected')) {
    click.target.classList.remove('selected');
  } else {
    click.target.classList.add('selected');
    const parentNodeFirstChildId = click.target.parentNode.firstChild.innerText;
    addItemToCart(parentNodeFirstChildId);
  }
}

function createCustomElement(element, className, innerText) {
  if (element === 'button') {
    const e = document.createElement(element);
    e.className = className;
    e.innerText = innerText;
    e.addEventListener('click', selectItem);
    return e;
  }
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

function cartItemClickListener(event) {
  // coloque seu código aqui VQV
  // if (event.target.classList.contains('selected')) {
  //   event.target.classList.remove('selected');
  //   // removeItemFromCart();
  // } else {
  //   event.target.classList.add('selected');
  // }
  // addItemToCart(event.target.sku);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItemToCart(targetItemId) {
  fetch(`https://api.mercadolibre.com/items/${targetItemId}`)
    .then(response => response.json())
    .then((data) => {
      const { id, title, price } = data;
      const selectedItemObject = {
        sku: id,
        name: title,
        salePrice: price,
      };
      document.querySelector('.cart__items').appendChild(createCartItemElement(selectedItemObject));
    });
}

function fetchAPI(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => data.results.forEach((element) => {
      const elementObject = {
        sku: element.id,
        name: element.title,
        image: element.thumbnail,
      };
      document.querySelector('.items').appendChild(createProductItemElement(elementObject));
    }));
}

window.onload = function onload() { fetchAPI(API_URL) };
