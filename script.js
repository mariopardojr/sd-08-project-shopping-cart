const loadingApi = () => {
  const loading = document.createElement('span');
  loading.className = 'loading';
  loading.innerText = 'Loading...';
  const parent = document.querySelector('.items');
  parent.appendChild(loading);
}

const endLoading = () => {
  setTimeout(() => {
    const parent = document.querySelector('.items');
    parent.removeChild(parent.firstChild);
  }, 2000);
}

const totalPrice = (sum) => {
  const total = document.querySelector('.total-price');
  total.innerHTML = sum;
}

async function calcPrice() {
  let sum = 0;
  const cartItems = await JSON.parse(localStorage.getItem('cart'));
  if (cartItems) {
    for (let index = 0; index < cartItems.length; index += 1) {
      sum += cartItems[index].price;
    }
  }
  totalPrice(sum.toFixed(2));
}

const saveStorage = (id, title, price) => {
  if (Storage) {
    const cartItems = JSON.parse(localStorage.getItem('cart'));
    const arrayItems = (cartItems === null ? [] : cartItems);
    arrayItems.push({ id, title, price });
    localStorage.setItem('cart', JSON.stringify(arrayItems));
  }
  calcPrice();
}

const removeStorageItem = (sku) => {
  const arrayItems = JSON.parse(localStorage.getItem('cart'));
  for (let index = 0; index < arrayItems.length; index += 1) {
    if (arrayItems[index].id === sku) {
      arrayItems.splice(index, 1);
      break;
    }
  }
  localStorage.setItem('cartML', JSON.stringify(arrayItems));
  calcPrice();
}

const cartItemClickListener = (event) => {
  const items = document.querySelector('.cart__items');
  const item = event.target;
  removeStorageItem(item.id);
  items.removeChild(item);
}

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

const addCart = (xablau) => {
  const itemCart = document.querySelector('.cart__items');
  itemCart.addEventListener('click', cartItemClickListener);
  itemCart.appendChild(xablau);
}

const clearCart = () => {
  const allItems = document.querySelector('.cart__items');
  allItems.innerHTML = '';
  localStorage.clear();
  calcPrice();
}

const emptyCart = () => {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', clearCart);
}

const getStorage = () => {
  if (Storage) {
    const items = JSON.parse(localStorage.getItem('cart'));
    arrayOfItems = (items === null ? [] : items);
    arrayOfItems.forEach((e) => {
      const itemProduct = createCartItemElement(e);
      addCart(itemProduct);
    });
  }
  calcPrice();
}

const fetchProductItem = (sku) => {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(resolve => resolve.json())
    .then((data) => {
      const itemProduct = createCartItemElement(data);
      addCart(itemProduct);
      saveStorage(data.id, data.title, data.price);
    });
}

const createItem = (item) => {
  const product = document.querySelector('.items');
  product.appendChild(item);
  item.addEventListener('click', (e) => {
    if (e.target.className === 'item__add') {
      const sku = e.currentTarget.firstChild.innerText;
      fetchProductItem(sku);
    }
  });
}

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const createProductItemElement = ({ id: sku, title: name, thumbnail: image, price }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__price', `R$${(price)}`));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho'));

  return section;
}

function fetchProducts() {
  loadingApi();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(resolve => resolve.json())
    .then(data => data.results.forEach((element) => {
      const createProduct = createProductItemElement(element);
      createItem(createProduct);
    }))
    .then(endLoading());
}

window.onload = function onload() {
  fetchProducts();
  getStorage();
  calcPrice();
  emptyCart();
};
