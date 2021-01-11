function saveCartList() {
  localStorage.setItem('list', document.querySelector('.cart__items').innerHTML);
}

async function totalCartPrice() {
  let finalCartPrice = 0;
  const cartProducts = document.querySelectorAll('.cart__item');
  cartProducts.forEach((item) => {
    finalCartPrice += parseFloat(item.innerHTML.split('$')[1]);
  });
  document.querySelector('.cart-price').innerHTML = finalCartPrice;
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

function cartItemClickListener(event) {
  event.target.remove();
  saveCartList();
  totalCartPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => {
      fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then(resolve => resolve.json())
        .then((data) => {
          const itemCart = {
            sku,
            name,
            salePrice: data.price,
          };
          document
            .querySelector('.cart__items')
            .appendChild(createCartItemElement(itemCart));
          saveCartList();
          totalCartPrice();
        });
    });
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function fetchRenderProducts() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const { results } = await response.json();
  results.forEach((product) => {
    const productItem = createProductItemElement(product);
    document.querySelector('.items').appendChild(productItem);
  });
}

function clearCartList() {
  const clearCartButton = document.querySelector('.empty-cart');
  clearCartButton.addEventListener('click', () => {
    const cartItemsToClear = document.querySelector('.cart__items');
    cartItemsToClear.innerHTML = '';
    saveCartList();
    totalCartPrice();
  });
}

function loadSaveCartList() {
  const savedCart = document.querySelector('.cart__items');
  savedCart.innerHTML = localStorage.getItem('list');
  document
    .querySelectorAll('.cart__items')
    .forEach(cartItem => cartItem.addEventListener('click', cartItemClickListener));
}

window.onload = function onload() {
  fetchRenderProducts();
  clearCartList();
  loadSaveCartList();
  totalCartPrice();
};
