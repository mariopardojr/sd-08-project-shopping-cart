window.onload = function onload() { };

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

function sumPrice() {
  const cartItems = document.querySelectorAll('.cart__item');
  const pricesArray = [];
  if (cartItems.length !== 0) {
    cartItems.forEach((price) => {
      pricesArray.push(Number(price.innerHTML.split('$')[1]));
    });
    const total = pricesArray.reduce((sum, current) => {
      const totalSum = sum + current;
      return totalSum;
    }, 0);
    document.querySelector('.total-price').innerHTML = total;
  } else {
    document.querySelector('.total-price').innerHTML = 0;
  }
}

function saveItems() {
  localStorage.clear();
  const itemsList = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('items', itemsList);
  const totalPrice = document.querySelector('.total-price').innerHTML;
  localStorage.setItem('total', totalPrice);
}

function cartItemClickListener(event) {
  event.target.remove();
  sumPrice();
  saveItems();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function productList() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then(data => data.results.forEach((item) => {
    const elementInfo = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };
    document.querySelector('.items').appendChild(createProductItemElement(elementInfo));
  }));
}

function addProductCart() {
  document.querySelector('.items').addEventListener('click', (event) => {
    const sku = getSkuFromProductItem(event.target.parentNode);
    if (event.target.className === 'item__add') {
      fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(response => response.json())
      .then((data) => {
        const productInfo = {
          sku,
          name: data.title,
          salePrice: data.price,
        };
        document.querySelector('.cart__items').appendChild(createCartItemElement(productInfo));
        sumPrice();
        saveItems();
      });
    }
  });
}

function recoveryItems() {
  if (localStorage.items !== undefined) {
    document.querySelector('.cart__items').innerHTML = localStorage.getItem('items');
    document.querySelectorAll('.cart__item').forEach(item => item.addEventListener('click', cartItemClickListener));
    document.querySelector('.total-price').innerHTML = localStorage.getItem('total');
  }
}

function clearCart() {
  document.querySelector('.empty-cart').addEventListener('click', () => document
  .querySelectorAll('.cart__item').forEach((item) => {
    item.remove();
    document.querySelector('.total-price').innerHTML = 0;
    saveItems();
  }));
}

window.onload = function () {
  recoveryItems();
  productList();
  addProductCart();
  clearCart();
};
