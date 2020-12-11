window.onload = function onload() { };

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

// REQ 4: Saving and recovering cart list from local storage
const saveCartInLocalStorage = () => {
  const cartItems = document.querySelector('ol.cart__items');
  localStorage.cartList = cartItems.innerHTML;
};

const recoverCart = () => {
  if (localStorage.cartList) {
    const cartItems = document.querySelector('ol.cart__items');
    cartItems.innerHTML = localStorage.cartList;
  }
};
// ---------------------------------------------------------

function cartItemClickListener(event) {
  event.target.remove();
  saveCartInLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// REQ 2: Adding listener to Fetch product's info and append it to the cart list
const addToCartListener = (event) => {
  const cartItems = document.querySelector('ol.cart__items');
  const itemId = getSkuFromProductItem(event.target.parentElement);
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then(response => response.json())
    .then(({ id, title, price }) => {
      const obj = {
        sku: id,
        name: title,
        salePrice: price,
      };
      cartItems.appendChild(createCartItemElement(obj));
      saveCartInLocalStorage();
    });
};
// --------------------------------------------------------------------------

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addToCartBtn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addToCartBtn.addEventListener('click', addToCartListener);
  section.appendChild(addToCartBtn);

  return section;
}

// REQ 1: Fetching products and appending them to the page
const createProductsList = (product) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
    .then(response => response.json())
    .then(data =>
      data.results.forEach(({ id, title, thumbnail }) => {
        const obj = {
          sku: id,
          name: title,
          image: thumbnail,
        };
        const itemsSection = document.querySelector('section.items');
        itemsSection.appendChild(createProductItemElement(obj));
      }),
    );
};
// ------------------------------------------------------

window.onload = async () => {
  await createProductsList('computador');
  recoverCart();
};
