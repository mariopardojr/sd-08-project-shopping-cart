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
async function getTotalFromCartItems(cartItems, num = 0) {
  return cartItems.reduce((total, cartItem) => {
    const pattern = /(\d+[.]?\d{0,2})$/g;
    const matcher = cartItem.innerText.match(pattern);
    const itemPrice = parseFloat(matcher);
    const newTotal = total + itemPrice;
    return parseFloat(newTotal.toFixed(2));
  }, num);
}
const asyncSum = async (num = 0) => {
  const cartItems = Array.from(document.querySelectorAll('.cart__item'));
  let totalPrice = 0;
  if (cartItems.length !== 0) {
    totalPrice = await getTotalFromCartItems(cartItems, num);
  }
  return totalPrice;
};
const createTotalDiv = async () => {
  const totalDiv = document.createElement('div');
  totalDiv.className = 'total-div';
  const legendField = createCustomElement('span', 'total-price-description', 'Total: R$');
  const totalField = createCustomElement('span', 'total-price', await asyncSum());
  totalDiv.appendChild(legendField);
  totalDiv.appendChild(totalField);
  return totalDiv;
};
async function updateTotalField() {
  const cartElement = document.querySelector('.cart');
  const emptyButton = cartElement.querySelector('.empty-cart');
  const totalField = cartElement.querySelector('.total-price');
  if (!totalField) {
    const totalDiv = await createTotalDiv();
    cartElement.insertBefore(totalDiv, emptyButton);
  } else {
    totalField.innerText = `${await asyncSum()}`;
  }
}

function cartItemClickListener(event) {
  const cartItem = event.target;
  cartItem.parentNode.removeChild(cartItem);
  const cartSection = document.querySelector('.cart__items');
  updateTotalField();
  localStorage.setItem('oldCart', JSON.stringify(cartSection.innerHTML));
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const loadCartItem = (item) => {
  const cartSection = document.querySelector('.cart__items');
  const cartItem = createCartItemElement(item);
  cartSection.appendChild(cartItem);
  updateTotalField();
  localStorage.setItem('oldCart', JSON.stringify(cartSection.innerHTML));
};
async function productByID(itemID, loadFn) {
  const url = `https://api.mercadolibre.com/items/${itemID}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    loadFn(data);
  } catch (err) {
    throw new Error(err);
  }
}
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.querySelector('.item__add').addEventListener('click', async (element) => {
    const itemSection = element.target.parentNode;
    const productID = getSkuFromProductItem(itemSection);
    await productByID(productID, loadCartItem);
  });
  return section;
}

async function productsByQuery(word, loadFn) {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${word}`;
  try {
    const response = await fetch(url);
    const { results } = await response.json();
    loadFn(results);
  } catch (err) {
    throw new Error(err);
  }
}

const loadProducts = (products) => {
  const itemSection = document.querySelector('.items');
  products.forEach((cartItem) => {
    itemSection.appendChild(createProductItemElement(cartItem));
  });
};

const oldCart = () => {
  if (localStorage.getItem('oldCart')) {
    const cartSection = document.querySelector('.cart__items');
    cartSection.innerHTML = JSON.parse(localStorage.getItem('oldCart'));
    const oldCartItems = cartSection.children;
    Array.from(oldCartItems).forEach(oldCartItem => oldCartItem.addEventListener('click', cartItemClickListener));
  }
};

const emptyCart = ({ target }) => {
  const cart = target.parentNode;
  cart.querySelector('.cart__items').innerHTML = '';
  updateTotalField();
  localStorage.removeItem('oldCart');
};

const emptyButtonListener = () => {
  document.querySelector('.empty-cart').addEventListener('click', evento => emptyCart(evento));
};

window.onload = function onload() {
  oldCart();
  updateTotalField();
  emptyButtonListener();
  productsByQuery('computer', loadProducts);
};
