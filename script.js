function localStorageItems() {
  const itemsCart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', itemsCart);
}

function sumPrices() {
  let sum = 0;
  const products = document.querySelectorAll('.cart__item');
  const price = document.querySelector('.total-price');
  products.forEach((item) => {
    sum += parseFloat(item.innerHTML.split('$')[1]);
  });
  price.innerHTML = Math.round(sum * 100) / 100;
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

function createCartItemElement(product) {
  const li = document.createElement('li');
  const { id, title, price } = product;
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  return li;
}

async function addItemToCart(event) {
  const sku = event.target.parentNode.querySelector('.item__sku').innerText;
  const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const result = await response.json();
  const cartList = document.querySelector('.cart__items');
  cartList.appendChild(createCartItemElement(result));
  localStorageItems();
  sumPrices();
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  button = section.querySelector('.item__add');
  button.addEventListener('click', addItemToCart);
  return section;
}

async function fetchAndRenderizeProducts() {
  try {
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const { results } = await response.json();
    const loading = document.querySelector('.loading');
    loading.remove();
    results.forEach((product) => {
      const productItem = createProductItemElement(product);
      document.querySelector('.items').appendChild(productItem);
    });
  } catch (error) {
    console.log('erro aqui', error);
  }
}

function emptyCart() {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = '';
  localStorageItems();
  sumPrices();
}

function restoreStorage() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart');
  sumPrices();
}

window.onload = function onload() {
  const emptyBtn = document.querySelector('.empty-cart');
  emptyBtn.addEventListener('click', emptyCart);

  const cart = document.querySelector('.cart');
  cart.addEventListener('click', (event) => {
    if (event.target.matches('.cart__item')) {
      event.target.remove();
      sumPrices();
      localStorageItems();
    }
  });

  fetchAndRenderizeProducts();
  restoreStorage();
};
