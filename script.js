function loadCartList() {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = localStorage.getItem('cart');
  const totalPrice = document.querySelector('.total-price');
  let price = parseFloat(localStorage.getItem('totalPrice'));
  if (!price) {
    price = 0;
    localStorage.setItem('totalPrice', price.toFixed(2));
  }
  totalPrice.innerHTML = `${price}`;
}

function clearCartList() {
  const cartList = document.querySelector('.cart__items');
  while (cartList.firstChild) {
    cartList.removeChild(cartList.firstChild);
  }
  localStorage.setItem('cart', '');
  localStorage.setItem('totalPrice', '0');
  loadCartList();
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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const cartList = document.querySelector('.cart__items');
  const price = parseFloat(event.target.innerText.split('$')[1]);
  const actualPrice = parseFloat(localStorage.getItem('totalPrice'));
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = `${actualPrice - price}`;
  localStorage.setItem('totalPrice', (actualPrice - price).toFixed(2));
  cartList.removeChild(event.target);
  localStorage.setItem('cart', cartList.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getProductList = async () => {
  const data = await fetch(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador',
  );
  return (await data.json()).results;
};

const addCart = sku => async (event) => {
  const url = `https://api.mercadolibre.com/items/${sku}`;
  const product = await (await fetch(url)).json();
  document.querySelector('.cart__items').appendChild(
    createCartItemElement({
      sku: product.id,
      name: product.title,
      salePrice: product.price,
    }),
  );
  localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);
  const actualPrice = parseFloat(localStorage.getItem('totalPrice'));
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = `${product.price + actualPrice}`;
  localStorage.setItem('totalPrice', (product.price + actualPrice).toFixed(2));
};

const displayList = async () => {
  const productList = (await getProductList()).map(item => ({
    sku: item.id,
    name: item.title,
    image: item.thumbnail,
    salePrice: item.price,
  }));
  productList.forEach((item) => {
    const product = createProductItemElement(item);
    product
      .querySelector('button')
      .addEventListener('click', addCart(item.sku));
    document.querySelector('.items').appendChild(product);
  });
  loadCartList();
  document.querySelectorAll('.cart__item').forEach(item => item.addEventListener('click', cartItemClickListener));
  document.querySelector('.empty-cart').addEventListener('click', clearCartList);
};

window.onload = function onload() {
  displayList();
};
