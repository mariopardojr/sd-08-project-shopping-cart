let cart = [];

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

async function cartItemClickListener(event, price) {
  const cartItems = document.querySelector('.cart__items');
  const totalPrice = document.querySelector('.total-price');
  let total = Math.abs((parseFloat(totalPrice.innerText) - price)).toFixed(2);
  if (total.substr(-3) === '.00') { total = total.slice(0, -3); }
  localStorage.setItem('total', total);
  totalPrice.innerText = await localStorage.getItem('total');
  cartItems.removeChild(event.target);
}

async function sum(price) {
  const totalPrice = document.querySelector('.total-price');
  let total = Math.abs((parseFloat(totalPrice.innerText) + price)).toFixed(2);
  if (total.substr(-3) === '.00') { total = total.slice(0, -3); }
  // totalPrice.innerText = await localStorage.getItem('total').substr(0);
  localStorage.setItem('total', total);
  totalPrice.innerText = await localStorage.getItem('total');
}

function createCartItemElement({ sku, name, salePrice }, newItem) {
  cart.push({ sku, name, salePrice });
  const stringCart = JSON.stringify(cart);
  localStorage.setItem('cart', stringCart);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', () => cartItemClickListener(event, salePrice));
  if (!newItem) sum(salePrice);
  return li;
}

function createProductItemElement({ sku, name, image, salePrice }) {
  const cartItems = document.querySelector('.cart__items');
  const section = document.createElement('section');
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);
  button.addEventListener('click', () => cartItems.appendChild(createCartItemElement({ sku, name, salePrice })));

  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function empty() {
  const cartItems = document.querySelector('.cart__items');
  const totalPrice = document.querySelector('.total-price');
  cartItems.innerHTML = '';
  totalPrice.innerText = 0;
  cart = [];
  localStorage.clear();
}

function loadCart() {
  const cartItems = document.querySelector('.cart__items');
  const totalPrice = document.querySelector('.total-price');
  const lsCart = localStorage.getItem('cart');
  totalPrice.innerText = localStorage.getItem('total');
  JSON.parse(lsCart).forEach((cartItem) => {
    cartItems
      .appendChild(createCartItemElement({
        sku: cartItem.sku, name: cartItem.name, salePrice: cartItem.salePrice,
      }, newItem = true));
  });
}

function removeLoading() {
  const loading = document.querySelector('.loading');
  loading.remove();
}

window.onload = function onload() {
  const items = document.querySelector('.items');
  if (localStorage.getItem('cart')) loadCart();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      removeLoading();
      response.json().then((data) => {
        Object.values(data.results).forEach((product) => {
          const productData = {
            sku: product.id,
            name: product.title,
            image: product.thumbnail,
            salePrice: product.price,
          };
          items.appendChild(createProductItemElement(productData));
        });
      });
    });
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', empty);
};
