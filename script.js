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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartValues() {
  let sum = 0;
  for (let i = 0; i < localStorage.length; i += 1) {
    if (localStorage.length > 0) {
      const value = localStorage.getItem(localStorage.key(i));
      sum += parseFloat(value);
    }
  }
  return sum;
}

async function LocalStorageCartSum() {
  const price = document.querySelector('.total-price');
  price.innerText = cartValues();
}

const localStorageItem = (key, value) => {
  localStorage.setItem(key, value);
};

function cartItemClickListener(event) {
  localStorage.removeItem(event.target.innerText);
  event.target.parentNode.removeChild(event.target);
  LocalStorageCartSum();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchCartShopping = (id) => {
  const endPoint = `https://api.mercadolibre.com/items/${id}`;

  fetch(endPoint)
    .then(response => response.json())
    .then((data) => {
      const cartItems = document.querySelector('.cart__items');

      const objectItems = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };

      const product = createCartItemElement(objectItems);
      cartItems.appendChild(product);

      localStorageItem(product.innerText, objectItems.salePrice);
      LocalStorageCartSum();
    });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  const addButton = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  );
  addButton.addEventListener('click', async (event) => {
    const elementId = await event.target.parentElement;
    await fetchCartShopping(getSkuFromProductItem(elementId));
  });

  section.appendChild(addButton);

  return section;
}

function removeLoad() {
  document.querySelector('.loading').remove();
}

const fetchPruductIntems = () => {
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

  fetch(endPoint)
    .then(response => response.json())
    .then((data) => {
      const items = document.querySelector('.items');

      removeLoad();

      data.results.forEach((productItems) => {
        const { id: sku, title: name, thumbnail: image } = productItems;
        const product = createProductItemElement({ sku, name, image });

        items.appendChild(product);
      });
    });
};

const loadLocalStorageItem = () => {
  const cartShopping = document.querySelector('.cart__items');

  for (let index = 0; index < localStorage.length; index += 1) {
    const item = document.createElement('li');
    item.className = 'cart__item';
    item.innerText = localStorage.key(index);
    item.addEventListener('click', cartItemClickListener);
    cartShopping.appendChild(item);
    LocalStorageCartSum();
  }
};

const clearCart = () => {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', () => {
    const itemsLi = document.querySelector('.cart__items');
    itemsLi.innerHTML = '';
    localStorage.clear();
    LocalStorageCartSum();
  });
};

window.onload = async function onload() {
  await fetchPruductIntems();
  loadLocalStorageItem();
  await LocalStorageCartSum();
  clearCart();
};
