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
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  //li.addEventListener('click', cartItemClickListener);
  return li;
}

function generateItemsList() {
  fetch("https://api.mercadolibre.com/sites/MLB/search?q=computador")
    .then(response => response.json())
    .then(data => data.results.forEach(element => {
      const elementsList = {
        sku: element.id,
        name: element.title,
        image: element.thumbnail,
      }
      document.querySelector('.items').appendChild(createProductItemElement(elementsList));
    }),
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
        });
    }
  });
}

function saveItems() {
  const cartItem = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cartItem);
}

function loadItems() {
  const savedCart = localStorage.getItem('cart');
  const cart = document.querySelector('.cart__items')
  cart.innerHTML = savedCart;
  cart.addEventListener('click', (event) => {
    if (event.target.classList.contains('cart__item')) {
      cartItemClickListener(event);
    }
  })
}

window.onload = function onload() {
  loadItems();
  generateItemsList();
  addItem();
};
