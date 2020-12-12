const initLoading = () => {
  const loading = document.createElement('span');
  loading.className = 'loading';
  loading.innerText = 'Loading...';
  const parent = document.querySelector('.items');
  parent.appendChild(loading);
};

const endLoading = () => {
  setTimeout(() => {
    const parent = document.querySelector('.items');
    parent.removeChild(parent.firstChild);
  }, 2000);
};

const totalPrice = (sum) => {
  const total = document.querySelector('.total-price');
  total.innerHTML = sum;
};

const getPrice = () => {
  let sum = 0;
  const getItems = JSON.parse(localStorage.getItem('cartML'));
  if (getItems) {
    for (let index = 0; index < getItems.length; index += 1) {
      sum += getItems[index].price;
    }
  }
  totalPrice(sum);
};

const saveStorage = (id, title, price) => {
  if (Storage) {
    const getItems = JSON.parse(localStorage.getItem('cartML'));
    const arrayItems = (getItems === null ? [] : getItems);
    arrayItems.push({ id, title, price });
    localStorage.setItem('cartML', JSON.stringify(arrayItems));
  }
  getPrice();
};

const removeStorage = (sku) => {
  const arrayItems = JSON.parse(localStorage.getItem('cartML'));
  for (let index = 0; index < arrayItems.length; index += 1) {
    if (arrayItems[index].id === sku) {
      arrayItems.splice(index, 1);
      break;
    }
  }
  localStorage.setItem('cartML', JSON.stringify(arrayItems));
  getPrice();
};

const cartItemClickListener = (event) => {
  const parentItems = document.querySelector('.cart__items');
  const item = event.target;
  removeStorage(item.id);
  parentItems.removeChild(item);
};

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: R$${salePrice}`;
  return li;
};

const addToCart = (product) => {
  const itemCart = document.querySelector('.cart__items');
  itemCart.addEventListener('click', cartItemClickListener);
  itemCart.appendChild(product);
};

function clearCart() {
  const items = document.querySelector('.cart__items');
  items.innerHTML = '';
  localStorage.clear();
  getPrice();
}

const emptyCart = () => {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', clearCart);
};

const getLocalStorage = () => {
  if (Storage) {
    const getProducts = JSON.parse(localStorage.getItem('cartML'));
    arrayItems = (getProducts === null ? [] : getProducts);
    arrayItems.forEach((element) => {
      const itemProduct = createCartItemElement(element);
      addToCart(itemProduct);
    });
  }
  getPrice();
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

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ id: sku, title: name, thumbnail: image, price }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__price', `R$ ${(price).toFixed(2)}`));
  section.appendChild(createCustomElement('button', 'item__add', 'Add to Cart'));

  return section;
};

const fetchProducts = () => {
  initLoading();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(resolve => resolve.json())
    .then(data => data.results.forEach((element) => {
      const createProduct = createProductItemElement(element);
      createItem(createProduct);
    }))
    .then(endLoading());
};

window.onload = function onload() {
  fetchProducts();
  getLocalStorage();
  getPrice();
  emptyCart();
};
