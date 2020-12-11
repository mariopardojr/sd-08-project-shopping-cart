const saveStorage = (id, title, price) => {
  if (Storage) {
    const cartItems = JSON.parse(localStorage.getItem('cart'));
    const arrayItems = (cartItems === null ? [] : cartItems);
    arrayItems.push({ id, title, price });
    localStorage.setItem('cart', JSON.stringify(arrayItems))
  }
}

const regainStorage = () => {
  if (Storage) {
    const regainItems = JSON.parse(localStorage.getItem('cart'));
    arrayItems = (regainItems === null ? [] : regainItems);
    arrayItems.forEach((element) => {
      const itemProduct = createCartItemElement(element);
      addToCart(itemProduct);
    });
  }
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const parentItens = document.querySelector('.cart__items');
  const item = event.target;
  parentItens.removeChild(item);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = sku;
  // li.addEventListener('click', cartItemClickListener);
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

const addToCart = (product) => {
  const itemCart = document.querySelector('.cart__items');
  itemCart.addEventListener('click', cartItemClickListener);
  itemCart.appendChild(product);
};

const fetchProductItem = (sku) => {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(resolve => resolve.json())
    .then((data) => {
      const itemProduct = createCartItemElement(data);
      addToCart(itemProduct);
      saveStorage(data.id, data.title, data.price);
    });
};

const createItem = (item) => {
  const product = document.querySelector('.items');
  product.appendChild(item);
  item.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const sku = event.currentTarget.firstChild.innerText;
      fetchProductItem(sku);
    }
  });
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const fetchApi = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(res => res.json())
    .then(data => data.results.forEach((element) => {
      const creatProduct = createProductItemElement(element);
      createItem(creatProduct);
    }));
};

window.onload = function onload() {
  fetchApi();
  regainStorage()
};
