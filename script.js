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

function removeFromLocalStorage(id) {
  const cartList = JSON.parse(localStorage.cartList);
  const newCartList = cartList.filter(cartItem => cartItem.sku !== id);

  if (newCartList.length === 0) {
    localStorage.removeItem('cartList');
  } else {
    localStorage.cartList = JSON.stringify(newCartList);
  }
}

function addToLocalStorage(item) {
  let cartList;
  if (localStorage.cartList) {
    cartList = JSON.parse(localStorage.cartList);
    cartList.push(item);
  } else {
    cartList = [item];
  }

  localStorage.cartList = JSON.stringify(cartList);
}

function cartItemClickListener(event) {
  const itemToRemove = event.target;
  const parent = itemToRemove.parentNode;
  const itemToRemoveId = itemToRemove.innerText.split(' ')[1];

  parent.removeChild(itemToRemove);
  removeFromLocalStorage(itemToRemoveId);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function recoveryData() {
  if (localStorage.cartList) {
    const cartList = JSON.parse(localStorage.cartList);

    cartList.forEach((item) => {
      const itemToCartElement = createCartItemElement(item);
      const cartList = document.querySelector('.cart__items');
      cartList.appendChild(itemToCartElement);
    });
  }
}

async function addItemToCart(event) {
  const target = event.target;
  const targetParentId = target.parentNode.querySelector('.item__sku').innerText;
  const request = await fetch(`https://api.mercadolibre.com/items/${targetParentId}`);
  const item = await request.json();
  const { id: sku, title: name, price: salePrice } = item;

  const itemToCart = { sku, name, salePrice };
  const itemToCartElement = createCartItemElement(itemToCart);
  const cartList = document.querySelector('.cart__items');
  cartList.appendChild(itemToCartElement);

  addToLocalStorage(itemToCart);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  const newButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  newButton.addEventListener('click', addItemToCart);
  section.appendChild(newButton);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function createProductList(query = 'computador') {
  const itemsSection = document.querySelector('.items');
  const request = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const requestObject = await request.json();
  const requestList = requestObject.results;

  requestList.forEach((product) => {
    const { id: sku, title: name, thumbnail: image } = product;
    const productElement = createProductItemElement({ sku, name, image });
    itemsSection.appendChild(productElement);
  });
}

window.onload = async function onload() {
  await createProductList();
  recoveryData();
};
