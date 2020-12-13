let total = 0;
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
function priceCalculator(price, operator) {
  const totalPrice = document.querySelector('.total-price');
  if (operator === true) {
    total += price;
  } else {
    total -= price;
  }
  totalPrice.innerText = parseFloat(total);
}
function cartItemClickListener(event) {
  // coloque seu código aqui
  const [, price] = event.target.innerHTML.split('PRICE: $');
  priceCalculator(price, false);
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// MY FUNCTIONS
function loading(status) {
  const items = document.querySelector('.items');
  const span = document.createElement('span');
  span.classList.add('loading');
  setTimeout(() => {
    if (status === true) {
      span.innerHTML = 'loading...';
      items.appendChild(span);
    } else {
      setTimeout(() => {
        const element = document.querySelector('.loading');
        element.remove();
      }, 2000);
    }
  }, 2000);
}
function objectConvert(element, price) {
  const result = {};
  result.sku = element.id;
  result.name = element.title;
  if (!price) {
    result.image = element.thumbnail;
    return result;
  }
  result.salePrice = element.price;
  return result;
}
function clearCart() {
  const totalPrice = document.querySelector('.total-price');
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', () => {
    const cartList = document.querySelectorAll('.cart__item');
    if (cartList.length > 0) cartList.forEach(li => li.remove());
    total = 0;
    totalPrice.innerText = parseFloat(total);
  });
}
function requestAPI(endPoint) {
  loading(true);
  return fetch(endPoint)
    .then(response => response.json())
    .then(loading(false));
}
function addComputerToCart(event) {
  const productId = event.target.parentElement.firstChild.innerText;
  const endPoint = `https://api.mercadolibre.com/items/${productId}`;
  const olCart = document.querySelector('.cart__items');
  requestAPI(endPoint).then((result) => {
    olCart.appendChild(createCartItemElement(objectConvert(result, true)));
    priceCalculator(result.price, true);
  });
}

function createListOfComputers() {
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const items = document.querySelector('.items');
  requestAPI(endPoint)
    .then(object =>
      object.results.forEach(element =>
        items.appendChild(createProductItemElement(objectConvert(element))),
      ),
    )
    .then(() => {
      const buttons = document.querySelectorAll('.item__add');
      buttons.forEach(button =>
        button.addEventListener('click', e => addComputerToCart(e)),
      );
    });
}
window.onload = function onload() {
  createListOfComputers();
  clearCart();
};
