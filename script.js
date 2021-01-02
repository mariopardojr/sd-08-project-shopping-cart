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

const productList = (product) => {
  const itemsSection = document.querySelector('.items');

  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
  .then(response => response.json())
  .then((data) => {
    const results = data.results;
    results.forEach(({ id, title, thumbnail }) => {
      const items = {
        sku: id,
        name: title,
        image: thumbnail,
      };

      itemsSection.appendChild(createProductItemElement(items));
    });
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveShoppingCart() {
  const cart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cart);
}

function cartItemClickListener(event) {
  const parent = event.target.parentElement;
  parent.removeChild(event.target);
  saveShoppingCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

// fiz com a ajuda do plantão do shopping cart durante o recesso
function addProductToCart() {
  const items = document.querySelector('.items');

  items.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const parent = event.target.parentElement;
      const id = getSkuFromProductItem(parent);
      fetch(`https://api.mercadolibre.com/items/${id}`)
      .then(response => response.json())
      .then((data) => {
        const obj = {
          sku: data.id,
          name: data.title,
          salePrice: data.price,
        };
        const element = createCartItemElement(obj);
        const cartItem = document.querySelector('.cart__items');
        cartItem.appendChild(element);
        saveShoppingCart();
      });
    }
  });
}

function loadShoppingCart() {
  const itemsSavedFromCart = localStorage.getItem('cart');
  const cartItem = document.querySelector('.cart__items');
  cartItem.innerHTML = itemsSavedFromCart;
  cartItem.addEventListener('click', (event) => {
    if (event.target.classList.contains('cart__item')) {
      cartItemClickListener(event);
    }
  });
}

window.onload = () => {
  productList('computador');
  addProductToCart();
  loadShoppingCart();
};
