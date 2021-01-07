function saveItems() {
  const cartItem = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cartItem);
}

function totalPrice() {
  const list = document.querySelectorAll('.cart__item');
  let total = 0;
  list.forEach((item) => {
    total += parseFloat(item.innerHTML.split('$')[1])
  });
  document.querySelector('.total-price').innerHTML = Math.round(total * 100) / 100;
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
  event.target.parentElement.removeChild(event.target);
  saveItems();
  totalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

function generateItemsList() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((data) => {
      document.querySelector('.loading').remove()
      data.results.forEach((element) => {
        const elementsList = {
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(elementsList));
      })
    },
    );
}

function addItem() {
  const items = document.querySelector('.items');
  items.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const parent = event.target.parentElement;
      const sku = getSkuFromProductItem(parent);
      fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then(response => response.json())
        .then((item) => {
          const elementsList = {
            sku,
            name: item.title,
            salePrice: item.price,
          };
          const cart = document.querySelector('.cart__items');
          cart.appendChild(createCartItemElement(elementsList));
          saveItems();
          totalPrice();
        });
    }
  });
}

function loadItems() {
  const savedCart = localStorage.getItem('cart');
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = savedCart;
  cart.addEventListener('click', (event) => {
    if (event.target.classList.contains('cart__item')) {
      cartItemClickListener(event);
    }
  });
  totalPrice();
}

function deleteAllCart() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerText = '';
    totalPrice();
    saveItems();
  });
}

window.onload = function onload() {
  loadItems();
  generateItemsList();
  addItem();
  deleteAllCart();
};
