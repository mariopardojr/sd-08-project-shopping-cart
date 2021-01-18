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
  const product = document.querySelector('.items');
  product.appendChild(section);

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function localStorageItems() {
  const cartItems = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cartItems);
}

function totalPrice() {
  let total = 0;
  const items = document.querySelectorAll('.cart__item');
  const value = document.querySelector('.total-price');
  items.forEach((item) => {
    total += parseFloat(item.innerHTML.split('$')[1]);
  });
  value.innerHTML = Math.round(total * 100) / 100;
}

function cartItemClickListener(event) {
  const parentElement = event.target.parentElement;
  parentElement.removeChild(event.target);
  localStorageItems();
  totalPrice()
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  const ol = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  ol.appendChild(li);
  localStorageItems();
  totalPrice()
  return li;
}

function getProducts() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json()
        .then((data) => {
          document.querySelector('.loading').remove();
          data.results.map((item) => {
            const items = {
              sku: item.id,
              name: item.title,
              image: item.thumbnail,
            };
            return createProductItemElement(items);
          });
        });
    });
}

function addItem() {
  document.querySelector('.items').addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const sku = getSkuFromProductItem(event.target.parentElement);
      fetch(`https://api.mercadolibre.com/items/${sku}`).then((response) => {
        response.json().then((data) => {
          const product = {
            sku,
            name: data.title,
            salePrice: data.price,
          };
          return createCartItemElement(product);
        });
      });
    }
  });
}

function loadCartItems() {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = localStorage.getItem('cart');
  cartList.addEventListener('click', (event) => {
    if (event.target.classList.contains('cart__item')) {
      cartItemClickListener(event);
    }
  });
  totalPrice()
}

function empty() {
  const button = document.querySelector('.empty-cart');
  const cart = document.querySelector('.cart__items');

  button.addEventListener('click', () => {
    cart.innerHTML = '';
    totalPrice();
    localStorageItems();
  });
}

window.onload = function onload() {
  getProducts();
  addItem();
  loadCartItems();
  empty();
};
