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
  event.target.remove();
  updateCartLocalStorage();
}

const loadCartLocalStorage = () => {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart');
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach(e => e.addEventListener('click', cartItemClickListener));
};

const clearCartItems = () => {
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    updateCartLocalStorage();
  });
};

const updateCartLocalStorage = () => {
  const cartItems = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cartItems);
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = async (event) => {
  if (event.target.tagName === 'BUTTON') {
    const id = event.target.parentNode.firstChild.innerText;
    const item = await fetch(`https://api.mercadolibre.com/items/${id}`).then(e => e.json());
    const { id: sku, title: name, base_price: salePrice } = item;
    const newToCart = createCartItemElement({ sku, name, salePrice });
    newToCart.addEventListener('click', cartItemClickListener);
    document.querySelector('.cart__items').appendChild(newToCart);
    updateCartLocalStorage();
  }
};

const createItems = async () => {
  const itemsList = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then(obj => obj.json())
    .then(obj => obj.results);

  const itemsContainer = document.querySelector('.items');
  itemsContainer.innerHTML = '';

  itemsList.forEach((e) => {
    // Olhei o projeto do @paulohbsimoes pq não estava coseguindo passar a url da img corretamente
    const { id: sku, title: name, thumbnail: image } = e;
    const newProduct = createProductItemElement({ sku, name, image });
    newProduct.addEventListener('click', addToCart);
    itemsContainer.appendChild(newProduct);
  });
};

window.onload = function onload() {
  loadCartLocalStorage();
  clearCartItems();
  createItems();
};
