let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

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

const getItem = id => (
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json())
    .then(data => data)
);

const getCartTotal = () => (
  new Promise(async (resolve) => {
    const itemsPromises = cartItems.map(cartItem => getItem(cartItem.id));
    const items = await Promise.all(itemsPromises).then(data => data);
    const total = items.reduce((acc, cur) => acc + cur.price, 0);
    resolve(total);
  })
);

const updateCartTotal = async () => {
  const total = await getCartTotal();
  const totalElement = document.querySelector('.cart__total');
  totalElement.textContent = `Total: R$${total.toFixed(2).replace('.', ',')}`;
};

function cartItemClickListener(event) {
  cartItems = cartItems.filter(item => item.elem !== event.target);
  event.target.remove();
  updateCartTotal();
}

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

// const createItems = async () => {
//   const items = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
//     .then(response => response.json())
//     .then(data => data.results);

//   const itemsContainer = document.querySelector('.items');
//   items.forEach((item) => {
//     const { id: sku, title: name, thumbnail: image } = item;
//     const productItem = createProductItemElement({ sku, name, image });
//     productItem.addEventListener('click', addItemToCartHandler);
//     itemsContainer.appendChild(productItem);
//   });
// };

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// const createCartItem = async (id, parent) => {
//   const item = await fetch(`https://api.mercadolibre.com/items/${id}`)
//     .then(response => response.json())
//     .then(data => data);
    const createCartItem = async (id) => {
      const cart = document.querySelector('.cart__items');
      const item = await getItem(id);
  const { id: sku, title: name, price: salePrice } = item;
  const newCartItem = createCartItemElement({ sku, name, salePrice });
  cart.appendChild(newCartItem);
  cartItems.push({ id: sku, elem: newCartItem });
  updateCartTotal();
};

const addItemToCartHandler = (event) => {
  if (event.target.classList.contains('item__add')) {
    const parent = event.target.parentNode;
    const id = getSkuFromProductItem(parent);
    createCartItem(id);
  };
};

const createItems = async () => {
  const items = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => data.results);

  const itemsContainer = document.querySelector('.items');
  items.forEach((item) => {
    const { id: sku, title: name, thumbnail: image } = item;
    const productItem = createProductItemElement({ sku, name, image });
    productItem.addEventListener('click', addItemToCartHandler);
    itemsContainer.appendChild(productItem);
  });
};

const clearCart = () => {
  const cart = document.querySelector('.cart__items');
  Array.from(cart.children).forEach(children => children.remove());
};

window.onload = function onload() {
  const clearCartButton = document.querySelector('.empty-cart');
  createItems();
  clearCartButton.addEventListener('click', clearCart);
};
