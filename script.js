function totalPrice() {
  let total = 0;
  document.querySelectorAll('.cart__item').forEach(item => {
    total += parseFloat(item.innerText.split('$')[1]);
  });
  document.querySelector('.total-price').innerHTML = total;
}

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

function addLocalStorage() {
  const completedList = document.querySelector('.cart__items');
  localStorage.setItem('eachItem', completedList.innerHTML);
}

function getLocalStorage() {
  const completedList = document.querySelector('.cart__items');
  completedList.innerHTML = localStorage.getItem('eachItem');
  totalPrice();
}

function cartItemClickListener(event) {
  event.target.remove();
  totalPrice();
  addLocalStorage();
}

function createCartItemElement({
  id: sku,
  title: name,
  base_price: salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  );
  button.addEventListener('click', async () => {
    const getNewApi = await fetch(`https://api.mercadolibre.com/items/${sku}`);
    const result = await getNewApi.json();
    const cartItem = createCartItemElement(result);
    document.querySelector('.cart__items').appendChild(cartItem);
    totalPrice();
    addLocalStorage();
  });
  section.appendChild(button);
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

async function fetchAPI() {
  const apiResponse = await fetch(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador',
  );
  const { results } = await apiResponse.json();
  results.forEach(computer => {
    const newComputer = createProductItemElement(computer);
    document.querySelector('.items').appendChild(newComputer);
  });
}

document.querySelector('.empty-cart').addEventListener('click', () => {
  document.querySelector('.cart__items').innerHTML = '';
  totalPrice();
  addLocalStorage();
});

window.onload = function onload() {
  fetchAPI();
  getLocalStorage();
};
