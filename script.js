let storedCartItems = [];

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

const updateTotalPrice = async () => {
  const total = await (storedCartItems.map(e => e.salePrice).reduce((curr, tot) => curr + tot));
  document.querySelector('.total-price').innerHTML = total;
};

const updateCartLocalStorage = () => {
  if (storedCartItems.length === 0) {
    localStorage.setItem('cart', '');
    document.querySelector('.total-price').innerHTML = 0;
  } else {
    localStorage.setItem('cart', JSON.stringify(storedCartItems));
    updateTotalPrice();
  }
};

function cartItemClickListener(event) {
  const target = event.target;
  storedCartItems = storedCartItems.filter(e => e.element !== target);
  console.log(storedCartItems);
  target.remove();
  updateCartLocalStorage();
}

const loadCartLocalStorage = () => {
  const stored = localStorage.getItem('cart');
  if (stored) {
    JSON.parse(localStorage.getItem('cart')).forEach((e) => {
      const { sku, name, salePrice } = e;
      const newToCart = createCartItemElement({ sku, name, salePrice });
      newToCart.addEventListener('click', cartItemClickListener);
      storedCartItems.push({ sku, name, salePrice, element: newToCart });
      document.querySelector('.cart__items').appendChild(newToCart);
    });
  }
  updateCartLocalStorage();
};

const clearCartItems = () => {
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', () => {
    storedCartItems = [];
    document.querySelector('.cart__items').innerHTML = '';
    updateCartLocalStorage();
  });
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
    const { id: sku, title: name, price: salePrice } = item;
    const newToCart = createCartItemElement({ sku, name, salePrice });
    newToCart.addEventListener('click', cartItemClickListener);
    storedCartItems.push({ sku, name, salePrice, element: newToCart });
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
