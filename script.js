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

function cartItemClickListener(event) {
  // coloque seu código aqui
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
function objectConvert(element, price) {
  const result = {};
  result.sku = element.id;
  result.name = element.title;
  if (price) {
    result.image = element.thumbnail;
    return result;
  }
  result.salePrice = element.price;
  return result;
}
function clearCart() {
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', () => {
    const cartList = document.querySelectorAll('.cart__item');
    if (cartList.length > 0) cartList.forEach(li => li.remove());
  });
}
function requestAPI(endPoint) {
  return fetch(endPoint).then(response => response.json());
}

function addComputerToCart(event) {
  const productId = event.target.parentElement.firstChild.innerText;
  const endPoint = `https://api.mercadolibre.com/items/${productId}`;
  const olCart = document.querySelector('.cart__items');
  requestAPI(endPoint).then(result =>
    olCart.appendChild(createCartItemElement(objectConvert(result))),
  );
  console.log(endPoint);
}
function createListOfComputers() {
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const items = document.querySelector('.items');
  requestAPI(endPoint)
    .then(object =>
      object.results.forEach(element =>
        items.appendChild(
          createProductItemElement(objectConvert(element, true)),
        ),
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
