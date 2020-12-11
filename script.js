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
// Requisito 01
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}
// Requisito 02
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// Requisito 03
const cartItemClickListener = () => {
  const ol = document.querySelector('.cart__items');
  ol.addEventListener('click', (event) => {
    if (event.target.classList.contains('cart__item')) {
      event.target.remove();
    }
  });
};
// Requisito 02
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// Requisito 01
const addProductsOnScreen = (array) => {
  const items = document.querySelector('.items');
  array.forEach(element => items.appendChild(createProductItemElement(element)));
};
// Requisito 01
const api = () => new Promise((resolve, reject) => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then(data => data.results)
  .then(array => array.map(product => ({
    sku: product.id,
    name: product.title,
    image: product.thumbnail,
  })))
  .then(newArray => addProductsOnScreen(newArray))
  .then(results => resolve(results))
  .catch(results => reject(console.log(results)));
});

// Requisito 02
const apendItemToCart = (product) => {
  const cart = document.querySelector('.cart__items');
  const newProduct = createCartItemElement(product);
  cart.appendChild(newProduct);
};

// Requisito 02
const getItemToCart = async (ids) => {
  fetch(`https://api.mercadolibre.com/items/${ids}`)
  .then(data => data.json())
  .then((result) => {
    const { id, title, price } = result;
    return {
      sku: id,
      name: title,
      salePrice: price,
    };
  })
  .then(product => apendItemToCart(product));
};

// Requisito 02
const addItemToCart = () => {
  const section = document.querySelector('.items');
  section.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const item = event.target.parentNode;
      const sku = getSkuFromProductItem(item);
      getItemToCart(sku);
    }
  });
};

window.onload = function onload() {
  api();
  addItemToCart();
  cartItemClickListener();
};
