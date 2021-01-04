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

function cartSaveChange() {
  const cartSelect = document.querySelector('.cart__items');
  console.log(cartSelect);
  localStorage.setItem('cart', cartSelect.innerHTML);
}

async function priceTotal() {
  const items = document.querySelectorAll('.cart__item');
  let total = 0;
  items.forEach((item) => {
    total += parseFloat(item.innerHTML.split('$')[1]);
  });
  document.querySelector('.total-price').innerText = `Preço total: $${total.toFixed(2)}`;
}

function cartItemClickListener(event) {
  event.path[1].removeChild(event.path[0]);
  priceTotal();
  cartSaveChange();
}

function cartLoadChange() {
  const cartSelect = document.querySelector('.cart__items');
  if (localStorage.cart) {
    cartSelect.innerHTML = localStorage.getItem('cart');
    cartSelect.addEventListener('click', ((event) => {
      if (event.target.classList.contains('cart__item')) {
        cartItemClickListener(event);
      }
    }));
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function createCartItem(event) {
  const sku = getSkuFromProductItem(event.target.parentElement);
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then((itemTarget) => {
      const objTarget = {
        sku,
        name: itemTarget.title,
        salePrice: itemTarget.price,
      };
      document.querySelector('.cart__items').appendChild(createCartItemElement(objTarget));
    });
  priceTotal();
  cartSaveChange();
}

function eventClickButtonItem() {
  const buttonItems = document.querySelectorAll('.item__add');
  buttonItems.forEach(buttonItem => buttonItem.addEventListener('click', createCartItem));
}

async function generateItemsList() {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((listItems) => {
      listItems.results.forEach((item) => {
        const obj = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(obj));
      });
    });
  eventClickButtonItem();
}

function createPriceElement(callback) {
  const pPrice = document.createElement('p');
  pPrice.className = 'total-price';
  document.querySelector('.cart').appendChild(pPrice);
  callback();
}

window.onload = function onload() {
  generateItemsList();
  cartLoadChange();
  createPriceElement(priceTotal);
};
